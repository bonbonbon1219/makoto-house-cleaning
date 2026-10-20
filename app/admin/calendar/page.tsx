"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminChrome } from "@/components/admin/AdminChrome";
import {
  MARK_LABEL,
  tokyoYearMonth,
  type DayInfo,
  type MarkValue,
} from "@/lib/booking/types";
import styles from "../admin.module.css";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const MARK_OPTIONS: MarkValue[] = ["open", "few", "full"];

export default function AdminCalendarPage() {
  const router = useRouter();
  const initial = useMemo(() => tokyoYearMonth(), []);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [minYear, setMinYear] = useState(initial.year);
  const [minMonth, setMinMonth] = useState(initial.month);
  const [days, setDays] = useState<DayInfo[]>([]);
  const [selected, setSelected] = useState<DayInfo | null>(null);
  const [mark, setMark] = useState<MarkValue>("open");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const dayMap = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);
  const canGoPrev = year > minYear || (year === minYear && month > minMonth);

  async function load(y = year, m = month) {
    setError("");
    const res = await fetch(`/api/admin/availability?year=${y}&month=${m}`, { cache: "no-store" });
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = (await res.json()) as {
      ok?: boolean;
      days?: DayInfo[];
      year?: number;
      month?: number;
      minYear?: number;
      minMonth?: number;
      error?: string;
    };
    if (!res.ok || !data.ok || !data.days) {
      setError("読み込みに失敗しました");
      return;
    }
    setDays(data.days);
    if (data.year && data.month) {
      setYear(data.year);
      setMonth(data.month);
    }
    if (data.minYear && data.minMonth) {
      setMinYear(data.minYear);
      setMinMonth(data.minMonth);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const cells = useMemo(() => {
    const first = new Date(`${year}-${String(month).padStart(2, "0")}-01T12:00:00+09:00`);
    const pad = first.getDay();
    const last = new Date(year, month, 0).getDate();
    const list: Array<{ key: string; date?: string; day?: DayInfo }> = [];
    for (let i = 0; i < pad; i += 1) list.push({ key: `p-${i}` });
    for (let d = 1; d <= last; d += 1) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      list.push({ key: date, date, day: dayMap.get(date) });
    }
    return list;
  }, [year, month, dayMap]);

  function pick(day: DayInfo) {
    setSelected(day);
    setMark(day.mark);
  }

  function shiftMonth(delta: number) {
    const next = new Date(year, month - 1 + delta, 1);
    const nextYear = next.getFullYear();
    const nextMonth = next.getMonth() + 1;
    if (delta < 0 && (nextYear < minYear || (nextYear === minYear && nextMonth < minMonth))) {
      return;
    }
    setYear(nextYear);
    setMonth(nextMonth);
    setSelected(null);
  }

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selected.date, mark }),
      });
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = (await res.json()) as { ok?: boolean; day?: DayInfo };
      if (!res.ok || !data.ok || !data.day) throw new Error("save_failed");
      setSelected(data.day);
      await load();
    } catch {
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  function markClass(value: MarkValue) {
    if (value === "open") return styles.markOpen;
    if (value === "few") return styles.markFew;
    return styles.markFull;
  }

  return (
    <AdminChrome>
      <div className={styles.card}>
        <h1 className={styles.title}>空きカレンダー（〇△×）</h1>
        <p className={styles.lead}>
          日付をタップして〇／△／×を選び、保存するとホームページにすぐ反映されます。予約が入ると自動で1段階下がります（〇→△→×）。
        </p>

        <div className={styles.calendarHead}>
          <button type="button" className={styles.navBtn} onClick={() => shiftMonth(-1)} disabled={!canGoPrev}>
            ‹
          </button>
          <p className={styles.monthLabel}>
            {year}年{month}月
          </p>
          <button type="button" className={styles.navBtn} onClick={() => shiftMonth(1)}>
            ›
          </button>
        </div>

        <div className={styles.weekdays}>
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className={styles.grid}>
          {cells.map((cell) => {
            if (!cell.date || !cell.day) return <div key={cell.key} className={styles.dayBtnEmpty} />;
            const selectedCls = selected?.date === cell.date ? styles.dayBtnSelected : "";
            return (
              <button
                key={cell.key}
                type="button"
                className={`${styles.dayBtn} ${selectedCls}`}
                onClick={() => pick(cell.day!)}
              >
                <span>{Number(cell.date.slice(-2))}</span>
                <span className={`${styles.mark} ${markClass(cell.day.mark)}`}>
                  {MARK_LABEL[cell.day.mark]}
                </span>
                {cell.day.bookingCount > 0 ? <small>予約{cell.day.bookingCount}</small> : <small> </small>}
              </button>
            );
          })}
        </div>
      </div>

      {selected ? (
        <div className={styles.card}>
          <h2 className={styles.title}>{selected.date} の表示</h2>
          <p className={styles.lead}>
            現在 {MARK_LABEL[selected.mark]}
            {selected.bookingCount > 0 ? ` ／ 予約 ${selected.bookingCount} 件` : ""}
          </p>
          <div className={styles.row}>
            {MARK_OPTIONS.map((value) => (
              <label key={value} className={styles.check}>
                <input
                  type="radio"
                  name="mark"
                  checked={mark === value}
                  onChange={() => setMark(value)}
                />
                {MARK_LABEL[value]}
                {value === "open" ? " 余裕" : value === "few" ? " 残りわずか" : " 不可"}
              </label>
            ))}
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <button type="button" className="btn btn-primary" disabled={saving} onClick={onSave}>
            {saving ? "保存中…" : "保存してHPに反映"}
          </button>
        </div>
      ) : null}
    </AdminChrome>
  );
}

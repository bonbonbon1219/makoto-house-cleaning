"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { MARK_LABEL, type DayAvailability } from "@/lib/booking/types";
import styles from "../admin.module.css";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function AdminCalendarPage() {
  const router = useRouter();
  const now = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }, []);
  const [year, setYear] = useState(now.year);
  const [month, setMonth] = useState(now.month);
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [selected, setSelected] = useState<DayAvailability | null>(null);
  const [maxJobs, setMaxJobs] = useState(2);
  const [amOpen, setAmOpen] = useState(true);
  const [pmOpen, setPmOpen] = useState(true);
  const [closed, setClosed] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const dayMap = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);

  async function load() {
    setError("");
    const res = await fetch(`/api/admin/availability?year=${year}&month=${month}`, {
      cache: "no-store",
    });
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = (await res.json()) as { ok?: boolean; days?: DayAvailability[]; error?: string };
    if (!res.ok || !data.ok || !data.days) {
      setError(data.error === "db_not_configured" ? "DATABASE_URL 未設定です" : "読み込みに失敗しました");
      return;
    }
    setDays(data.days);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const cells = useMemo(() => {
    const first = new Date(year, month - 1, 1);
    const pad = first.getDay();
    const last = new Date(year, month, 0).getDate();
    const list: Array<{ key: string; date?: string; day?: DayAvailability }> = [];
    for (let i = 0; i < pad; i += 1) list.push({ key: `p-${i}` });
    for (let d = 1; d <= last; d += 1) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      list.push({ key: date, date, day: dayMap.get(date) });
    }
    return list;
  }, [year, month, dayMap]);

  function pick(day: DayAvailability) {
    setSelected(day);
    setMaxJobs(day.maxJobs);
    setAmOpen(day.amOpen);
    setPmOpen(day.pmOpen);
    setClosed(day.closed);
    setNote("");
  }

  function shiftMonth(delta: number) {
    const next = new Date(year, month - 1 + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth() + 1);
    setSelected(null);
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selected.date,
          maxJobs,
          amOpen,
          pmOpen,
          closed,
          note,
        }),
      });
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = (await res.json()) as { ok?: boolean; day?: DayAvailability; error?: string };
      if (!res.ok || !data.ok || !data.day) throw new Error("save_failed");
      setSelected(data.day);
      await load();
    } catch {
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  function markClass(mark: string) {
    if (mark === "open") return styles.markOpen;
    if (mark === "few") return styles.markFew;
    return styles.markFull;
  }

  return (
    <AdminChrome>
      <div className={styles.card}>
        <h1 className={styles.title}>空き枠カレンダー</h1>
        <p className={styles.lead}>日付をタップして、受付件数・午前/午後・停止を編集します。保存するとHPにすぐ反映されます。</p>

        <div className={styles.calendarHead}>
          <button type="button" className={styles.navBtn} onClick={() => shiftMonth(-1)}>
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
                <small>
                  {cell.day.booked}/{cell.day.maxJobs}
                </small>
              </button>
            );
          })}
        </div>
      </div>

      {selected ? (
        <div className={styles.card}>
          <h2 className={styles.title}>{selected.date} の設定</h2>
          <p className={styles.lead}>
            現在 {selected.booked} 件予約中 / 残り {selected.remaining}（表示 {MARK_LABEL[selected.mark]}）
          </p>
          <form className={styles.editor} onSubmit={onSave}>
            <label className={styles.label}>
              1日の受付件数
              <input
                className={styles.input}
                type="number"
                min={0}
                max={20}
                value={maxJobs}
                onChange={(e) => setMaxJobs(Number(e.target.value))}
              />
            </label>
            <div className={styles.row}>
              <label className={styles.check}>
                <input type="checkbox" checked={amOpen} onChange={(e) => setAmOpen(e.target.checked)} />
                午前OK
              </label>
              <label className={styles.check}>
                <input type="checkbox" checked={pmOpen} onChange={(e) => setPmOpen(e.target.checked)} />
                午後OK
              </label>
              <label className={styles.check}>
                <input type="checkbox" checked={closed} onChange={(e) => setClosed(e.target.checked)} />
                受付停止（×）
              </label>
            </div>
            <label className={styles.label}>
              メモ（内部用）
              <textarea className={styles.textarea} value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            {error ? <p className={styles.error}>{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "保存中…" : "保存してHPに反映"}
            </button>
          </form>
        </div>
      ) : null}
    </AdminChrome>
  );
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { site } from "@/lib/site";
import {
  ESTIMATE_EVENT,
  type EstimateDraft,
  readEstimateDraft,
} from "@/lib/estimateHandoff";
import {
  MARK_LABEL,
  tokyoToday,
  tokyoYearMonth,
  type DayInfo,
  type MarkValue,
} from "@/lib/booking/types";
import styles from "./Booking.module.css";

const OTHER_AREA = "その他地域";
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const SERVICES = [
  "エアコン洗浄",
  "レンジフード・換気扇分解洗浄",
  "キッチン全体",
  "浴室クリーニング",
  "トイレクリーニング",
  "その他・複数メニュー",
];

type MonthPayload = {
  ok?: boolean;
  days?: DayInfo[];
  year?: number;
  month?: number;
  minYear?: number;
  minMonth?: number;
  error?: string;
};

function markClass(mark: MarkValue) {
  if (mark === "open") return styles.markOpen;
  if (mark === "few") return styles.markFew;
  return styles.markFull;
}

export function Booking() {
  const initial = useMemo(() => tokyoYearMonth(), []);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [minYear, setMinYear] = useState(initial.year);
  const [minMonth, setMinMonth] = useState(initial.month);
  const [days, setDays] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState<string>(site.areas[0]);
  const [otherArea, setOtherArea] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [message, setMessage] = useState("");
  const [estimateNote, setEstimateNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");

  const dayMap = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);
  const today = tokyoToday();
  const canGoPrev = year > minYear || (year === minYear && month > minMonth);

  useEffect(() => {
    function applyDraft(draft: EstimateDraft | null) {
      if (!draft) return;
      setMessage(draft.message);
      setService(draft.service || SERVICES[0]);
      setEstimateNote(`自動見積の合計：${draft.totalLabel}`);
    }
    applyDraft(readEstimateDraft());
    function onDraft(event: Event) {
      const custom = event as CustomEvent<EstimateDraft>;
      applyDraft(custom.detail ?? readEstimateDraft());
    }
    window.addEventListener(ESTIMATE_EVENT, onDraft);
    return () => window.removeEventListener(ESTIMATE_EVENT, onDraft);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/booking/availability?year=${year}&month=${month}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as MonthPayload;
        if (!res.ok || !data.ok || !data.days) {
          throw new Error(data.error || "fetch_failed");
        }
        if (!cancelled) {
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
      } catch {
        if (!cancelled) {
          setDays([]);
          setLoadError("空き状況を読み込めませんでした。しばらくしてから再度お試しください。");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const cells = useMemo(() => {
    const first = new Date(`${year}-${String(month).padStart(2, "0")}-01T12:00:00+09:00`);
    const startPad = first.getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const list: Array<{ key: string; date?: string; day?: DayInfo }> = [];
    for (let i = 0; i < startPad; i += 1) list.push({ key: `pad-${i}` });
    for (let d = 1; d <= lastDate; d += 1) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      list.push({ key: date, date, day: dayMap.get(date) });
    }
    return list;
  }, [year, month, dayMap]);

  function shiftMonth(delta: number) {
    const next = new Date(year, month - 1 + delta, 1);
    const nextYear = next.getFullYear();
    const nextMonth = next.getMonth() + 1;
    if (delta < 0 && (nextYear < minYear || (nextYear === minYear && nextMonth < minMonth))) {
      return;
    }
    setYear(nextYear);
    setMonth(nextMonth);
    setSelectedDate("");
    setDoneId("");
  }

  function pickDate(date: string, day?: DayInfo) {
    if (!day?.bookable || date < today) return;
    setSelectedDate(date);
    setError("");
    setDoneId("");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedDate) {
      setError("希望日を選んでください。");
      return;
    }
    if (area === OTHER_AREA && !otherArea.trim()) {
      setError("その他地域の詳細を入力してください。");
      return;
    }

    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          name,
          phone,
          email,
          area,
          otherArea,
          service,
          message,
          estimateNote,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        booking?: { id: string };
      };
      if (!res.ok || !data.ok || !data.booking) {
        const map: Record<string, string> = {
          day_full: "その日は受付できません。別の日をお選びください。",
          past_date: "過去の日付は選べません。",
          db_not_configured: "予約システム準備中です。お問い合わせフォームをご利用ください。",
          missing_fields: "必須項目を入力してください。",
        };
        throw new Error(map[data.error || ""] || "送信に失敗しました。");
      }
      setDoneId(data.booking.id);
      const avail = await fetch(`/api/booking/availability?year=${year}&month=${month}`, {
        cache: "no-store",
      });
      const payload = (await avail.json()) as MonthPayload;
      if (payload.ok && payload.days) setDays(payload.days);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="booking" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Booking</p>
          <h2 className="section-title">オンライン予約｜空き枠を見て仮予約</h2>
          <p className="section-lead">
            カレンダーの〇△×で空きを確認し、希望日を選んで仮予約できます。時間帯は店舗確認の際に調整します。
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.calendarHead}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={() => shiftMonth(-1)}
                aria-label="前の月"
                disabled={!canGoPrev}
              >
                ‹
              </button>
              <p className={styles.monthLabel}>
                {year}年{month}月
              </p>
              <button type="button" className={styles.navBtn} onClick={() => shiftMonth(1)} aria-label="次の月">
                ›
              </button>
            </div>

            <ul className={styles.legend}>
              <li className={styles.legendItem}>
                <span className={`${styles.mark} ${styles.markOpen}`}>〇</span>
                余裕あり
              </li>
              <li className={styles.legendItem}>
                <span className={`${styles.mark} ${styles.markFew}`}>△</span>
                残りわずか
              </li>
              <li className={styles.legendItem}>
                <span className={`${styles.mark} ${styles.markFull}`}>×</span>
                受付不可
              </li>
            </ul>

            <div className={styles.weekdays} aria-hidden="true">
              {WEEKDAYS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>

            {loading ? <p className={styles.hint}>空き状況を読み込み中…</p> : null}
            {loadError ? <p className={styles.error}>{loadError}</p> : null}

            <div className={styles.grid} role="grid" aria-label="予約カレンダー">
              {cells.map((cell) => {
                if (!cell.date) return <div key={cell.key} className={styles.cellEmpty} />;
                const day = cell.day;
                const mark = day?.mark ?? "full";
                const disabled = !day?.bookable;
                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={`${styles.cell} ${selectedDate === cell.date ? styles.cellSelected : ""} ${disabled ? styles.cellDisabled : ""}`}
                    disabled={disabled}
                    onClick={() => pickDate(cell.date!, day)}
                    aria-label={`${cell.date} ${MARK_LABEL[mark]}`}
                  >
                    <span className={styles.dayNum}>{Number(cell.date.slice(-2))}</span>
                    <span className={`${styles.mark} ${markClass(mark)}`}>{MARK_LABEL[mark]}</span>
                  </button>
                );
              })}
            </div>
            <p className={styles.hint}>
              仮予約のあと、店舗確認で本予約が確定します。時間帯はお電話やメールで調整します。当日無断キャンセルのみキャンセル料が発生します。
            </p>
          </div>

          <div className={styles.side}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>仮予約フォーム</h3>
              <p className={styles.sideLead}>
                {selectedDate ? `希望日：${selectedDate}` : "カレンダーから日付を選んでください"}
              </p>

              {doneId ? (
                <p className={styles.success} role="status">
                  仮予約を受け付けました。確認メールをお送りしました（予約ID: {doneId.slice(0, 8)}…）。店舗からの確定連絡をお待ちください。
                </p>
              ) : (
                <form className={styles.form} onSubmit={onSubmit}>
                  {estimateNote ? <p className={styles.estimateNote}>{estimateNote}</p> : null}
                  <label className={styles.label}>
                    メニュー
                    <select
                      className={styles.select}
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      required
                    >
                      {SERVICES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.label}>
                    お名前
                    <input
                      className={styles.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </label>
                  <label className={styles.label}>
                    電話番号
                    <input
                      className={styles.input}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </label>
                  <label className={styles.label}>
                    メール
                    <input
                      className={styles.input}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </label>
                  <label className={styles.label}>
                    地域
                    <select
                      className={styles.select}
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      required
                    >
                      {site.areas.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      <option value={OTHER_AREA}>{OTHER_AREA}</option>
                    </select>
                  </label>
                  {area === OTHER_AREA ? (
                    <label className={styles.label}>
                      地域の詳細
                      <input
                        className={styles.input}
                        value={otherArea}
                        onChange={(e) => setOtherArea(e.target.value)}
                        required
                      />
                    </label>
                  ) : null}
                  <label className={styles.label}>
                    備考（希望時間帯など）
                    <textarea
                      className={styles.textarea}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="例：午前希望、〇時以降など"
                    />
                  </label>
                  {error ? <p className={styles.error}>{error}</p> : null}
                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.submit}`}
                    disabled={sending || !selectedDate}
                  >
                    {sending ? "送信中…" : "仮予約する"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
  SLOT_LABEL,
  type DayAvailability,
  type DayMark,
  type SlotId,
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
  days?: DayAvailability[];
  error?: string;
};

function tokyoToday() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

function markClass(mark: DayMark) {
  if (mark === "open") return styles.markOpen;
  if (mark === "few") return styles.markFew;
  return styles.markFull;
}

export function Booking() {
  const now = useMemo(() => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
    }).formatToParts(new Date());
    const year = Number(parts.find((p) => p.type === "year")?.value);
    const month = Number(parts.find((p) => p.type === "month")?.value);
    return { year, month };
  }, []);

  const [year, setYear] = useState(now.year);
  const [month, setMonth] = useState(now.month);
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slot, setSlot] = useState<SlotId | "">("");
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
  const selected = selectedDate ? dayMap.get(selectedDate) : undefined;
  const today = tokyoToday();

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
        if (!cancelled) setDays(data.days);
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
    const first = new Date(`${year}-${String(month).padStart(2, "0")}-01T00:00:00+09:00`);
    const startPad = first.getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const list: Array<{ key: string; date?: string; day?: DayAvailability }> = [];
    for (let i = 0; i < startPad; i += 1) {
      list.push({ key: `pad-${i}` });
    }
    for (let d = 1; d <= lastDate; d += 1) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      list.push({ key: date, date, day: dayMap.get(date) });
    }
    return list;
  }, [year, month, dayMap]);

  function shiftMonth(delta: number) {
    const next = new Date(year, month - 1 + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth() + 1);
    setSelectedDate("");
    setSlot("");
  }

  function pickDate(date: string, day?: DayAvailability) {
    if (!day || day.mark === "full" || date < today) return;
    setSelectedDate(date);
    setSlot("");
    setError("");
    setDoneId("");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selectedDate || !slot) {
      setError("希望日と時間帯を選んでください。");
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
          slot,
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
      const data = (await res.json()) as { ok?: boolean; error?: string; booking?: { id: string } };
      if (!res.ok || !data.ok || !data.booking) {
        const map: Record<string, string> = {
          day_full: "その日は満枠になりました。別の日をお選びください。",
          slot_closed: "その時間帯は受付停止です。別の枠をお選びください。",
          past_date: "過去の日付は選べません。",
          db_not_configured: "予約システム準備中です。お問い合わせフォームをご利用ください。",
          missing_fields: "必須項目を入力してください。",
        };
        throw new Error(map[data.error || ""] || "送信に失敗しました。");
      }
      setDoneId(data.booking.id);
      setSlot("");
      // refresh month marks
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
            カレンダーの〇△×で空き状況を確認し、午前・午後の枠を選んで仮予約できます。確定のご連絡は店舗から行います。
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.calendarHead}>
              <button type="button" className={styles.navBtn} onClick={() => shiftMonth(-1)} aria-label="前の月">
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
                if (!cell.date) {
                  return <div key={cell.key} className={styles.cellEmpty} />;
                }
                const day = cell.day;
                const mark = day?.mark ?? "full";
                const disabled = !day || mark === "full" || cell.date < today;
                const selectedCls = selectedDate === cell.date ? styles.cellSelected : "";
                const disabledCls = disabled ? styles.cellDisabled : "";
                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={`${styles.cell} ${selectedCls} ${disabledCls}`}
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
            <p className={styles.hint}>仮予約のあと、店舗確認で本予約が確定します。当日無断キャンセルのみキャンセル料が発生します。</p>
          </div>

          <div className={styles.side}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>希望日時</h3>
              <p className={styles.sideLead}>
                {selectedDate
                  ? `${selectedDate}（残り${selected?.remaining ?? 0}枠）`
                  : "カレンダーから日付を選んでください"}
              </p>
              <div className={styles.slots}>
                {(["am", "pm"] as SlotId[]).map((id) => {
                  const bookable =
                    id === "am" ? Boolean(selected?.amBookable) : Boolean(selected?.pmBookable);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`${styles.slotBtn} ${slot === id ? styles.slotBtnActive : ""}`}
                      disabled={!selectedDate || !bookable}
                      onClick={() => setSlot(id)}
                    >
                      {SLOT_LABEL[id]}
                      {!selectedDate ? "" : bookable ? " · 選択可" : " · 不可"}
                    </button>
                  );
                })}
              </div>

              {doneId ? (
                <p className={styles.success} role="status">
                  仮予約を受け付けました。確認メールをお送りしました（予約ID: {doneId.slice(0, 8)}…）。店舗からの確定連絡をお待ちください。
                </p>
              ) : (
                <form className={styles.form} onSubmit={onSubmit}>
                  {estimateNote ? <p className={styles.estimateNote}>{estimateNote}</p> : null}
                  <label className={styles.label}>
                    メニュー
                    <select className={styles.select} value={service} onChange={(e) => setService(e.target.value)} required>
                      {SERVICES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.label}>
                    お名前
                    <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                  </label>
                  <label className={styles.label}>
                    電話番号
                    <input className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" />
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
                    <select className={styles.select} value={area} onChange={(e) => setArea(e.target.value)} required>
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
                      <input className={styles.input} value={otherArea} onChange={(e) => setOtherArea(e.target.value)} required />
                    </label>
                  ) : null}
                  <label className={styles.label}>
                    備考
                    <textarea className={styles.textarea} value={message} onChange={(e) => setMessage(e.target.value)} />
                  </label>
                  {error ? <p className={styles.error}>{error}</p> : null}
                  <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={sending || !selectedDate || !slot}>
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

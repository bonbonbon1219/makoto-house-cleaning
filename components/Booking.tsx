"use client";

import { FormEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";
import {
  ESTIMATE_EVENT,
  type EstimateDraft,
  readEstimateDraft,
} from "@/lib/estimateHandoff";
import { compressImageForUpload, UPLOAD_MAX_BYTES } from "@/lib/compressImage";
import { focusFirstInvalid, invalidFieldMessage } from "@/lib/formFeedback";
import {
  MARK_LABEL,
  tokyoToday,
  tokyoYearMonth,
  type DayInfo,
  type MarkValue,
} from "@/lib/booking/types";
import styles from "./Booking.module.css";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXT = /\.(jpe?g|png|webp)$/i;
const SERVICES = [
  "エアコン洗浄",
  "レンジフード・換気扇分解洗浄",
  "キッチン全体",
  "浴室クリーニング",
  "トイレクリーニング",
  "その他・複数メニュー",
];

type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string;
};

function isAllowedPhoto(file: File) {
  if (file.type && ALLOWED_TYPES.has(file.type)) return true;
  return ALLOWED_EXT.test(file.name);
}

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
  const [address, setAddress] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [message, setMessage] = useState("");
  const [estimateNote, setEstimateNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");
  const [doneDetail, setDoneDetail] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<PhotoItem[]>([]);
  const photosHelpId = useId();

  const dayMap = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);
  const today = tokyoToday();
  const canGoPrev = year > minYear || (year === minYear && month > minMonth);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  function clearPhotos() {
    setPhotos((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onPhotosSelected(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError("");
    const incoming = Array.from(fileList);
    const next: PhotoItem[] = [];
    let rejected = false;

    for (const file of incoming) {
      if (photos.length + next.length >= MAX_PHOTOS) {
        rejected = true;
        break;
      }
      if (!isAllowedPhoto(file) || file.size > MAX_PHOTO_BYTES) {
        rejected = true;
        continue;
      }
      next.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (next.length) {
      setPhotos((current) => [...current, ...next].slice(0, MAX_PHOTOS));
    }
    if (rejected || incoming.length > next.length) {
      setError("写真は jpg / png / webp のみ、各5MBまで、最大3枚までです。");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  useEffect(() => {
    function applyDraft(draft: EstimateDraft | null) {
      if (!draft) return;
      setService(draft.service || SERVICES[0]);
      // 見積は備考に混ぜず、見積メモ欄へ。備考は希望時間帯などの追記用。
      const cleanedMessage = draft.message
        .replace(/\n*※希望日・エリアなどがあれば追記してください。\s*$/u, "")
        .trim();
      setEstimateNote(
        [`自動見積の合計：${draft.totalLabel}`, cleanedMessage].filter(Boolean).join("\n\n"),
      );
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    form.dataset.tried = "true";

    if (!selectedDate) {
      setError("カレンダーから希望日を選んでください。");
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!form.checkValidity()) {
      setError(invalidFieldMessage(form));
      focusFirstInvalid(form);
      return;
    }

    setSending(true);
    setError("");
    setDoneDetail("");
    try {
      let compressed: File[] = [];
      if (photos.length) {
        try {
          compressed = await Promise.all(
            photos.map((item) => compressImageForUpload(item.file, UPLOAD_MAX_BYTES)),
          );
        } catch {
          setError("写真の処理に失敗しました。別の画像でお試しいただくか、メールで直接お送りください。");
          return;
        }
      }

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          name,
          phone,
          email,
          address,
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

      let photosSent = 0;
      for (const [index, file] of compressed.entries()) {
        const photoPayload = new FormData();
        photoPayload.set("bookingId", data.booking.id);
        photoPayload.set("date", selectedDate);
        photoPayload.set("name", name);
        photoPayload.set("phone", phone);
        photoPayload.set("email", email);
        photoPayload.set("service", service);
        photoPayload.set("index", String(index + 1));
        photoPayload.set("total", String(compressed.length));
        photoPayload.append("photos", file, file.name || `photo-${index + 1}.jpg`);

        const photoRes = await fetch("/api/booking/photo", {
          method: "POST",
          body: photoPayload,
        });
        if (photoRes.ok) photosSent += 1;
      }

      setDoneId(data.booking.id);
      if (compressed.length && photosSent < compressed.length) {
        setDoneDetail(
          `仮予約は届きましたが、写真は ${photosSent}/${compressed.length} 枚のみ送信できました。残りは ${site.email} へ直接お送りください。`,
        );
      } else if (compressed.length) {
        setDoneDetail(`写真 ${photosSent} 枚もあわせて送信しました。`);
      }

      clearPhotos();
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
                <div className={styles.success} role="status">
                  <p>
                    仮予約を受け付けました。確認メールをお送りしました（予約ID: {doneId.slice(0, 8)}…）。店舗からの確定連絡をお待ちください。
                  </p>
                  {doneDetail ? <p>{doneDetail}</p> : null}
                </div>
              ) : (
                <form className={styles.form} noValidate onSubmit={onSubmit}>
                  {estimateNote ? <p className={styles.estimateNote}>{estimateNote}</p> : null}
                  <label className={styles.label}>
                    メニュー
                    <select
                      className={styles.select}
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      required
                      disabled={sending}
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
                      disabled={sending}
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
                      disabled={sending}
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
                      disabled={sending}
                    />
                  </label>
                  <label className={styles.label}>
                    住所
                    <input
                      className={styles.input}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      autoComplete="street-address"
                      placeholder="例：福岡市中央区〇〇1-2-3 ○○マンション101"
                      disabled={sending}
                    />
                  </label>
                  <label className={styles.label}>
                    備考（希望時間帯など）
                    <textarea
                      className={styles.textarea}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="例：午前希望、14時以降、駐車場の有無など"
                      disabled={sending}
                    />
                  </label>

                  <div className={styles.label}>
                    <span id={photosHelpId}>写真（任意）</span>
                    <p className={styles.fieldHelp}>
                      型番シールや汚れ箇所の写真があるとスムーズです。jpg / png / webp、最大{MAX_PHOTOS}
                      枚。送信時に自動で軽量化します。
                    </p>
                    <div className={styles.photoActions}>
                      <label className={styles.photoPicker}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                          multiple
                          disabled={sending || photos.length >= MAX_PHOTOS}
                          aria-describedby={photosHelpId}
                          onChange={(event) => onPhotosSelected(event.target.files)}
                        />
                        写真を選ぶ
                      </label>
                      {photos.length > 0 ? (
                        <button
                          type="button"
                          className={styles.photoClear}
                          onClick={clearPhotos}
                          disabled={sending}
                        >
                          すべて削除
                        </button>
                      ) : null}
                    </div>
                    {photos.length > 0 ? (
                      <ul className={styles.photoList}>
                        {photos.map((item) => (
                          <li key={item.id} className={styles.photoItem}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.previewUrl} alt="" className={styles.photoThumb} />
                            <button
                              type="button"
                              className={styles.photoRemove}
                              onClick={() => removePhoto(item.id)}
                              disabled={sending}
                              aria-label={`${item.file.name}を削除`}
                            >
                              削除
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  {error ? (
                    <p className="form-alert" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.submit}`}
                    disabled={sending}
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

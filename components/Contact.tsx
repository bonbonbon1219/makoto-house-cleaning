"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { site } from "@/lib/site";
import {
  ESTIMATE_EVENT,
  type EstimateDraft,
  readEstimateDraft,
} from "@/lib/estimateHandoff";
import styles from "./Contact.module.css";

const OTHER_AREA = "その他地域";
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXT = /\.(jpe?g|png|webp)$/i;

type PhotoItem = {
  id: string;
  file: File;
  previewUrl: string;
};

function isAllowedPhoto(file: File) {
  if (file.type && ALLOWED_TYPES.has(file.type)) return true;
  return ALLOWED_EXT.test(file.name);
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState("エアコン洗浄");
  const [area, setArea] = useState<string>(site.areas[0]);
  const [otherArea, setOtherArea] = useState("");
  const [message, setMessage] = useState("");
  const [estimateNote, setEstimateNote] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<PhotoItem[]>([]);
  const titleId = useId();
  const descId = useId();
  const photosHelpId = useId();

  const needsOtherArea = area === OTHER_AREA;

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  useEffect(() => {
    function applyDraft(draft: EstimateDraft | null) {
      if (!draft) return;
      setMessage(draft.message);
      setService(draft.service);
      setEstimateNote(`自動見積の合計：${draft.totalLabel} を反映しました`);
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
    if (!showThanks) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShowThanks(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showThanks]);

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setSent(false);
    setShowThanks(false);
    setError("");

    const form = event.currentTarget;
    const fields = new FormData(form);
    const payload = new FormData();
    payload.set("name", String(fields.get("name") ?? ""));
    payload.set("phone", String(fields.get("phone") ?? ""));
    payload.set("email", String(fields.get("email") ?? ""));
    payload.set("area", area);
    payload.set("otherArea", otherArea);
    payload.set("service", service);
    payload.set("message", message);
    photos.forEach((item) => payload.append("photos", item.file, item.file.name));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        if (result.error === "mail_not_configured") {
          setError("メール送信の準備がまだ完了していません。お電話またはメールで直接ご連絡ください。");
        } else if (
          result.error === "invalid_image_type" ||
          result.error === "image_too_large" ||
          result.error === "too_many_images"
        ) {
          setError("写真は jpg / png / webp のみ、各5MBまで、最大3枚までです。");
        } else {
          setError("送信に失敗しました。時間をおいて再度お試しいただくか、お電話・メールでご連絡ください。");
        }
        return;
      }

      setSent(true);
      setShowThanks(true);
      form.reset();
      setOtherArea("");
      setEstimateNote("");
      clearPhotos();
    } catch {
      setError("送信に失敗しました。通信環境をご確認のうえ、再度お試しください。");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className={`section ${styles.section}`}>
      <div className={`container ${styles.wrap}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Contact</p>
          <h2 className={styles.title}>お問い合わせ</h2>
          <p className={styles.lead}>
            まずはお気軽にどうぞ。メニュー・台数・ご希望日が分かるとスムーズです。
            エアコンの型番や汚れ箇所の写真があると、よりスムーズにご案内できます。
          </p>

          <div className={styles.direct}>
            <a href={`tel:${site.phoneTel}`} className={styles.phone}>
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className={styles.email}>
              {site.email}
            </a>
            <p className={styles.meta}>{site.hours}</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          {estimateNote ? <p className={styles.estimateNote}>{estimateNote}</p> : null}

          <label className={styles.field}>
            <span>お名前</span>
            <input name="name" required autoComplete="name" disabled={sending} />
          </label>

          <label className={styles.field}>
            <span>電話番号</span>
            <input name="phone" type="tel" required autoComplete="tel" disabled={sending} />
          </label>

          <label className={styles.field}>
            <span>メールアドレス</span>
            <input name="email" type="email" required autoComplete="email" disabled={sending} />
          </label>

          <label className={styles.field}>
            <span>お住まいの地域</span>
            <select
              name="area"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              required
              disabled={sending}
            >
              {site.areas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value={OTHER_AREA}>{OTHER_AREA}</option>
            </select>
          </label>

          {needsOtherArea ? (
            <label className={styles.field}>
              <span>その他地域（任意記入）</span>
              <input
                name="otherArea"
                value={otherArea}
                onChange={(event) => setOtherArea(event.target.value)}
                placeholder="例：糸島市、古賀市など"
                autoComplete="address-level2"
                disabled={sending}
              />
              <span className={styles.fieldHelp}>
                対応可否はエリアにより異なります。市区町村名だけでも大丈夫です。
              </span>
            </label>
          ) : null}

          <label className={styles.field}>
            <span>ご希望メニュー</span>
            <select
              name="service"
              value={service}
              onChange={(event) => setService(event.target.value)}
              disabled={sending}
            >
              <option>エアコン洗浄</option>
              <option>レンジフード・換気扇分解洗浄</option>
              <option>浴室・トイレ</option>
              <option>ハウスクリーニング一式</option>
              <option>その他・相談</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>メッセージ</span>
            <textarea
              name="message"
              rows={8}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="希望日・台数など"
              disabled={sending}
            />
          </label>

          <div className={styles.field}>
            <span id={photosHelpId}>写真（任意）</span>
            <p className={styles.fieldHelp}>
              エアコンのメーカー・型番シールや、クリーニング箇所の写真があるとスムーズです。jpg / png /
              webp、各5MBまで、最大{MAX_PHOTOS}枚。
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

          <button
            type="submit"
            className={`btn btn-primary ${styles.submit} ${sent ? styles.submitDone : ""}`}
            disabled={sending}
          >
            {sending ? "送信中…" : sent ? "送信完了" : "送信する"}
          </button>
          <p className={styles.privacy}>
            送信により
            <a href="/privacy">プライバシーポリシー</a>
            に同意したものとみなします。
          </p>
        </form>
      </div>

      {showThanks ? (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowThanks(false)}
          role="presentation"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            onClick={(event) => event.stopPropagation()}
          >
            <p className={styles.modalKicker}>Thank you</p>
            <h3 id={titleId} className={styles.modalTitle}>
              お問い合わせありがとうございます
            </h3>
            <p id={descId} className={styles.modalText}>
              正常に送信できました。内容を確認のうえ、ご連絡いたします。
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              className={`btn btn-primary ${styles.modalClose}`}
              onClick={() => setShowThanks(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

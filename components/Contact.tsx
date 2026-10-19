"use client";

import { FormEvent, useEffect, useState } from "react";
import { site } from "@/lib/site";
import {
  ESTIMATE_EVENT,
  type EstimateDraft,
  readEstimateDraft,
} from "@/lib/estimateHandoff";
import styles from "./Contact.module.css";

const OTHER_AREA = "その他地域";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState("エアコン洗浄");
  const [area, setArea] = useState<string>(site.areas[0]);
  const [otherArea, setOtherArea] = useState("");
  const [message, setMessage] = useState("");
  const [estimateNote, setEstimateNote] = useState("");

  const needsOtherArea = area === OTHER_AREA;

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setSent(false);
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          email: String(data.get("email") ?? ""),
          area,
          otherArea,
          service,
          message,
        }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        if (result.error === "mail_not_configured") {
          setError("メール送信の準備がまだ完了していません。お電話またはメールで直接ご連絡ください。");
        } else {
          setError("送信に失敗しました。時間をおいて再度お試しいただくか、お電話・メールでご連絡ください。");
        }
        return;
      }

      setSent(true);
      form.reset();
      setOtherArea("");
      setEstimateNote("");
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
          {estimateNote ? <p className={styles.estimateNote}>{estimateNote}</p> : null}

          <label className={styles.field}>
            <span>お名前</span>
            <input name="name" required autoComplete="name" />
          </label>

          <label className={styles.field}>
            <span>電話番号</span>
            <input name="phone" type="tel" required autoComplete="tel" />
          </label>

          <label className={styles.field}>
            <span>メールアドレス</span>
            <input name="email" type="email" required autoComplete="email" />
          </label>

          <label className={styles.field}>
            <span>お住まいの地域</span>
            <select
              name="area"
              value={area}
              onChange={(event) => setArea(event.target.value)}
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

          {needsOtherArea ? (
            <label className={styles.field}>
              <span>その他地域（任意記入）</span>
              <input
                name="otherArea"
                value={otherArea}
                onChange={(event) => setOtherArea(event.target.value)}
                placeholder="例：糸島市、古賀市など"
                autoComplete="address-level2"
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
            />
          </label>

          <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={sending}>
            {sending ? "送信中…" : "送信する"}
          </button>
          <p className={styles.privacy}>
            送信により
            <a href="/privacy">プライバシーポリシー</a>
            に同意したものとみなします。
          </p>
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          {sent ? (
            <p className={styles.note} role="status">
              送信しました。内容を確認のうえ、ご連絡いたします。
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

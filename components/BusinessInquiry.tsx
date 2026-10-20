"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { site } from "@/lib/site";
import { focusFirstInvalid, invalidFieldMessage } from "@/lib/formFeedback";
import styles from "./BusinessInquiry.module.css";

const menus = [
  "退去後の空室清掃",
  "エアコン内部洗浄",
  "レンジフード・換気扇の分解洗浄",
  "水回りなどの部分清掃",
  "原状回復の洗浄のみ",
  "その他・複数メニュー",
] as const;

export function BusinessInquiry() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    form.dataset.tried = "true";

    if (!form.checkValidity()) {
      setError(invalidFieldMessage(form));
      focusFirstInvalid(form);
      return;
    }

    setSending(true);
    setError("");

    const fields = new FormData(form);
    fields.set("inquiryType", "business");

    try {
      const response = await fetch("/api/contact", { method: "POST", body: fields });
      const data = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      if (!response.ok || !data?.ok) {
        setError("送信できませんでした。時間をおいて再度お試しいただくか、お電話ください。");
        return;
      }
      setDone(true);
    } catch {
      setError("送信に失敗しました。通信環境をご確認のうえ、再度お試しください。");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className={styles.success} role="status">
        <p className={styles.successTitle}>受け付けました</p>
        <p>内容を確認し、担当者からご連絡します。お急ぎの場合はお電話ください。</p>
        <p>
          <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
          <span className={styles.phoneNote}>{site.phoneNote}</span>
        </p>
      </div>
    );
  }

  return (
    <form id="business-form" className={styles.form} noValidate onSubmit={onSubmit}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>会社名・屋号</span>
          <input name="company" required autoComplete="organization" disabled={sending} />
        </label>
        <label className={styles.field}>
          <span>担当者名</span>
          <input name="name" required autoComplete="name" disabled={sending} />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>電話番号</span>
          <input name="phone" type="tel" required autoComplete="tel" disabled={sending} />
        </label>
        <label className={styles.field}>
          <span>メールアドレス</span>
          <input name="email" type="email" required autoComplete="email" disabled={sending} />
        </label>
      </div>
      <label className={styles.field}>
        <span>物件の所在地</span>
        <input
          name="area"
          required
          autoComplete="street-address"
          placeholder="例：福岡市博多区○○1-2-3 ○○マンション101"
          disabled={sending}
        />
      </label>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>間取り</span>
          <input name="floorPlan" placeholder="例：1K、2LDK" disabled={sending} />
        </label>
        <label className={styles.field}>
          <span>希望完了日</span>
          <input name="dueDate" placeholder="例：3月20日まで" disabled={sending} />
        </label>
      </div>
      <label className={styles.field}>
        <span>ご希望の内容</span>
        <select name="service" required defaultValue={menus[0]} disabled={sending}>
          {menus.map((menu) => (
            <option key={menu}>{menu}</option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span>鍵の受け渡し</span>
        <input name="keyHandover" placeholder="例：キーボックス、管理会社で受け取り" disabled={sending} />
      </label>
      <label className={styles.field}>
        <span>メッセージ</span>
        <textarea
          name="message"
          rows={5}
          placeholder="汚れの程度、エアコンの台数、駐車場の有無など"
          disabled={sending}
        />
      </label>
      {error ? (
        <p className="form-alert" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={sending}>
        {sending ? "送信中…" : "この内容で相談する"}
      </button>
      <p className={styles.fine}>
        送信により
        <Link href="/privacy">プライバシーポリシー</Link>
        に同意したものとみなします。営業のご提案はご遠慮ください。
      </p>
    </form>
  );
}

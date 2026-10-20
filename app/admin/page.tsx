"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(
          data.error === "invalid_password"
            ? "パスワードが違います"
            : data.error === "admin_not_configured"
              ? "管理パスワード未設定です"
              : "ログインに失敗しました",
        );
      }
      router.push("/admin/calendar");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>管理画面ログイン</h1>
        <p className={styles.lead}>スタッフ用です。共有パスワードで空き（〇△×）と予約の確定ができます。</p>
        <form className={styles.loginForm} onSubmit={onSubmit}>
          <label className={styles.label}>
            パスワード
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? "確認中…" : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}

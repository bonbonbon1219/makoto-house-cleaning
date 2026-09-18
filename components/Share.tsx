"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import styles from "./Share.module.css";

function shareText() {
  return `${site.brandFull}｜${site.tagline}`;
}

function currentUrl() {
  return window.location.href;
}

function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/** スマホは同一タブでアプリ起動、PCは別タブ */
function openShareTarget(href: string) {
  if (isMobile()) {
    window.location.assign(href);
    return;
  }
  window.open(href, "_blank", "noopener,noreferrer");
}

async function tryNativeShare() {
  if (!navigator.share) return false;
  try {
    await navigator.share({
      title: site.brandFull,
      text: shareText(),
      url: currentUrl(),
    });
    return true;
  } catch (error) {
    // ユーザーキャンセルは成功扱い（再試行やフォールバックしない）
    if (error instanceof DOMException && error.name === "AbortError") return true;
    return false;
  }
}

export function Share() {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const url = currentUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("このURLをコピーしてください", url);
    }
  }

  function onLine() {
    // LINEアプリへ直接（Webログイン画面を使わない）
    const body = `${shareText()}\n${currentUrl()}`;
    openShareTarget(`https://line.me/R/msg/text/?${encodeURIComponent(body)}`);
  }

  async function onFacebook() {
    // スマホはOSの共有シート（アプリから選べる）。Webのログイン壁を避ける
    if (isMobile() && (await tryNativeShare())) return;
    openShareTarget(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl())}`,
    );
  }

  function onX() {
    // Xアプリが入っていれば投稿画面へ（Webログインから始まらない）
    const text = encodeURIComponent(`${shareText()}\n${currentUrl()}`);
    openShareTarget(`https://twitter.com/intent/tweet?text=${text}`);
  }

  return (
    <div className={styles.share}>
      <p className={styles.label}>このページを共有</p>
      <div className={styles.actions} role="group" aria-label="共有">
        <button type="button" className={styles.btn} onClick={onCopy}>
          <CopyIcon />
          <span>{copied ? "コピーしました" : "コピー"}</span>
        </button>
        <button type="button" className={styles.btn} onClick={onLine}>
          <LineIcon />
          <span>LINE</span>
        </button>
        <button type="button" className={styles.btn} onClick={onFacebook}>
          <FacebookIcon />
          <span>Facebook</span>
        </button>
        <button type="button" className={styles.btn} onClick={onX}>
          <XIcon />
          <span>X</span>
        </button>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.2C6.92 3.2 2.8 6.58 2.8 10.74c0 3.72 3.3 6.84 7.76 7.42.3.06.72.2.82.45.1.24.06.62.03.86l-.14.86c-.04.24-.2 1 .93.54 1.13-.45 6.1-3.6 8.32-6.17 1.53-1.72 2.28-3.47 2.28-5.36C22.8 6.58 18.68 3.2 12 3.2z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 8.5V6.8c0-.7.15-1.1 1.15-1.1H17V3h-2.35C11.9 3 11 4.55 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.35l.35-2.7H14.5z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.6 3H20l-6.3 7.2L21 21h-5.4l-4.2-5.5L6.4 21H4l6.75-7.72L3.2 3h5.55l3.8 5.05L17.6 3zm-1 16.2h1.5L7.55 4.7H5.95L16.6 19.2z"
      />
    </svg>
  );
}

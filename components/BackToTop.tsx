"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTop.module.css";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const top = document.getElementById("top");
    top?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ""}`}
      onClick={goTop}
      aria-label="ページ上部へ戻る"
      title="ページ上部へ戻る"
      tabIndex={visible ? 0 : -1}
    >
      <span aria-hidden="true">↑</span>
      <span className={styles.label}>TOP</span>
    </button>
  );
}

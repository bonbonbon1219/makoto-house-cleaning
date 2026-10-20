import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./MobileDock.module.css";

export function MobileDock() {
  return (
    <nav className={styles.dock} aria-label="クイック操作">
      <Link href="/booking" className={`${styles.item} ${styles.booking}`}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="4.5" y="5" width="15" height="14.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M8 3.5v3M16 3.5v3M4.5 9.5h15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="9" cy="13.5" r="1" fill="currentColor" />
            <circle cx="12.5" cy="13.5" r="1" fill="currentColor" />
            <circle cx="16" cy="13.5" r="1" fill="currentColor" />
          </svg>
        </span>
        <span className={styles.label}>予約</span>
      </Link>
      <a href={`tel:${site.phoneTel}`} className={`${styles.item} ${styles.phone}`}>
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path
              d="M8.2 4.8c.4-.4 1.1-.5 1.6-.2l2 1.2c.5.3.7.9.5 1.4l-.8 1.8c-.1.3 0 .7.2 1 1.1 1.5 2.5 2.9 4 4 .3.2.7.3 1 .2l1.8-.8c.5-.2 1.1 0 1.4.5l1.2 2c.3.5.2 1.2-.2 1.6l-1.3 1.3c-.5.5-1.2.7-1.9.5-3.3-.8-6.4-3.2-8.9-6.4C5.4 10.7 3.8 8.2 3.5 5.7c-.1-.7.2-1.4.7-1.9l1.3-1.3z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.label}>電話</span>
      </a>
    </nav>
  );
}

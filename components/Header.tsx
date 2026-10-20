"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./Header.module.css";

const links = [
  { href: "/services", label: "サービス", icon: "services" as const },
  { href: "/areas", label: "エリア", icon: "area" as const },
  { href: "/#pricing", label: "料金", icon: "price" as const },
  { href: "/#estimate", label: "自動見積", icon: "estimate" as const },
  { href: "/booking", label: "予約", icon: "booking" as const },
  { href: "/#contact", label: "お問い合わせ", icon: "contact" as const },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.brandJa} ホーム`} onClick={closeMenu}>
          <OptimizedImage
            src="/brand/makoto-logo.webp"
            alt=""
            width={44}
            height={32}
            className={styles.logo}
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.brandEn}>{site.brandEn}</span>
            <span className={styles.brandJa}>{site.brandJa}</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="メイン">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              <span className={styles.iconWrap} aria-hidden="true">
                <NavIcon name={link.icon} />
              </span>
              <span className={styles.navLabel}>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <a href={`tel:${site.phoneTel}`} className={styles.phone}>
            <span className={styles.phoneIcon} aria-hidden="true">
              <PhoneIcon />
            </span>
            <span>{site.phone}</span>
          </a>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={`${styles.menuIcon} ${open ? styles.menuIconOpen : ""}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <div
              className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
              id={menuId}
              aria-hidden={!open}
            >
              <button
                type="button"
                className={styles.backdrop}
                aria-label="メニューを閉じる"
                tabIndex={open ? 0 : -1}
                onClick={closeMenu}
              />
              <nav className={styles.panel} aria-label="モバイルメニュー">
                <p className={styles.panelTitle}>メニュー</p>
                <ul className={styles.panelList}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.panelLink} onClick={closeMenu}>
                        <span className={styles.iconWrap} aria-hidden="true">
                          <NavIcon name={link.icon} />
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <a href={`tel:${site.phoneTel}`} className={styles.panelPhone} onClick={closeMenu}>
                  <PhoneIcon />
                  <span>{site.phone}</span>
                </a>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}

function NavIcon({ name }: { name: (typeof links)[number]["icon"] }) {
  switch (name) {
    case "services":
      return (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <path
            d="M5 7h14M5 12h14M5 17h10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "area":
      return (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <path
            d="M12 21s6-5.2 6-10.2A6 6 0 0 0 6 10.8C6 15.8 12 21 12 21z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "price":
      return (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 7.5v9M9.5 9.2c.6-.7 1.5-1 2.5-1 1.4 0 2.5.7 2.5 1.9S13.4 12 12 12s-2.5.6-2.5 1.9 1.1 1.9 2.5 1.9c1 0 1.9-.3 2.5-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "estimate":
      return (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <rect x="5" y="3.5" width="14" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "booking":
      return (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <rect x="4.5" y="5" width="15" height="14.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 3.5v3M16 3.5v3M4.5 9.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="13.5" r="1" fill="currentColor" />
          <circle cx="12.5" cy="13.5" r="1" fill="currentColor" />
          <circle cx="16" cy="13.5" r="1" fill="currentColor" />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <path
            d="M4.5 7.5h15v9.5l-3.2-2.2H4.5V7.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8 11h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon}>
      <path
        d="M8.2 4.8c.4-.4 1.1-.5 1.6-.2l2 1.2c.5.3.7.9.5 1.4l-.8 1.8c-.1.3 0 .7.2 1 1.1 1.5 2.5 2.9 4 4 .3.2.7.3 1 .2l1.8-.8c.5-.2 1.1 0 1.4.5l1.2 2c.3.5.2 1.2-.2 1.6l-1.3 1.3c-.5.5-1.2.7-1.9.5-3.3-.8-6.4-3.2-8.9-6.4C5.4 10.7 3.8 8.2 3.5 5.7c-.1-.7.2-1.4.7-1.9l1.3-1.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

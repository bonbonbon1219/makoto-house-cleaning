import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./Header.module.css";

const links = [
  { href: "/#featured", label: "人気メニュー", icon: "featured" as const },
  { href: "/#results", label: "施工前後", icon: "compare" as const },
  { href: "/#pricing", label: "料金", icon: "price" as const },
  { href: "/#estimate", label: "自動見積", icon: "estimate" as const },
  { href: "/#contact", label: "お問い合わせ", icon: "contact" as const },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.brandJa} ホーム`}>
          <Image
            src="/brand/makoto-logo.png"
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
        </div>
      </div>
    </header>
  );
}

function NavIcon({ name }: { name: (typeof links)[number]["icon"] }) {
  switch (name) {
    case "featured":
      return (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <path
            d="M12 3.5l1.6 4.7h4.9l-4 2.9 1.5 4.7-4-2.9-4 2.9 1.5-4.7-4-2.9h4.9L12 3.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "compare":
      return (
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <rect x="3.5" y="5" width="7" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13.5" y="5" width="7" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

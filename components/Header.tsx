import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./Header.module.css";

const links = [
  { href: "/#featured", label: "人気メニュー" },
  { href: "/#results", label: "ビフォーアフター" },
  { href: "/#pricing", label: "料金" },
  { href: "/#estimate", label: "かんたん自動見積" },
  { href: "/#contact", label: "お問い合わせ" },
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
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <ThemeToggle />
          <a href={`tel:${site.phoneTel}`} className={styles.phone}>
            {site.phone}
          </a>
        </div>
      </div>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import { legalNav, site } from "@/lib/site";
import styles from "./Footer.module.css";

const homeLinks = [
  { href: "/", label: "トップページ" },
  { href: "/#estimate", label: "かんたん自動見積" },
  { href: "/#pricing", label: "料金" },
  { href: "/#contact", label: "お問い合わせ" },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <Link href="/" className={styles.brandLink} aria-label={`${site.brandJa} トップページへ`}>
            <Image
              src="/brand/makoto-logo.png"
              alt=""
              width={48}
              height={35}
              className={styles.logo}
            />
            <span className={styles.brandText}>
              <span className={styles.brandEn}>{site.brandEn}</span>
              <span className={styles.brandJa}>{site.brandJa}</span>
            </span>
          </Link>
          <p className={styles.tag}>{site.tagline}</p>
        </div>

        <div className={styles.meta}>
          <p>対応：{site.areas.join("・")}</p>
          <p>
            <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
          </p>

          <nav className={styles.siteNav} aria-label="サイト内リンク">
            {homeLinks.map((item) => (
              <Link key={item.href + item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <nav className={styles.legal} aria-label="法的情報">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <p className={styles.copy}>© {new Date().getFullYear()} {site.brandJa}</p>
        </div>
      </div>
    </footer>
  );
}

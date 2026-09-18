import Link from "next/link";
import styles from "./LegalPage.module.css";

type Crumb = { href?: string; label: string };

type Props = {
  title: string;
  description: string;
  updatedAt?: string;
  crumbs: Crumb[];
  children: React.ReactNode;
};

export function LegalPage({ title, description, updatedAt, crumbs, children }: Props) {
  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="パンくずリスト">
          <ol>
            {crumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`}>
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
              </li>
            ))}
          </ol>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{description}</p>
          {updatedAt ? <p className={styles.updated}>最終更新日：{updatedAt}</p> : null}
        </header>

        <article className={styles.article}>{children}</article>
      </div>
    </div>
  );
}

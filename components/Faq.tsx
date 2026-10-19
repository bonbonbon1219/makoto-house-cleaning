import Link from "next/link";
import { faqs } from "@/lib/site";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import styles from "./Faq.module.css";

export function Faq() {
  return (
    <section id="faq" className={`section ${styles.section}`}>
      <FaqJsonLd />
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">FAQ</p>
          <h2 className="section-title">よくある質問</h2>
          <p className="section-lead">
            作業前によくいただくご質問です。不明点はお気軽にお問い合わせください。
            サービス詳細は
            <Link href="/services">サービス一覧</Link>
            、エリア別は
            <Link href="/areas">対応エリア</Link>
            もご覧ください。
          </p>
        </div>

        <div className={styles.list}>
          {faqs.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary className={styles.q}>{item.q}</summary>
              <p className={styles.a}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

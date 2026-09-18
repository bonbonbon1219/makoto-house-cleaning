import { faqs } from "@/lib/site";
import styles from "./Faq.module.css";

export function Faq() {
  return (
    <section id="faq" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">FAQ</p>
          <h2 className="section-title">よくある質問</h2>
          <p className="section-lead">
            作業前によくいただくご質問です。不明点はお気軽にお問い合わせください。
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

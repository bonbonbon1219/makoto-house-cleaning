import { pricing } from "@/lib/site";
import styles from "./Pricing.module.css";

export function Pricing() {
  return (
    <section id="pricing" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Pricing</p>
          <h2 className="section-title">料金</h2>
          <p className="section-lead">
            表示は税込です。機種・汚れ具合・台数により変わる場合は、作業前にきちんとご説明します。
          </p>
        </div>

        <div className={styles.panel}>
          <div className={styles.head} aria-hidden="true">
            <span>メニュー</span>
            <span>料金</span>
            <span>備考</span>
          </div>
          <div className={styles.table} role="table" aria-label="料金一覧">
            {pricing.map((row) => (
              <div key={row.name} className={styles.row} role="row">
                <div className={styles.name} role="cell">
                  {row.name}
                </div>
                <div className={styles.priceWrap} role="cell">
                  <div className={styles.price}>{row.price}</div>
                  {"secondary" in row && row.secondary ? (
                    <div className={styles.secondary}>{row.secondary}</div>
                  ) : null}
                </div>
                <div className={styles.note} role="cell">
                  {row.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

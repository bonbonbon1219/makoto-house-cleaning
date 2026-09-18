import { flowSteps } from "@/lib/site";
import styles from "./Flow.module.css";

export function Flow() {
  return (
    <section id="flow" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Flow</p>
          <h2 className="section-title">ご依頼の流れ</h2>
          <p className="section-lead">初めての方も、この4ステップで完了します。</p>
        </div>

        <ol className={styles.list}>
          {flowSteps.map((step) => (
            <li key={step.step} className={styles.item}>
              <span className={styles.num}>{step.step}</span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

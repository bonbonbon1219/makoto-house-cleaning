import Image from "next/image";
import { beforeAfter } from "@/lib/site";
import styles from "./BeforeAfter.module.css";

export function BeforeAfter() {
  return (
    <section id="results" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Before / After</p>
          <h2 className="section-title">洗浄のちがい、一目で。</h2>
          <p className="section-lead">
            同じ機種・同じアングルで比較。レンジフードはカバー内のシロッコファンまで見せています。
          </p>
        </div>

        <div className={styles.list}>
          {beforeAfter.map((item) => (
            <article key={item.id} className={styles.block}>
              <div className={styles.copy}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.caption}>{item.caption}</p>
              </div>
              <div className={styles.compare}>
                <figure className={styles.figure}>
                  <div className={styles.frame}>
                    <Image
                      src={item.before}
                      alt={`${item.title}のビフォー`}
                      fill
                      sizes="(max-width: 800px) 100vw, 45vw"
                      className={styles.image}
                    />
                    <span className={styles.badge}>Before</span>
                  </div>
                </figure>
                <figure className={styles.figure}>
                  <div className={styles.frame}>
                    <Image
                      src={item.after}
                      alt={`${item.title}のアフター`}
                      fill
                      sizes="(max-width: 800px) 100vw, 45vw"
                      className={styles.image}
                    />
                    <span className={`${styles.badge} ${styles.badgeAfter}`}>After</span>
                  </div>
                </figure>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

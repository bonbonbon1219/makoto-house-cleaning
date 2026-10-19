import { beforeAfter } from "@/lib/site";
import { OptimizedImage } from "@/components/OptimizedImage";
import styles from "./BeforeAfter.module.css";

export function BeforeAfter() {
  return (
    <section id="results" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Before / After</p>
          <h2 className="section-title">エアコン・換気扇クリーニングのビフォーアフター</h2>
          <p className="section-lead">
            洗浄前後のイメージです。実際の仕上がりは機種・汚れ具合により異なります。実写真へ順次差し替え予定です。
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
                    <OptimizedImage
                      src={item.before}
                      alt={`${item.title}のビフォー（イメージ）`}
                      fill
                      sizes="(max-width: 800px) 92vw, 42vw"
                      className={styles.image}
                    />
                    <span className={styles.badge}>Before</span>
                  </div>
                </figure>
                <figure className={styles.figure}>
                  <div className={styles.frame}>
                    <OptimizedImage
                      src={item.after}
                      alt={`${item.title}のアフター（イメージ）`}
                      fill
                      sizes="(max-width: 800px) 92vw, 42vw"
                      className={styles.image}
                    />
                    <span className={`${styles.badge} ${styles.badgeAfter}`}>After</span>
                    <span className={styles.imageNote}>イメージ写真です</span>
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

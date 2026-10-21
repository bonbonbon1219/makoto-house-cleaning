import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";
import { beforeAfter, featuredServices } from "@/lib/site";
import styles from "./Featured.module.css";

const photos = {
  "kitchen-fan": beforeAfter.find((item) => item.id === "kitchen"),
  aircon: beforeAfter.find((item) => item.id === "aircon"),
} as const;

export function Featured() {
  return (
    <section id="featured" className={`section ${styles.section}`}>
      <div id="results" className="container">
        <div className="section-head">
          <p className="section-kicker">Popular</p>
          <h2 className="section-title">福岡で人気のエアコン・換気扇分解洗浄</h2>
          <p className="section-lead">
            油汚れのレンジフードと、カビ・ホコリのエアコン。見えにくい内部まで丁寧に仕上げます。
            写真は洗浄前後のイメージで、実写真へ順次差し替えます。詳しくは
            <Link href="/services">サービス一覧</Link>
            へ。
          </p>
        </div>

        <div className={styles.list}>
          {featuredServices.map((service, index) => {
            const photo = photos[service.id];
            return (
              <article key={service.id} className={styles.item}>
                <div className={styles.copy}>
                  <div className={styles.meta}>
                    <p className={styles.index}>0{index + 1}</p>
                    <span className={styles.rule} aria-hidden="true" />
                  </div>
                  <h3 className={styles.title}>
                    <Link href={service.href}>{service.title}</Link>
                  </h3>
                  <p className={styles.lead}>{service.lead}</p>
                  <ul className={styles.points}>
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className={styles.more}>
                    <Link href={service.href}>{service.title}の内容と料金</Link>
                  </p>
                </div>
                {photo ? (
                  <div className={styles.compare}>
                    <figure className={styles.figure}>
                      <div className={styles.frame}>
                        <OptimizedImage
                          src={photo.before}
                          alt={`${service.title}のビフォー（イメージ）`}
                          fill
                          sizes="(max-width: 979px) 46vw, 28vw"
                          className={styles.image}
                        />
                        <span className={styles.badge}>Before</span>
                      </div>
                    </figure>
                    <figure className={styles.figure}>
                      <div className={styles.frame}>
                        <OptimizedImage
                          src={photo.after}
                          alt={`${service.title}のアフター（イメージ）`}
                          fill
                          sizes="(max-width: 979px) 46vw, 28vw"
                          className={styles.image}
                        />
                        <span className={`${styles.badge} ${styles.badgeAfter}`}>After</span>
                      </div>
                    </figure>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

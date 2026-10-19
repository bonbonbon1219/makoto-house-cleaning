import Link from "next/link";
import { featuredServices } from "@/lib/site";
import styles from "./Featured.module.css";

export function Featured() {
  return (
    <section id="featured" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Popular</p>
          <h2 className="section-title">福岡で人気のエアコン・換気扇分解洗浄</h2>
          <p className="section-lead">
            油汚れのレンジフードと、カビ・ホコリのエアコン。見えにくい内部まで丁寧に仕上げます。
            詳しくは
            <Link href="/services">サービス一覧</Link>
            へ。
          </p>
        </div>

        <div className={styles.list}>
          {featuredServices.map((service, index) => (
            <article key={service.id} className={styles.item}>
              <div className={styles.meta}>
                <p className={styles.index}>0{index + 1}</p>
                <span className={styles.rule} aria-hidden="true" />
              </div>
              <div className={styles.body}>
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
                  <Link href={service.href}>詳しく見る</Link>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

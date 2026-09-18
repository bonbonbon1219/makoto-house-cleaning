import { featuredServices } from "@/lib/site";
import styles from "./Featured.module.css";

export function Featured() {
  return (
    <section id="featured" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Popular</p>
          <h2 className="section-title">確かな技術で、暮らしの空気を整える</h2>
          <p className="section-lead">
            油汚れの換気扇と、カビ・ホコリのエアコン。現場の見えにくいところまで、丁寧に仕上げます。
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
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.lead}>{service.lead}</p>
                <ul className={styles.points}>
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

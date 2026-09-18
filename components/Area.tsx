import { site } from "@/lib/site";
import styles from "./Area.module.css";

export function Area() {
  return (
    <section id="area" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Area</p>
          <h2 className="section-title">対応エリア</h2>
          <p className="section-lead">
            福岡市を中心に伺います。エリア外もご相談ください。
          </p>
        </div>

        <ul className={styles.areas}>
          {site.areas.map((area, index) => (
            <li key={area}>
              <span className={styles.num}>0{index + 1}</span>
              <span className={styles.name}>{area}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

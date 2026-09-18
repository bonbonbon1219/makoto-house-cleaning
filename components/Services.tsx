import { allServices } from "@/lib/site";
import styles from "./Services.module.css";

export function Services() {
  return (
    <section id="services" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Services</p>
          <h2 className="section-title">ハウスクリーニング一式</h2>
          <p className="section-lead">
            エアコンから水回り、バルコニーまで。単品でも、まとめての一式でもご依頼いただけます。
          </p>
        </div>

        <div className={styles.grid}>
          {allServices.map((group) => (
            <div key={group.group} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.group}</h3>
              <ul className={styles.items}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

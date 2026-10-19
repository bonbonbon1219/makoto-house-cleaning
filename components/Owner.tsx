import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./Owner.module.css";

export function Owner() {
  return (
    <section id="owner" className={`section ${styles.section}`}>
      <div className={`container ${styles.wrap}`}>
        <div className="section-head">
          <p className="section-kicker">About</p>
          <h2 className="section-title">私が伺います｜{site.brandJa}の方針</h2>
          <p className="section-lead">
            ハウスクリーニングは、ご自宅や店舗にお伺いするサービスです。どんな考えで作業するかを、先にお伝えします。
          </p>
        </div>

        <div className={styles.panel}>
          <p className={styles.role}>
            {site.owner.role}　{site.owner.name}
          </p>
          <p className={styles.greeting}>{site.owner.greeting}</p>
          <ul className={styles.points}>
            {site.owner.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className={styles.more}>
            事業者情報の詳細は
            <Link href="/about">会社概要</Link>
            をご覧ください。
          </p>
        </div>
      </div>
    </section>
  );
}

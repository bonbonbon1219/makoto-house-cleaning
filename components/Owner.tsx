import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./Owner.module.css";

export function Owner() {
  return (
    <section id="owner" className={`section ${styles.section}`}>
      <div className={`container ${styles.wrap}`}>
        <div className="section-head">
          <p className="section-kicker">About</p>
          <h2 className="section-title">私たちが伺います｜{site.brandJa}の方針</h2>
          <p className="section-lead">
            ご自宅や店舗でのクリーニングを、代表を含むスタッフ{site.team.staffCount}
            名が丁寧に行います。
          </p>
        </div>

        <div className={styles.panel}>
          <p className={styles.greeting}>{site.team.greeting}</p>
          <ul className={styles.points}>
            {site.team.points.map((point) => (
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

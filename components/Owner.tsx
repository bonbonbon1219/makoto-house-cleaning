import Link from "next/link";
import { site } from "@/lib/site";
import { OptimizedImage } from "@/components/OptimizedImage";
import styles from "./Owner.module.css";

export function Owner() {
  return (
    <section id="owner" className={`section ${styles.section}`}>
      <div className={`container ${styles.wrap}`}>
        <div className="section-head">
          <p className="section-kicker">About</p>
          <h2 className="section-title">私たちが伺います｜{site.brandJa}の方針</h2>
          <p className="section-lead">
            ハウスクリーニングは、ご自宅や店舗にお伺いするサービスです。代表を含む作業者4名（男性2名・女性2名）で対応します。
          </p>
        </div>

        <ul className={styles.team}>
          {site.team.members.map((member) => (
            <li key={member.id} className={styles.member}>
              <div className={styles.portrait}>
                <OptimizedImage
                  src={member.src}
                  alt={member.label}
                  width={220}
                  height={220}
                  className={styles.photo}
                />
              </div>
              <p className={styles.memberLabel}>{member.label}</p>
            </li>
          ))}
        </ul>

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

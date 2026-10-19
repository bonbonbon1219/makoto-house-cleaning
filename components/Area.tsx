import Link from "next/link";
import { site } from "@/lib/site";
import { areaSlugByName } from "@/lib/seoContent";
import styles from "./Area.module.css";

export function Area() {
  return (
    <section id="area" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Area</p>
          <h2 className="section-title">福岡市・春日市など対応エリア一覧</h2>
          <p className="section-lead">
            福岡市を中心に伺います。エリア外もご相談ください。各市の詳細は
            <Link href="/areas">対応エリア一覧</Link>
            からご覧いただけます。
          </p>
        </div>

        <ul className={styles.areas}>
          {site.areas.map((area, index) => {
            const slug = areaSlugByName[area];
            const isFukuoka = area === "福岡市";
            return (
              <li key={area}>
                <Link href={`/areas/${slug}`} className={styles.areaLink}>
                  <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.nameBlock}>
                    <span className={styles.name}>{area}</span>
                    {isFukuoka ? (
                      <span className={styles.wards}>
                        （{site.fukuokaWards.join("・")}）
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

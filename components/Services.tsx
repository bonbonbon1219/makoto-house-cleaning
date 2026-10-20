import Link from "next/link";
import { allServices } from "@/lib/site";
import styles from "./Services.module.css";

const itemHref: Record<string, string> = {
  "壁掛けエアコン（通常）": "/services/aircon-cleaning",
  "お掃除機能付きエアコン": "/services/aircon-cleaning",
  "業務用天井埋め込み式": "/services/aircon-cleaning",
  "エアコンフィルター清掃": "/services/aircon-cleaning",
  "キッチン全体（レンジフード・換気扇分解洗浄を含む）": "/services/range-hood",
  "レンジフード・換気扇分解洗浄（単品）": "/services/range-hood",
  "コンロまわり油汚れ除去": "/services/range-hood",
  "浴室クリーニング": "/services/house-cleaning",
  "トイレクリーニング": "/services/house-cleaning",
  "洗面台まわり": "/services/house-cleaning",
  "洗濯パンまわり": "/services/house-cleaning",
  "バルコニー清掃": "/services/house-cleaning",
  "ハウスクリーニング一式": "/services/house-cleaning",
  "退去・入居前清掃": "/business",
  "店舗・オフィス清掃": "/business",
  "飲食店などの換気口・油汚れ洗浄": "/business",
};

export function Services() {
  return (
    <section id="services" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Services</p>
          <h2 className="section-title">ハウスクリーニングメニュー一覧</h2>
          <p className="section-lead">
            エアコンから水回り、バルコニーまで。福岡市周辺で、単品でも一式でもご依頼いただけます。
            詳しくは
            <Link href="/services/house-cleaning">ハウスクリーニング詳細</Link>
            へ。退去後の空室清掃は
            <Link href="/business">管理会社・オーナー様向けのご案内</Link>
            をご覧ください。
          </p>
        </div>

        <div className={styles.grid}>
          {allServices.map((group) => (
            <div key={group.group} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.group}</h3>
              <ul className={styles.items}>
                {group.items.map((item) => {
                  const href = itemHref[item];
                  return (
                    <li key={item}>
                      {href ? <Link href={href}>{item}</Link> : item}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { RichLayout } from "@/components/RichPage";
import styles from "@/components/RichPage.module.css";
import { areaPages } from "@/lib/seoContent";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "対応エリア",
  description: `${site.areas.join("・")}のエアコン洗浄・レンジフード分解洗浄・ハウスクリーニング対応エリア一覧。`,
  alternates: { canonical: "/areas" },
};

const services = [
  { href: "/services/aircon-cleaning", label: "エアコンクリーニング" },
  { href: "/services/range-hood", label: "レンジフード・換気扇分解洗浄" },
  { href: "/services/house-cleaning", label: "ハウスクリーニング一式" },
  { href: "/business", label: "退去後清掃・空室クリーニング" },
] as const;

export default function AreasIndexPage() {
  return (
    <RichLayout
      kicker="対応エリア"
      title="対応エリア"
      lead={`${site.brandJa}は、${site.areas.join("・")}を中心に伺います。エリア外もご相談ください。`}
      crumbs={[
        { href: "/", label: "ホーム" },
        { label: "対応エリア" },
      ]}
    >
      <section className={styles.section} aria-labelledby="city-title">
        <h2 id="city-title">市区町村別のご案内</h2>
        <div className={styles.cards}>
          {areaPages.map((page) => (
            <Link key={page.slug} href={`/areas/${page.slug}`} className={`${styles.card} ${styles.cardLink}`}>
              <h3>{page.h1}</h3>
              <p>{page.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="service-title">
        <h2 id="service-title">サービス詳細</h2>
        <ul className={styles.menus}>
          {services.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </RichLayout>
  );
}

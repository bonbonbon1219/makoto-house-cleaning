import type { Metadata } from "next";
import Link from "next/link";
import { RichLayout } from "@/components/RichPage";
import styles from "@/components/RichPage.module.css";
import { areaPages, servicePages } from "@/lib/seoContent";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "サービス一覧",
  description: `エアコンクリーニング・レンジフード分解洗浄・ハウスクリーニングなど、${site.brandJa}のサービス一覧。`,
  alternates: { canonical: "/services" },
};

export default function ServicesIndexPage() {
  return (
    <RichLayout
      kicker="サービス"
      title="サービス一覧"
      lead="エアコン洗浄、レンジフードの分解洗浄、水回りまで。単品でも、同じ日にまとめても依頼できます。"
      crumbs={[
        { href: "/", label: "ホーム" },
        { label: "サービス一覧" },
      ]}
    >
      <section className={styles.section} aria-labelledby="service-title">
        <h2 id="service-title">主なサービス</h2>
        <div className={styles.cards}>
          {servicePages.map((page) => (
            <Link key={page.slug} href={`/services/${page.slug}`} className={`${styles.card} ${styles.cardLink}`}>
              <h3>{page.h1}</h3>
              <p>{page.lead}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="owner-title">
        <h2 id="owner-title">不動産管理会社・オーナー様</h2>
        <p className={styles.intro}>
          退去後の空室清掃、原状回復の洗浄、エアコンとレンジフードの分解洗浄は
          <Link href="/business">管理会社・オーナー様向けのページ</Link>
          からご相談ください。金額は物件ごとに見積もりし、ページには出していません。
        </p>
      </section>

      <section className={styles.section} aria-labelledby="price-title">
        <h2 id="price-title">料金・見積</h2>
        <ul className={styles.menus}>
          <li>
            <Link href="/#pricing">料金表</Link>
          </li>
          <li>
            <Link href="/#estimate">かんたん自動見積</Link>
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="area-title">
        <h2 id="area-title">対応エリア</h2>
        <p className={styles.intro}>{site.areas.join("・")}を中心に対応しています。</p>
        <ul className={styles.menus}>
          {areaPages.map((page) => (
            <li key={page.slug}>
              <Link href={`/areas/${page.slug}`}>{page.h1}</Link>
            </li>
          ))}
          <li>
            <Link href="/areas">対応エリア一覧</Link>
          </li>
        </ul>
      </section>
    </RichLayout>
  );
}

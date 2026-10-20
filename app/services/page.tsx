import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { servicePages } from "@/lib/seoContent";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "サービス一覧",
  description: `エアコンクリーニング・レンジフード分解洗浄・ハウスクリーニングなど、${site.brandJa}のサービス一覧。`,
  alternates: { canonical: "/services" },
};

export default function ServicesIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "/" },
          { name: "サービス一覧" },
        ]}
      />
      <LegalPage
        title="サービス一覧"
        description="人気のエアコン洗浄・レンジフード分解洗浄から、ハウスクリーニング一式までご案内します。"
        updatedAt={site.legal.updatedAt}
        crumbs={[
          { href: "/", label: "ホーム" },
          { label: "サービス一覧" },
        ]}
      >
        <h2>主なサービス</h2>
        <ul>
          {servicePages.map((page) => (
            <li key={page.slug}>
              <Link href={`/services/${page.slug}`}>{page.h1}</Link>
              <br />
              <span>{page.lead}</span>
            </li>
          ))}
        </ul>

        <h2>不動産管理会社・オーナー様</h2>
        <p>
          退去後の空室清掃、原状回復の洗浄、エアコンとレンジフードの分解洗浄は
          <Link href="/business">管理会社・オーナー様向けのページ</Link>
          からご相談ください。金額は物件ごとに見積もりし、ページには出していません。
        </p>

        <h2>対応エリア</h2>
        <p>
          <Link href="/areas">{site.areas.join("・")}</Link>
          を中心に対応しています。
        </p>

        <h2>料金・見積</h2>
        <ul>
          <li>
            <Link href="/#pricing">料金表</Link>
          </li>
          <li>
            <Link href="/#estimate">かんたん自動見積</Link>
          </li>
          <li>
            <Link href="/#contact">お問い合わせ</Link>
          </li>
        </ul>
      </LegalPage>
    </>
  );
}

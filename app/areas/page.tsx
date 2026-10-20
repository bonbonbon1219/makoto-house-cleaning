import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { areaPages } from "@/lib/seoContent";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "対応エリア",
  description: `${site.areas.join("・")}のエアコン洗浄・レンジフード分解洗浄・ハウスクリーニング対応エリア一覧。`,
  alternates: { canonical: "/areas" },
};

export default function AreasIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "/" },
          { name: "対応エリア" },
        ]}
      />
      <LegalPage
        title="対応エリア"
        description={`${site.brandJa}は、${site.areas.join("・")}を中心に伺います。エリア外もご相談ください。`}
        updatedAt={site.legal.updatedAt}
        crumbs={[
          { href: "/", label: "ホーム" },
          { label: "対応エリア" },
        ]}
      >
        <h2>市区町村別のご案内</h2>
        <ul>
          {areaPages.map((page) => (
            <li key={page.slug}>
              <Link href={`/areas/${page.slug}`}>{page.h1}</Link>
            </li>
          ))}
        </ul>

        <h2>サービス詳細</h2>
        <ul>
          <li>
            <Link href="/services/aircon-cleaning">エアコンクリーニング</Link>
          </li>
          <li>
            <Link href="/services/range-hood">レンジフード・換気扇分解洗浄</Link>
          </li>
          <li>
            <Link href="/services/house-cleaning">ハウスクリーニング一式</Link>
          </li>
          <li>
            <Link href="/business">退去後清掃・空室クリーニング</Link>
          </li>
          <li>
            <Link href="/services">ハウスクリーニングのサービス一覧</Link>
          </li>
        </ul>

        <h2>予約・お問い合わせ</h2>
        <p>
          希望日の空きは
          <Link href="/booking">オンライン予約</Link>
          で確認できます。内容の相談は
          <Link href="/#contact">お問い合わせ</Link>
          またはお電話（{site.phone}）までご連絡ください。
        </p>
      </LegalPage>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import styles from "@/components/LegalPage.module.css";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: `${site.brandFull}の特定商取引法に基づく表記です。販売事業者、料金、支払方法、キャンセル等について記載しています。`,
  alternates: {
    canonical: "/tokushoho",
  },
  openGraph: {
    title: `特定商取引法に基づく表記｜${site.brandJa}`,
    description: "販売事業者情報、役務の対価、支払方法、キャンセルなどの表記です。",
    type: "article",
  },
};

export default function TokushohoPage() {
  const rows = [
    ["販売事業者", site.legal.operator],
    ["運営統括責任者", site.legal.representative],
    ["所在地", `〒${site.legal.postalCode} ${site.legal.address}`],
    ["電話番号", site.phone],
    ["メールアドレス", site.email || ""],
    ["販売価格", site.legal.priceNote],
    ["商品以外の必要料金", site.legal.extraFees],
    ["支払方法", site.legal.payment],
    ["支払時期", "原則として作業完了後にお支払いいただきます。"],
    ["役務の提供時期", site.legal.delivery],
    ["返品・キャンセル", site.legal.cancel],
    ["対応エリア", site.areas.join("・")],
    ["営業時間", site.legal.businessHours],
  ] as const;

  return (
    <LegalPage
      title="特定商取引法に基づく表記"
      description="通信販売・役務提供に関する表示です。"
      updatedAt={site.legal.updatedAt}
      crumbs={[
        { href: "/", label: "ホーム" },
        { label: "特定商取引法に基づく表記" },
      ]}
    >
      <table>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>補足</h2>
      <p>
        料金の詳細は
        <Link href="/#pricing">料金</Link>
        をご確認ください。正式なお見積りは作業内容確認後にご案内します。
      </p>

      <p className={styles.note}>
        関連ページ：
        <Link href="/about">会社概要</Link>
        {" ／ "}
        <Link href="/privacy">プライバシーポリシー</Link>
      </p>
    </LegalPage>
  );
}

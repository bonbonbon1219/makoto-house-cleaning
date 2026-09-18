import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import styles from "@/components/LegalPage.module.css";

export const metadata: Metadata = {
  title: "会社概要",
  description: `${site.brandFull}の会社概要です。福岡市・春日市・那珂川市・大野城市でエアコン洗浄・レンジフード分解洗浄・ハウスクリーニングを提供する事業者情報を掲載しています。`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `会社概要｜${site.brandJa}`,
    description: "屋号、所在地、対応エリア、事業内容などの事業者情報です。",
    type: "profile",
  },
};

export default function AboutPage() {
  const rows = [
    ["事業者", site.legal.operator],
    ["代表", site.legal.representative],
    ["所在地", `〒${site.legal.postalCode} ${site.legal.address}`],
    ["電話番号", site.phone],
    ["メール", site.email || ""],
    ["対応エリア", site.areas.join("・")],
    ["営業時間", site.legal.businessHours],
    ["事業内容", site.legal.business],
  ] as const;

  return (
    <LegalPage
      title="会社概要"
      description={`${site.brandJa}は、福岡市を中心にエアコン洗浄とハウスクリーニングを行うクリーニング事業者です。`}
      updatedAt={site.legal.updatedAt}
      crumbs={[
        { href: "/", label: "ホーム" },
        { label: "会社概要" },
      ]}
    >
      <h2>基本情報</h2>
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

      <h2>私たちの方針</h2>
      <p>
        「中まで、きちんと。」を大切に、見えにくい内部の汚れまで丁寧に洗い上げます。人気メニューはレンジフード・換気扇の分解洗浄とエアコン洗浄です。
      </p>
      <ul>
        <li>作業前後の状態確認を丁寧に行います</li>
        <li>料金は税込で明示し、変更がある場合は事前にご説明します</li>
        <li>{site.areas.join("・")}を中心に、地域の暮らしに寄り添います</li>
      </ul>

      <h2>主要サービス</h2>
      <ul>
        <li>
          <Link href="/#featured">レンジフード・換気扇分解洗浄／エアコン洗浄</Link>
        </li>
        <li>
          <Link href="/#services">ハウスクリーニング一式</Link>
        </li>
        <li>
          <Link href="/#pricing">料金</Link>
        </li>
      </ul>

      <h2>お問い合わせ</h2>
      <p>
        ご相談・お見積りは
        <Link href="/#contact">お問い合わせフォーム</Link>
        またはお電話（{site.phone}）までご連絡ください。
      </p>

      <p className={styles.note}>
        関連ページ：
        <Link href="/privacy">プライバシーポリシー</Link>
        {" ／ "}
        <Link href="/tokushoho">特定商取引法に基づく表記</Link>
      </p>
    </LegalPage>
  );
}

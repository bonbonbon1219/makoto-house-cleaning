import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import styles from "@/components/LegalPage.module.css";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${site.brandJa}（${site.brandEn}）の個人情報の取り扱いに関する方針です。福岡市周辺のハウスクリーニングサービスにおける問い合わせ情報の利用目的・管理について定めています。`,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: `プライバシーポリシー｜${site.brandJa}`,
    description: "個人情報の取得・利用・保管・開示請求に関する方針です。",
    type: "article",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      description={`${site.brandJa}（以下「当店」）は、お客様の個人情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。`}
      updatedAt={site.legal.updatedAt}
      crumbs={[
        { href: "/", label: "ホーム" },
        { label: "プライバシーポリシー" },
      ]}
    >
      <h2>1. 事業者情報</h2>
      <p>
        事業者名：{site.legal.operator}
        <br />
        住所：〒{site.legal.postalCode} {site.legal.address}
        <br />
        電話：{site.phone}
        {site.email ? (
          <>
            <br />
            メール：{site.email}
          </>
        ) : null}
      </p>

      <h2>2. 取得する個人情報</h2>
      <p>当店は、サービス提供およびお問い合わせ対応のため、次の情報を取得する場合があります。</p>
      <ul>
        <li>氏名、電話番号、メールアドレス</li>
        <li>お住まいの地域（市区町村）およびその他地域の記入内容</li>
        <li>ご希望メニュー、台数、希望日時、お問い合わせ内容</li>
        <li>サイト利用に関する端末情報・アクセスログ（Cookie等を含む場合があります）</li>
      </ul>

      <h2>3. 利用目的</h2>
      <ul>
        <li>お見積り、予約、作業実施、アフターフォローのため</li>
        <li>お問い合わせへの回答のため</li>
        <li>サービス改善、品質管理のため</li>
        <li>重要なお知らせの連絡のため</li>
      </ul>

      <h2>4. 第三者提供</h2>
      <p>
        法令に基づく場合を除き、お客様の同意なく個人情報を第三者に提供しません。業務委託先に預託する場合は、委託先を適切に監督します。
      </p>

      <h2>5. 保管・安全管理</h2>
      <p>
        個人情報は、漏えい・滅失・毀損の防止のため、必要かつ適切な安全管理措置を講じます。利用目的達成後は、法令で定められた期間を経過した情報を適切に削除または匿名化します。
      </p>

      <h2>6. Cookie等について</h2>
      <p>
        当サイトでは、利便性向上やアクセス解析のため Cookie 等を使用する場合があります。ブラウザ設定により Cookie を無効化できますが、一部機能が利用できなくなることがあります。
      </p>

      <h2>7. 開示・訂正・削除等の請求</h2>
      <p>
        ご本人からの個人情報の開示・訂正・削除等のご請求には、合理的な範囲で対応します。下記連絡先までご連絡ください。
      </p>
      <p>
        連絡先：{site.email ? `${site.email} ／ ` : ""}
        {site.phone}
      </p>

      <h2>8. 本ポリシーの変更</h2>
      <p>
        法令改正やサービス内容の変更に応じて、本ポリシーを改定することがあります。重要な変更がある場合は、当サイト上でお知らせします。
      </p>

      <p className={styles.note}>
        関連ページ：
        <Link href="/about">会社概要</Link>
        {" ／ "}
        <Link href="/tokushoho">特定商取引法に基づく表記</Link>
      </p>
    </LegalPage>
  );
}

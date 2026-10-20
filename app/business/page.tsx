import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { BusinessInquiry } from "@/components/BusinessInquiry";
import { businessFaqs } from "@/lib/businessPage";
import { areaSlugByName } from "@/lib/seoContent";
import { site } from "@/lib/site";
import styles from "./business.module.css";

const title = "福岡市の退去後清掃・空室クリーニング";
const description =
  "福岡市・春日市・那珂川市・大野城市・太宰府市・筑紫野市・糸島市の不動産管理会社・オーナー様向け。退去後の空室清掃、原状回復の洗浄、エアコンとレンジフードの分解洗浄。1室から。金額は掲載せず、物件ごとに見積もりします。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/business" },
  openGraph: {
    title: `${title}｜${site.brandJa}`,
    description,
    type: "article",
  },
};

const stresses = [
  {
    title: "内見で仕上がりの差が出る",
    body: "エアコンとレンジフードは、カバーの表面だけでなく分解して内部まで洗います。水回り、排水口、建具の隅も、空室として次に見せられる状態かを見ながら仕上げます。",
  },
  {
    title: "繁忙期に清掃が捕まらない",
    body: "専属でなくても、1室から受けます。空いている日は短い日程でも調整します。スタッフ4名のため、2月から3月は予定が先に埋まります。分かった時点でご連絡ください。",
  },
  {
    title: "仕上がり確認のために現地へ行く",
    body: "作業前後の写真をメールでお送りします。空室はキーボックスなど鍵の受け渡しで、担当者様の立ち会いなしでも作業できます。",
  },
  {
    title: "個人宅の頼み方だと社内で通しにくい",
    body: "会社名・物件・間取りで見積もりします。金額はこのページには出していません。支払いは現金または振込です。締め日やインボイスの要否は、見積もりのときにご確認ください。",
  },
] as const;

const menus = [
  {
    title: "退去後の空室清掃",
    body: "1Rからファミリータイプまで。キッチン、浴室、トイレ、洗面、床、建具まわりを、次の内見に向けて清掃します。",
  },
  {
    title: "エアコンの内部洗浄",
    body: "壁掛け、お掃除機能付き、業務用の天井埋め込み。退去のたびに残るカビとホコリを、高圧洗浄で落とします。",
  },
  {
    title: "レンジフード・換気扇の分解洗浄",
    body: "油で固まったファンも分解して洗います。飲食店や油汚れの強い部屋でも、洗浄だけのご依頼を受けます。",
  },
  {
    title: "部分清掃・洗いの応援",
    body: "水回りだけ、キッチンだけ、といった部分清掃。工務店やクロス業者の原状回復のうち、洗浄だけをスポットで引き受けることもできます。",
  },
] as const;

const steps = [
  "物件の情報をご連絡ください。住所、間取り、鍵の受け渡し、希望日、汚れの程度が分かると見積もりが早くなります。",
  "内容を確認し、日程と見積もりをご案内します。法人向けの金額は、このページには出さず、物件ごとにご案内します。",
  "空室を清掃します。作業中に破損や設備の不具合に気づいたら、その場でご連絡します。修理や部品交換はしません。",
  "作業前後の写真をメールでお送りし、ご請求します。",
] as const;

export default function BusinessPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: businessFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "福岡市周辺の退去後清掃・空室クリーニング",
    serviceType: "空室清掃",
    url: "https://makoto-hk.com/business",
    provider: {
      "@type": "LocalBusiness",
      name: site.brandJa,
      telephone: site.phone,
      email: site.email,
      url: "https://makoto-hk.com",
    },
    areaServed: site.areas.map((name) => ({ "@type": "City", name })),
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "/" },
          { name: "退去後清掃・空室クリーニング" },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />

      <article className={styles.page}>
        <div className="container">
          <nav className={styles.crumbs} aria-label="パンくずリスト">
            <ol>
              <li>
                <Link href="/">ホーム</Link>
              </li>
              <li>
                <span>退去後清掃・空室クリーニング</span>
              </li>
            </ol>
          </nav>

          <header className={styles.hero}>
            <p className={styles.kicker}>不動産管理会社・オーナー様へ</p>
            <h1>{title}</h1>
            <p className={styles.catch}>次の内見に備えて、見えるところも、中まで。</p>
            <p className={styles.lead}>
              福岡市と周辺の賃貸空室を、退去後に清掃します。原状回復のうち洗浄だけ、エアコンとレンジフードの分解洗浄、1室だけのスポットも受けています。清掃の外注先をお探しの管理会社、工務店、リフォーム会社からのご相談もこちらです。
            </p>
            <ul className={styles.points}>
              <li>1室から対応</li>
              <li>空室は立ち会いなしも可</li>
              <li>作業前後の写真をメールで共有</li>
            </ul>
            <div className={styles.actions}>
              <a href="#inquiry" className="btn btn-primary">
                見積もりの相談
              </a>
              <a href={`tel:${site.phoneTel}`} className="btn btn-outline">
                電話 {site.phone}
              </a>
            </div>
            <p className={styles.phoneNote}>
              {site.phoneNote}。管理会社・オーナー様のご依頼もこの番号です。
            </p>
          </header>

          <section className={styles.section} aria-labelledby="stress-title">
            <h2 id="stress-title">管理の現場で起きやすいこと</h2>
            <div className={styles.cards}>
              {stresses.map((item) => (
                <section key={item.title} className={styles.card}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="menu-title">
            <h2 id="menu-title">受けられる作業</h2>
            <p className={styles.intro}>
              料金は間取りと汚れで変わるため、金額は載せていません。個人宅向けの
              <Link href="/#pricing">料金表</Link>
              とは別に、物件を伺って見積もりします。
            </p>
            <div className={styles.cards}>
              {menus.map((item) => (
                <section key={item.title} className={styles.card}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
            <p className={styles.intro}>
              単体の作業内容は
              <Link href="/services/aircon-cleaning">エアコンクリーニング</Link>
              、
              <Link href="/services/range-hood">レンジフード分解洗浄</Link>
              、
              <Link href="/services/house-cleaning">ハウスクリーニング</Link>
              もご覧ください。
            </p>
          </section>

          <section className={styles.section} aria-labelledby="scope-title">
            <h2 id="scope-title">洗浄と清掃までです</h2>
            <p className={styles.intro}>
              クロスや床の張り替え、設備の交換、修理、残置物の処分は行いません。原状回復の「洗い」だけを、工事の前後で入れる形が向いています。
            </p>
          </section>

          <section className={styles.section} aria-labelledby="flow-title">
            <h2 id="flow-title">ご依頼の流れ</h2>
            <ol className={styles.steps}>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className={styles.section} aria-labelledby="area-title">
            <h2 id="area-title">対応エリア</h2>
            <p className={styles.intro}>
              福岡市（東区・博多区・中央区・南区・西区・城南区・早良区）を中心に、春日市、那珂川市、大野城市、太宰府市、筑紫野市、糸島市へ伺います。エリア外は距離と日程でご相談ください。個人宅の空き確認は
              <Link href="/booking">オンライン予約</Link>
              からどうぞ。
            </p>
            <ul className={styles.areas}>
              {site.areas.map((name) => (
                <li key={name}>
                  <Link href={`/areas/${areaSlugByName[name]}`}>{name}のエアコン・ハウスクリーニング</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="faq-title">
            <h2 id="faq-title">よくあるご相談</h2>
            <div className={styles.faqs}>
              {businessFaqs.map((item) => (
                <section key={item.q}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.section} id="inquiry" aria-labelledby="inquiry-title">
            <h2 id="inquiry-title">管理会社・オーナー様のご相談</h2>
            <p className={styles.intro}>
              個人のお客様用フォームとは別に受け付けます。物件が複数ある場合は、メッセージに棟数や希望の順番を書いてください。
            </p>
            <BusinessInquiry />
          </section>
        </div>
      </article>
    </>
  );
}

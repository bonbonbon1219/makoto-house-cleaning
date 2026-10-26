import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { areaServiceLinks } from "@/lib/seoContent";
import { site } from "@/lib/site";
import styles from "./FukuokaArea.module.css";

const title = "福岡市のエアコン・ハウスクリーニング";
const updatedAt = "2026年10月26日";

const requests = [
  {
    title: "カビ臭い、冷えが弱い",
    body: "使い始めにカビ臭い、以前より冷えが弱い、フィルターは掃除しているのにすぐ汚れる、という相談が多いです。",
  },
  {
    title: "西区・早良区の戸建て",
    body: "リビングと寝室を同じ日にまとめる依頼が多いです。2〜3台になることもあります。",
  },
  {
    title: "博多区・中央区",
    body: "マンションの壁掛けと、店舗の天井埋め込みがあります。",
  },
  {
    title: "換気扇や浴室も同じ日",
    body: "キッチンの換気扇や浴室を、エアコンと同じ日に頼むこともあります。",
  },
] as const;

const wards = [
  {
    title: "博多区・中央区",
    body: "路上に止めにくい場所があります。近隣のコインパーキングの有無と、壁掛け1台あたり60〜90分という作業時間を、先に教えてください。",
  },
  {
    title: "東区・南区・城南区",
    body: "住宅地は、敷地内に止められるかが分かると日程を出しやすいです。",
  },
  {
    title: "早良区・西区",
    body: "戸建てで2〜3台まとめることが多く、台数とお掃除機能の有無が分かると見積もりが早くなります。",
  },
  {
    title: "集合住宅はどの区も",
    body: "共用部のルールと、室外機まわりに入れるかを確認します。",
  },
] as const;

const prices = [
  {
    title: "壁掛けエアコン 8,800円",
    body: "通常タイプ、税込。同じ日の2台目から1台7,000円です。2台なら15,800円です。",
  },
  {
    title: "お掃除機能付き 16,500円〜",
    body: "税込。リモコンの「内部クリーン」だけでは分かりません。型番か本体の写真を送ってください。",
  },
  {
    title: "天井埋め込み 22,000円〜",
    body: "業務用、税込。店舗での依頼もあります。",
  },
  {
    title: "セット割 2,000円",
    body: "浴室やレンジフードなど、壁掛け以外と一緒で2件以上のときです。何件でも2,000円まで。壁掛けだけの複数台には付きません。",
  },
  {
    title: "レンジフード 9,900円〜",
    body: "換気扇の分解洗浄、単品、税込。エアコンと同じ日に受けられます。",
  },
  {
    title: "キッチン全体 16,500円〜",
    body: "税込。換気扇の分解洗浄が含まれます。",
  },
  {
    title: "浴室 13,200円〜",
    body: "税込。エアコンと同じ訪問で受けられます。",
  },
  {
    title: "トイレ 5,500円〜",
    body: "税込。",
  },
] as const;

const steps = [
  "養生をします。",
  "分解します。",
  "高圧洗浄します。",
  "組み立てます。",
  "試運転まで見て終わります。",
] as const;

const bookingNotes = [
  {
    title: "分かると早いこと",
    body: "区名と町名、台数、お掃除機能の有無、敷地内に止められるか、希望日です。",
  },
  {
    title: "埋まりやすい時期",
    body: "2月から3月、6月から8月はスタッフ4名の予定が埋まりやすいので、分かった時点で連絡してください。",
  },
  {
    title: "支払い",
    body: "現金または振込です。",
  },
  {
    title: "キャンセル",
    body: "作業当日の無断キャンセルだけ、予約金額の100％です。事前の連絡によるキャンセルは無料です。",
  },
] as const;

const faqs = [
  {
    q: "博多区のマンションでも頼めますか",
    a: "共用部のルールと駐車が分かれば伺えます。",
  },
  {
    q: "お掃除機能付きかどうか自分で分かりますか",
    a: "型番か写真を送ってください。",
  },
  {
    q: "2台頼むといくらですか",
    a: "通常の壁掛けなら8,800円と7,000円で、15,800円です。",
  },
  {
    q: "換気扇も同じ日に洗えますか",
    a: "できます。単品は9,900円〜です。",
  },
  {
    q: "追加料金はいつ分かりますか",
    a: "高所や特殊な機種などで変わる場合は、作業前に説明します。",
  },
] as const;

export function FukuokaArea() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    serviceType: "エアコンクリーニング",
    url: "https://makoto-hk.com/areas/fukuoka",
    provider: {
      "@type": "LocalBusiness",
      name: site.brandJa,
      telephone: site.phone,
      email: site.email,
      url: "https://makoto-hk.com",
    },
    areaServed: { "@type": "City", name: "福岡市" },
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "/" },
          { name: "対応エリア", path: "/areas" },
          { name: title },
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
                <Link href="/areas">対応エリア</Link>
              </li>
              <li>
                <span>{title}</span>
              </li>
            </ol>
          </nav>

          <header className={styles.hero}>
            <p className={styles.kicker}>福岡市7区対応</p>
            <h1>{title}</h1>
            <p className={styles.catch}>壁掛けは1台8,800円、2台目から7,000円です（税込）。</p>
            <p className={styles.lead}>
              福岡市の東区・博多区・中央区・南区・城南区・早良区・西区へ、エアコンの洗浄とハウスクリーニングで伺います。拠点は那珂川市です。
            </p>
            <ul className={styles.points}>
              <li>福岡市7区</li>
              <li>壁掛け 8,800円</li>
              <li>2台目から 7,000円</li>
              <li>セット割は 2,000円まで</li>
            </ul>
            <div className={styles.actions}>
              <Link href="/booking" className="btn btn-primary">
                オンライン予約
              </Link>
              <a href={`tel:${site.phoneTel}`} className="btn btn-outline">
                電話 {site.phone}
              </a>
            </div>
            <p className={styles.phoneNote}>{site.phoneNote}</p>
            <p className={styles.updated}>最終更新日：{updatedAt}</p>
          </header>

          <section className={styles.section} aria-labelledby="request-title">
            <h2 id="request-title">福岡市で多い依頼</h2>
            <div className={styles.cards}>
              {requests.map((item) => (
                <section key={item.title} className={styles.card}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="ward-title">
            <h2 id="ward-title">区によって確認することが違います</h2>
            <div className={styles.cards}>
              {wards.map((item) => (
                <section key={item.title} className={styles.card}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="price-title">
            <h2 id="price-title">料金の見方</h2>
            <p className={styles.intro}>
              水回りも、同じ訪問で受けられます。室外機洗浄や防カビのコートは、メニューにしていません。汚れや機種で金額が変わるときは、作業前に説明します。
            </p>
            <div className={styles.cards}>
              {prices.map((item) => (
                <section key={item.title} className={styles.card}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
            <p className={styles.intro}>
              一覧は
              <Link href="/#pricing">料金</Link>
              、組み合わせの金額は
              <Link href="/#estimate">自動見積</Link>
              で確認できます。
            </p>
          </section>

          <section className={styles.section} aria-labelledby="flow-title">
            <h2 id="flow-title">当日の流れ</h2>
            <p className={styles.intro}>
              壁掛け1台でおよそ60〜90分、お掃除機能付きはそれより長くなります。
            </p>
            <ol className={styles.steps}>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className={styles.section} aria-labelledby="booking-title">
            <h2 id="booking-title">予約のときにあると助かるもの</h2>
            <div className={styles.cards}>
              {bookingNotes.map((item) => (
                <section key={item.title} className={styles.card}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="faq-title">
            <h2 id="faq-title">よくある質問</h2>
            <div className={styles.faqs}>
              {faqs.map((item) => (
                <section key={item.q}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="menu-title">
            <h2 id="menu-title">このエリアでよく依頼されるメニュー</h2>
            <ul className={styles.menus}>
              {areaServiceLinks("福岡市").map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/areas">対応エリア一覧</Link>
              </li>
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="contact-title">
            <h2 id="contact-title">予約・お問い合わせ</h2>
            <p className={styles.intro}>
              希望日の空きはオンライン予約で確認できます。内容の相談はお問い合わせ、電話、メールでも受けています。
            </p>
            <div className={styles.actions}>
              <Link href="/booking" className="btn btn-primary">
                オンライン予約
              </Link>
              <Link href="/#contact" className="btn btn-outline">
                お問い合わせ
              </Link>
            </div>
            <p className={styles.phoneNote}>
              <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
              {" · "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className={styles.phoneNote}>{site.hours}</p>
          </section>
        </div>
      </article>
    </>
  );
}

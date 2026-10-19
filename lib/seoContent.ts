import { pricing, site } from "@/lib/site";

export type SeoSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: SeoSection[];
  related: { href: string; label: string }[];
};

const contactCta =
  "ご相談・お見積りはお問い合わせフォーム、お電話、またはメールまで。エアコンの型番や汚れ箇所の写真があると、よりスムーズにご案内できます。";

export const areaPages: SeoPage[] = [
  {
    slug: "fukuoka",
    title: "福岡市のエアコン・ハウスクリーニング",
    description:
      "福岡市対応のエアコン洗浄・レンジフード分解洗浄・ハウスクリーニング。壁掛け9,000円／2台目〜7,000円。那珂川市拠点の真ハウスクリーニングが伺います。",
    h1: "福岡市のエアコン・ハウスクリーニング",
    lead: "福岡市（東区・博多区・中央区・南区・城南区・早良区・西区）を中心に、エアコン内部のカビ・ホコリ洗浄と、キッチン換気扇の分解洗浄に伺います。",
    sections: [
      {
        heading: "福岡市でよくご相談いただく内容",
        bullets: [
          "エアコンの臭い・効きが悪い（壁掛け／お掃除機能付き）",
          "マンションのレンジフード油汚れ",
          "店舗・オフィスの天井埋め込みエアコン",
          "浴室・トイレなど水回りとのまとめ依頼",
        ],
      },
      {
        heading: "福岡市での作業のポイント",
        paragraphs: [
          "マンションや商業エリアでは、駐車スペースの有無が作業効率に影響します。近隣パーキングや敷地内駐車の可否を事前にお知らせください。",
          "夏前・梅雨明けは予約が集中しやすい時期です。臭いが気になり始めたタイミングでのご相談がおすすめです。",
        ],
      },
      {
        heading: "料金の目安（税込）",
        bullets: pricing.slice(0, 5).map((item) => {
          const secondary = "secondary" in item ? item.secondary : undefined;
          return secondary ? `${item.name}：${item.price}（${secondary}）` : `${item.name}：${item.price}`;
        }),
      },
      {
        heading: "お申し込みの流れ",
        paragraphs: [
          "ご希望メニュー・台数・ご希望日をお知らせください。型番シールや汚れ箇所の写真があると、追加の有無を事前に確認しやすくなります。",
          contactCta,
        ],
      },
    ],
    related: [
      { href: "/services/aircon-cleaning", label: "エアコンクリーニング詳細" },
      { href: "/services/range-hood", label: "レンジフード分解洗浄詳細" },
      { href: "/areas/kasuga", label: "春日市の対応" },
      { href: "/#contact", label: "お問い合わせ" },
    ],
  },
  {
    slug: "kasuga",
    title: "春日市のエアコン・ハウスクリーニング",
    description:
      "春日市対応のエアコン洗浄・レンジフード分解洗浄。那珂川市拠点の真ハウスクリーニングが、住宅・店舗へ伺います。",
    h1: "春日市のエアコン・ハウスクリーニング",
    lead: "春日市にお住まいの方・店舗様向けに、エアコン内部洗浄とレンジフード分解洗浄を中心としたハウスクリーニングを行っています。",
    sections: [
      {
        heading: "春日市で選ばれる理由",
        paragraphs: [
          "那珂川市拠点のため、春日市への移動がしやすく、日程調整のご相談がしやすいエリアです。",
          "一戸建て・マンションどちらも対応します。複数台のエアコンや、キッチンとの同時依頼もご相談ください。",
        ],
      },
      {
        heading: "料金・所要時間の目安",
        bullets: [
          "壁掛けエアコン（通常）：9,000円／2台目〜7,000円（税込）",
          "作業時間の目安：壁掛け1台あたり約60〜90分",
          "レンジフード分解洗浄：11,000円〜（税込）、約90〜120分",
        ],
      },
      {
        heading: "ご予約時にあると助かる情報",
        bullets: [
          "市区町村（春日市）と最寄り駅・目印",
          "エアコン台数・お掃除機能の有無",
          "駐車場の有無",
          "型番シールや汚れ箇所の写真",
        ],
      },
    ],
    related: [
      { href: "/areas/fukuoka", label: "福岡市の対応" },
      { href: "/areas/nakagawa", label: "那珂川市の対応" },
      { href: "/services/aircon-cleaning", label: "エアコンクリーニング詳細" },
      { href: "/#contact", label: "お問い合わせ" },
    ],
  },
  {
    slug: "nakagawa",
    title: "那珂川市のエアコン・ハウスクリーニング",
    description:
      "那珂川市拠点の真ハウスクリーニング。地元エリアのエアコン洗浄・レンジフード分解洗浄・ハウスクリーニングに対応します。",
    h1: "那珂川市のエアコン・ハウスクリーニング",
    lead: "事業所所在地である那珂川市を拠点に、地域のエアコン・キッチンまわりのクリーニングに対応しています。",
    sections: [
      {
        heading: "地元だからできること",
        paragraphs: [
          "拠点が那珂川市のため、近隣での日程調整や再訪問のご相談がしやすい体制です。",
          "「中まで、きちんと。」を大切に、見えにくい内部まで丁寧に仕上げます。作業前後の状態確認も丁寧に行います。",
        ],
      },
      {
        heading: "主なメニュー",
        bullets: [
          "壁掛け・お掃除機能付き・業務用天井埋め込みエアコン洗浄",
          "レンジフード・換気扇分解洗浄",
          "浴室・トイレ・キッチンなどのハウスクリーニング",
        ],
      },
      {
        heading: "お支払い・キャンセル",
        paragraphs: [
          `お支払いは${site.legal.payment}です。キャンセル規定は特定商取引法に基づく表記をご確認ください。`,
        ],
      },
    ],
    related: [
      { href: "/about", label: "会社概要" },
      { href: "/areas/onojo", label: "大野城市の対応" },
      { href: "/services/house-cleaning", label: "ハウスクリーニング詳細" },
      { href: "/#contact", label: "お問い合わせ" },
    ],
  },
  {
    slug: "onojo",
    title: "大野城市のエアコン・ハウスクリーニング",
    description:
      "大野城市対応のエアコン洗浄・レンジフード分解洗浄。那珂川市拠点の真ハウスクリーニングが伺います。",
    h1: "大野城市のエアコン・ハウスクリーニング",
    lead: "大野城市の住宅・店舗へ、エアコン内部洗浄とレンジフード分解洗浄を中心にご訪問します。",
    sections: [
      {
        heading: "大野城市でのご利用例",
        bullets: [
          "家庭用エアコンの臭い・カビ対策",
          "キッチン換気扇の油汚れ分解洗浄",
          "複数台まとめの割引を活かした依頼",
          "浴室・トイレなど水回りとの同時依頼",
        ],
      },
      {
        heading: "料金の考え方",
        paragraphs: [
          "料金は税込で明示しています。機種や汚れ具合で内容が変わる場合は、作業前にご説明します。",
          "壁掛けエアコン（通常）は2台目以降7,000円です。台数が多いほど、まとめてのご依頼がお得になりやすいです。",
        ],
      },
      {
        heading: "お問い合わせ",
        paragraphs: [contactCta],
      },
    ],
    related: [
      { href: "/areas/kasuga", label: "春日市の対応" },
      { href: "/areas/fukuoka", label: "福岡市の対応" },
      { href: "/services/range-hood", label: "レンジフード分解洗浄詳細" },
      { href: "/#contact", label: "お問い合わせ" },
    ],
  },
];

export const servicePages: SeoPage[] = [
  {
    slug: "aircon-cleaning",
    title: "エアコンクリーニング（福岡市周辺）",
    description:
      "福岡市・春日市・那珂川市・大野城市のエアコンクリーニング。壁掛け9,000円／2台目〜7,000円。お掃除機能付き・業務用天井埋め込みにも対応。",
    h1: "エアコンクリーニング",
    lead: "吹き出し口のカビ・ホコリや嫌な臭いが気になるエアコンを、高圧洗浄で内部まで洗い上げます。福岡市周辺に対応しています。",
    sections: [
      {
        heading: "こんな症状はありませんか",
        bullets: [
          "電源を入れるとカビ臭い・酸っぱい臭いがする",
          "以前より冷え（暖まり）が弱い",
          "フィルターは掃除しているのにすぐ汚れる",
          "小さなお子さまやアレルギーが気になるご家庭",
        ],
      },
      {
        heading: "対応機種",
        bullets: [
          "壁掛けエアコン（通常）：9,000円／2台目〜7,000円（税込）",
          "お掃除機能付きエアコン：25,000円〜（税込）",
          "業務用天井埋め込み式：25,000円〜（税込）",
        ],
      },
      {
        heading: "作業の流れ",
        paragraphs: [
          "養生 → 分解 → 高圧洗浄 → 組立 → 試運転・確認、の順で進めます。所要時間は壁掛け1台あたりおおよそ60〜90分が目安です。",
          "型番シールや設置写真を事前に送っていただくと、お掃除機能の有無や追加の見通しが立てやすくなります。",
        ],
      },
      {
        heading: "対応エリア",
        paragraphs: [
          `${site.areas.join("・")}を中心に伺います。近隣もご相談ください。`,
        ],
      },
    ],
    related: [
      { href: "/areas/fukuoka", label: "福岡市のエアコン洗浄" },
      { href: "/services/range-hood", label: "レンジフード分解洗浄" },
      { href: "/#results", label: "施工前後の写真" },
      { href: "/#contact", label: "お問い合わせ" },
    ],
  },
  {
    slug: "range-hood",
    title: "レンジフード・換気扇分解洗浄（福岡市周辺）",
    description:
      "福岡市周辺のレンジフード・換気扇分解洗浄。油汚れの固まった内部まで分解洗浄。単品11,000円〜、キッチン全体18,000円〜。",
    h1: "レンジフード・換気扇分解洗浄",
    lead: "カバーを開けた内部のシロッコファンまで分解し、油汚れを洗い上げます。単品でも、キッチン全体でもご依頼いただけます。",
    sections: [
      {
        heading: "分解洗浄が向いているケース",
        bullets: [
          "フィルター掃除だけでは油が落ちない",
          "換気しても臭いが残りやすい",
          "引っ越し前後・飲食店の換気口まわり",
          "見た目だけでなく内部まで整えたい",
        ],
      },
      {
        heading: "料金の目安（税込）",
        bullets: [
          "レンジフード・換気扇分解洗浄（単品）：11,000円〜",
          "キッチン全体（レンジフード・換気扇分解洗浄を含む）：18,000円〜",
        ],
      },
      {
        heading: "所要時間と当日のお願い",
        paragraphs: [
          "目安は90〜120分です。汚れの固着や機種により前後します。",
          "コンロまわりに物が多い場合は、作業スペースを空けておいていただけると助かります。",
        ],
      },
    ],
    related: [
      { href: "/services/aircon-cleaning", label: "エアコンクリーニング" },
      { href: "/services/house-cleaning", label: "ハウスクリーニング一式" },
      { href: "/#results", label: "施工前後の写真" },
      { href: "/#contact", label: "お問い合わせ" },
    ],
  },
  {
    slug: "house-cleaning",
    title: "ハウスクリーニング一式（福岡市周辺）",
    description:
      "福岡市周辺のハウスクリーニング。エアコン・キッチン・浴室・トイレなど単品から一式まで対応。真ハウスクリーニング。",
    h1: "ハウスクリーニング一式",
    lead: "エアコンから水回り、バルコニーまで。単品でも、まとめての一式でもご依頼いただけます。",
    sections: [
      {
        heading: "メニュー例",
        bullets: [
          "エアコン（壁掛け／お掃除機能付き／業務用）",
          "キッチン全体・レンジフード分解洗浄",
          "浴室・トイレ・洗面・洗濯パン",
          "バルコニー、退去・入居前、店舗・オフィス",
        ],
      },
      {
        heading: "まとめ依頼のメリット",
        paragraphs: [
          "同日に複数メニューを組み合わせると、日程調整の手間が減り、セット割が適用される場合があります（壁掛けエアコンのみの台割とは別です）。",
          "自動見積ページで件数を選ぶと、合計の目安を確認できます。",
        ],
      },
      {
        heading: "安心のための方針",
        bullets: [
          "料金は税込表示。変更時は事前説明",
          "作業前後の状態確認",
          "養生を行い、周辺への配慮を徹底",
        ],
      },
    ],
    related: [
      { href: "/#pricing", label: "料金表" },
      { href: "/#estimate", label: "かんたん自動見積" },
      { href: "/areas/fukuoka", label: "福岡市の対応" },
      { href: "/#contact", label: "お問い合わせ" },
    ],
  },
];

export function getAreaPage(slug: string) {
  return areaPages.find((page) => page.slug === slug);
}

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}

export const areaSlugByName: Record<(typeof site.areas)[number], string> = {
  福岡市: "fukuoka",
  春日市: "kasuga",
  那珂川市: "nakagawa",
  大野城市: "onojo",
};

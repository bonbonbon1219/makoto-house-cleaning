export const site = {
  brandJa: "真ハウスクリーニング",
  brandEn: "Makoto",
  brandFull: "真（Makoto）ハウスクリーニング",
  tagline: "キッチンの換気扇から、エアコンの中まで。丁寧に、まっすぐに。",
  phone: "070-7480-0510",
  phoneTel: "07074800510",
  email: "info@makoto-hk.com",
  areas: ["福岡市", "春日市", "那珂川市", "大野城市", "太宰府市", "筑紫野市", "糸島市"],
  fukuokaWards: ["東区", "博多区", "中央区", "南区", "西区", "城南区", "早良区"] as const,
  hours: "受付 9:00–18:00（年中無休・要予約）",
  team: {
    staffCount: 4,
    greeting:
      "作業前後の状態確認と、料金の事前説明を大切にしています。代表を含むスタッフ4名が、丁寧に対応します。",
    points: [
      "エアコン・レンジフードの分解洗浄を中心に対応",
      "見えにくい内部まで丁寧に洗い上げる方針",
      "税込料金を明示し、変更時は作業前にご説明",
      "福岡市周辺を中心に、地域密着で伺います",
    ],
  },
  legal: {
    operator: "真（Makoto）ハウスクリーニング",
    representative: "大櫛　真",
    staffCount: 4,
    postalCode: "811-1254",
    address: "福岡県那珂川市道善2-45-310",
    businessHours: "9:00–18:00（年中無休・要予約）",
    priceNote: "各メニューの税込料金は料金表のとおり。内容により変動する場合は事前にご説明します。",
    payment: "現金・振込",
    delivery: "ご予約確定後、ご希望日時に訪問し作業を実施します。",
    cancel:
      "キャンセル料は、作業当日の無断キャンセルのみ予約金額の100％とします。事前のご連絡によるキャンセルは無料です。天災等やむを得ない事由の場合はご相談ください。役務提供後の返品・返金はお受けできません。",
    returns: "",
    extraFees: "特になし",
    business:
      "エアコン洗浄（壁掛け・お掃除機能付き・業務用天井埋め込み）、レンジフード・換気扇分解洗浄、浴室・トイレ・キッチン等のハウスクリーニング、飲食店などの換気口、油汚れ洗浄",
    updatedAt: "2026年10月20日",
  },
} as const;

export const legalNav = [
  { href: "/about", label: "会社概要" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/tokushoho", label: "特定商取引法に基づく表記" },
] as const;

export const featuredServices = [
  {
    id: "kitchen-fan",
    title: "レンジフード・換気扇分解洗浄",
    href: "/services/range-hood",
    lead: "油汚れの固まったレンジフードも、分解して内部まで洗い上げます。",
    points: ["レンジフード分解洗浄込みのキッチン全体も可", "換気扇・フィルター洗浄", "単品の分解洗浄にも対応"],
  },
  {
    id: "aircon",
    title: "エアコン洗浄",
    href: "/services/aircon-cleaning",
    lead: "壁掛けから業務用の天井埋め込み式まで、高圧洗浄でカビ・ホコリを除去します。",
    points: ["壁掛け 8,800円／２台目〜7,000円", "お掃除機能付き・業務用にも対応", "天井埋め込み（業務用）"],
  },
] as const;

export const allServices = [
  {
    group: "エアコン",
    items: [
      "壁掛けエアコン（通常）",
      "お掃除機能付きエアコン",
      "業務用天井埋め込み式",
      "エアコンフィルター清掃",
    ],
  },
  {
    group: "キッチン",
    items: [
      "キッチン全体（レンジフード・換気扇分解洗浄を含む）",
      "レンジフード・換気扇分解洗浄（単品）",
      "コンロまわり油汚れ除去",
    ],
  },
  {
    group: "水回り",
    items: ["浴室クリーニング", "トイレクリーニング", "洗面台まわり", "洗濯パンまわり"],
  },
  {
    group: "その他",
    items: ["バルコニー清掃", "ハウスクリーニング一式", "退去・入居前清掃", "店舗・オフィス清掃", "飲食店などの換気口・油汚れ洗浄"],
  },
] as const;

export const pricing = [
  {
    name: "壁掛けエアコン（通常）",
    price: "8,800円",
    secondary: "２台目〜7,000円",
    note: "税込",
  },
  {
    name: "お掃除機能付きエアコン",
    price: "16,500円〜",
    note: "税込",
  },
  {
    name: "業務用天井埋め込み式エアコン",
    price: "22,000円〜",
    note: "税込",
  },
  {
    name: "キッチン全体",
    price: "16,500円〜",
    secondary: "レンジフード・換気扇分解洗浄を含む",
    note: "税込",
  },
  {
    name: "レンジフード・換気扇分解洗浄",
    price: "9,900円〜",
    secondary: "単品の場合、キッチン全体は含まれません",
    note: "税込",
  },
  {
    name: "浴室クリーニング",
    price: "13,200円〜",
    note: "税込",
  },
  {
    name: "トイレクリーニング",
    price: "5,500円〜",
    note: "税込",
  },
] as const;

/** 自動見積用（税込）。壁掛けエアコン通常のみ台数料金が異なる */
export const estimateItems = [
  {
    id: "wall-ac",
    name: "壁掛けエアコン（通常）",
    unitPrice: 8800,
    pricingType: "wallAc" as const,
    hint: "1台目8,800円／2台目〜7,000円",
    group: "default" as const,
  },
  {
    id: "auto-ac",
    name: "お掃除機能付きエアコン",
    unitPrice: 16500,
    pricingType: "flat" as const,
    hint: "16,500円〜／台",
    group: "default" as const,
  },
  {
    id: "ceiling-ac",
    name: "業務用天井埋め込み式エアコン",
    unitPrice: 22000,
    pricingType: "flat" as const,
    hint: "22,000円〜／台",
    group: "default" as const,
  },
  {
    id: "kitchen",
    name: "キッチン全体",
    unitPrice: 16500,
    pricingType: "flat" as const,
    hint: "16,500円〜（レンジフード・換気扇分解洗浄を含む）",
    group: "kitchen" as const,
    role: "parent" as const,
  },
  {
    id: "range-hood",
    name: "レンジフード・換気扇分解洗浄",
    unitPrice: 9900,
    pricingType: "flat" as const,
    hint: "9,900円〜（単品の場合、キッチン全体は含まれません）",
    group: "kitchen" as const,
    role: "child" as const,
  },
  {
    id: "bath",
    name: "浴室クリーニング",
    unitPrice: 13200,
    pricingType: "flat" as const,
    hint: "13,200円〜",
    group: "default" as const,
  },
  {
    id: "toilet",
    name: "トイレクリーニング",
    unitPrice: 5500,
    pricingType: "flat" as const,
    hint: "5,500円〜",
    group: "default" as const,
  },
] as const;

export const estimateRules = {
  wallAcFirst: 8800,
  wallAcExtra: 7000,
  setDiscountTwo: 2000,
  setDiscountThreePlus: 5000,
} as const;

export function calcWallAcTotal(qty: number) {
  if (qty <= 0) return 0;
  return estimateRules.wallAcFirst + estimateRules.wallAcExtra * (qty - 1);
}

export function calcSetDiscount(totalSets: number, hasNonWallAc: boolean) {
  // 壁掛けエアコンのみの場合は台割（8,800/7,000）を適用済みのためセット割なし
  if (!hasNonWallAc) return 0;
  if (totalSets >= 3) return estimateRules.setDiscountThreePlus;
  if (totalSets >= 2) return estimateRules.setDiscountTwo;
  return 0;
}

export const beforeAfter = [
  {
    id: "aircon",
    title: "エアコン洗浄",
    caption: "吹き出し口まわりのカビ・ホコリが気になる状態のイメージ",
    before: "/before-after/aircon-before.webp",
    after: "/before-after/aircon-after.webp",
  },
  {
    id: "kitchen",
    title: "レンジフード・換気扇分解洗浄",
    caption: "カバー内のシロッコファンまで分解洗浄するイメージ",
    before: "/before-after/kitchen-before.webp",
    after: "/before-after/kitchen-after.webp",
  },
] as const;

export const flowSteps = [
  {
    step: "01",
    title: "お問い合わせ",
    text: "電話またはフォームで、ご希望のメニュー・日程をお知らせください。",
  },
  {
    step: "02",
    title: "お見積り",
    text: "機種や汚れの状態を確認し、料金をご案内します。",
  },
  {
    step: "03",
    title: "作業当日",
    text: "養生のうえ分解・洗浄。作業後は状態をご確認いただきます。",
  },
  {
    step: "04",
    title: "お支払い",
    text: "現金・振込でお支払いいただきます。",
  },
] as const;

export const faqs = [
  {
    q: "見積もりだけでも大丈夫ですか？",
    a: "はい。料金の目安はサイトの料金表と自動見積でも確認できます。機種や設置状況で変わる場合は、写真や型番をいただければ事前にご案内します。現地確認が必要なときも、事前にご相談のうえ日程を調整します。",
  },
  {
    q: "作業時間の目安は？",
    a: "壁掛けエアコン1台でおおよそ60〜90分、お掃除機能付きはさらに時間がかかる場合があります。レンジフード分解洗浄は90〜120分が目安です。台数・汚れ具合・機種で変わりますので、当日は余裕をもったスケジュールをおすすめします。",
  },
  {
    q: "在宅は必要ですか？",
    a: "原則お立ち会いをお願いしています。作業前後の確認や、家具・駐車の相談がスムーズになるためです。鍵預かりなどのご相談は個別に対応します。",
  },
  {
    q: "業務用の天井埋め込みにも対応しますか？",
    a: "はい。店舗・オフィスの天井カセット型など、業務用エアコンの洗浄にも対応しています。台数や機種が分かる写真があるとお見積りが早くなります。",
  },
  {
    q: "エアコンの嫌な臭いの原因は何ですか？",
    a: "フィルターだけでなく、内部の熱交換器や送風ファンに付いたカビ・ホコリ、結露由来の汚れが原因になることが多いです。フィルター掃除だけでは臭いが残る場合は、分解洗浄をご検討ください。",
  },
  {
    q: "お掃除機能付きかどうか、自分で分かりますか？",
    a: "本体やリモコンに「お掃除」「自動フィルター掃除」などの表示がある機種は対象になりやすいです。分からない場合は型番シールの写真を送っていただければ、こちらで確認します。",
  },
  {
    q: "作業前に準備することはありますか？",
    a: "エアコン周りやキッチン周りは、作業スペースを空けておいていただけると助かります。貴重品の移動、ペットの避難、駐車場の有無も事前にお知らせください。型番や汚れ箇所の写真があると当日がスムーズです。",
  },
  {
    q: "追加料金はいつ発生しますか？",
    a: "表示は税込の目安です。機種・汚れ具合・設置条件で内容が変わる場合は、作業前にきちんとご説明します。勝手に追加請求することはありません。",
  },
  {
    q: "マンションでも作業できますか？",
    a: "はい。ただし共用部の駐車ルールや搬入経路の制限がある場合があります。当日使える駐車場の有無、エレベーターの利用可否を事前にお知らせください。",
  },
  {
    q: "対応エリア外でもお願いできますか？",
    a: `${site.areas.join("・")}を中心に伺っています。近隣エリアも日程と距離によりご相談可能です。まずは地域名を添えてお問い合わせください。`,
  },
] as const;

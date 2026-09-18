export const site = {
  brandJa: "真ハウスクリーニング",
  brandEn: "Makoto",
  brandFull: "真（Makoto）ハウスクリーニング",
  tagline: "キッチンの換気扇から、エアコンの中まで。丁寧に、まっすぐに。",
  phone: "070-7480-0510",
  phoneTel: "07074800510",
  email: "",
  areas: ["福岡市", "春日市", "那珂川市", "大野城市"],
  hours: "受付 9:00–18:00（年中無休・要予約）",
  legal: {
    operator: "真（Makoto）ハウスクリーニング",
    representative: "大櫛　真",
    postalCode: "811-1254",
    address: "福岡県那珂川市道善2-45-310",
    businessHours: "9:00–18:00（年中無休・要予約）",
    priceNote: "各メニューの税込料金は料金表のとおり。内容により変動する場合は事前にご説明します。",
    payment: "現金・振込",
    delivery: "ご予約確定後、ご希望日時に訪問し作業を実施します。",
    cancel: "キャンセルの規定なし。",
    returns: "",
    extraFees: "特になし",
    business:
      "エアコン洗浄（壁掛け・お掃除機能付き・業務用天井埋め込み）、レンジフード・換気扇分解洗浄、浴室・トイレ・キッチン等のハウスクリーニング、飲食店などの換気口、油汚れ洗浄",
    updatedAt: "2026年9月18日",
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
    lead: "油汚れの固まったレンジフードも、分解して内部まで洗い上げます。",
    points: ["レンジフード分解洗浄込みのキッチン全体も可", "換気扇・フィルター洗浄", "単品の分解洗浄にも対応"],
  },
  {
    id: "aircon",
    title: "エアコン洗浄",
    lead: "壁掛けから業務用の天井埋め込み式まで、高圧洗浄でカビ・ホコリを除去します。",
    points: ["壁掛け 9,000円／２台目〜7,000円", "お掃除機能付き・業務用にも対応", "天井埋め込み（業務用）"],
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
    price: "9,000円",
    secondary: "２台目〜7,000円",
    note: "税込",
  },
  {
    name: "お掃除機能付きエアコン",
    price: "25,000円〜",
    note: "税込",
  },
  {
    name: "業務用天井埋め込み式エアコン",
    price: "25,000円〜",
    note: "税込",
  },
  {
    name: "キッチン全体",
    price: "18,000円〜",
    secondary: "レンジフード・換気扇分解洗浄を含む",
    note: "税込",
  },
  {
    name: "レンジフード・換気扇分解洗浄",
    price: "11,000円〜",
    secondary: "単品の場合、キッチン全体は含まれません",
    note: "税込",
  },
  {
    name: "浴室クリーニング",
    price: "14,500円〜",
    note: "税込",
  },
  {
    name: "トイレクリーニング",
    price: "6,000円〜",
    note: "税込",
  },
] as const;

/** 自動見積用（税込）。壁掛けエアコン通常のみ台数料金が異なる */
export const estimateItems = [
  {
    id: "wall-ac",
    name: "壁掛けエアコン（通常）",
    unitPrice: 9000,
    pricingType: "wallAc" as const,
    hint: "1台目9,000円／2台目〜7,000円",
    group: "default" as const,
  },
  {
    id: "auto-ac",
    name: "お掃除機能付きエアコン",
    unitPrice: 25000,
    pricingType: "flat" as const,
    hint: "25,000円〜／台",
    group: "default" as const,
  },
  {
    id: "ceiling-ac",
    name: "業務用天井埋め込み式エアコン",
    unitPrice: 25000,
    pricingType: "flat" as const,
    hint: "25,000円〜／台",
    group: "default" as const,
  },
  {
    id: "kitchen",
    name: "キッチン全体",
    unitPrice: 18000,
    pricingType: "flat" as const,
    hint: "18,000円〜（レンジフード・換気扇分解洗浄を含む）",
    group: "kitchen" as const,
    role: "parent" as const,
  },
  {
    id: "range-hood",
    name: "レンジフード・換気扇分解洗浄",
    unitPrice: 11000,
    pricingType: "flat" as const,
    hint: "11,000円〜（単品の場合、キッチン全体は含まれません）",
    group: "kitchen" as const,
    role: "child" as const,
  },
  {
    id: "bath",
    name: "浴室クリーニング",
    unitPrice: 14500,
    pricingType: "flat" as const,
    hint: "14,500円〜",
    group: "default" as const,
  },
  {
    id: "toilet",
    name: "トイレクリーニング",
    unitPrice: 6000,
    pricingType: "flat" as const,
    hint: "6,000円〜",
    group: "default" as const,
  },
] as const;

export const estimateRules = {
  wallAcFirst: 9000,
  wallAcExtra: 7000,
  setDiscountTwo: 2000,
  setDiscountThreePlus: 5000,
} as const;

export function calcWallAcTotal(qty: number) {
  if (qty <= 0) return 0;
  return estimateRules.wallAcFirst + estimateRules.wallAcExtra * (qty - 1);
}

export function calcSetDiscount(totalSets: number, hasNonWallAc: boolean) {
  // 壁掛けエアコンのみの場合は台割（9,000/7,000）を適用済みのためセット割なし
  if (!hasNonWallAc) return 0;
  if (totalSets >= 3) return estimateRules.setDiscountThreePlus;
  if (totalSets >= 2) return estimateRules.setDiscountTwo;
  return 0;
}

export const beforeAfter = [
  {
    id: "aircon",
    title: "エアコン洗浄",
    caption: "吹き出し口まわりのカビ・ホコリを、同じアングルで比較",
    before: "/before-after/aircon-before.jpg",
    after: "/before-after/aircon-after.jpg",
  },
  {
    id: "kitchen",
    title: "レンジフード・換気扇分解洗浄",
    caption: "カバーを開けた内部のシロッコファンを、分解洗浄前後で比較",
    before: "/before-after/kitchen-before.jpg",
    after: "/before-after/kitchen-after.jpg",
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
    a: "はい。現地確認が必要な場合は、事前にご相談のうえ日程を調整します。",
  },
  {
    q: "作業時間の目安は？",
    a: "壁掛けエアコン1台でおおよそ60〜90分、レンジフード分解洗浄は90〜120分が目安です。台数・汚れ具合で変わります。",
  },
  {
    q: "在宅は必要ですか？",
    a: "原則お立ち会いをお願いしています。鍵預かりなどのご相談は個別に対応します。",
  },
  {
    q: "業務用の天井埋め込みにも対応しますか？",
    a: "はい。店舗・オフィスの天井カセット型など、業務用エアコンの洗浄にも対応しています。",
  },
] as const;

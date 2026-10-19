import { site } from "@/lib/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.brandFull,
    alternateName: [site.brandEn, site.brandJa],
    description:
      "福岡市を中心に、春日市・那珂川市・大野城市対応のエアコン洗浄・レンジフード分解洗浄・ハウスクリーニング",
    telephone: site.phone,
    ...(site.email ? { email: site.email } : {}),
    url: "https://makoto-hk.com/",
    image: "https://makoto-hk.com/brand/makoto-logo.png",
    areaServed: site.areas.map((name) => ({
      "@type": "City",
      name,
    })),
    address: {
      "@type": "PostalAddress",
      postalCode: site.legal.postalCode,
      addressRegion: "福岡県",
      addressLocality: "那珂川市",
      streetAddress: "道善2-45-310",
      addressCountry: "JP",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "¥¥",
    knowsAbout: [
      "エアコンクリーニング",
      "レンジフード分解洗浄",
      "ハウスクリーニング",
      "福岡市",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "クリーニングメニュー",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "壁掛けエアコン洗浄（通常）",
            url: "https://makoto-hk.com/services/aircon-cleaning",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "レンジフード・換気扇分解洗浄",
            url: "https://makoto-hk.com/services/range-hood",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "ハウスクリーニング一式",
            url: "https://makoto-hk.com/services/house-cleaning",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

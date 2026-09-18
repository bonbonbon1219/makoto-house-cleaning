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
    url: "https://makoto-cleaning.example/",
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
    openingHours: "Mo-Su 09:00-18:00",
    priceRange: "¥¥",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

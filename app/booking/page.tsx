import type { Metadata } from "next";
import Link from "next/link";
import { Booking } from "@/components/Booking";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "オンライン予約",
  description: `${site.brandJa}のオンライン予約。福岡市周辺のエアコン・ハウスクリーニングの空き（〇△×）を確認して希望日を仮予約できます。`,
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: `オンライン予約｜${site.brandJa}`,
    description: "空きカレンダーから希望日を選んで仮予約。店舗確認後に本予約が確定します。時間帯は別途調整します。",
    type: "website",
  },
};

export default function BookingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", path: "/" },
          { name: "オンライン予約" },
        ]}
      />
      <div className="container" style={{ paddingTop: "1.25rem", fontSize: "0.9rem" }}>
        <nav aria-label="パンくず">
          <Link href="/">ホーム</Link>
          <span aria-hidden="true"> / </span>
          <span>オンライン予約</span>
        </nav>
      </div>
      <Booking />
    </>
  );
}

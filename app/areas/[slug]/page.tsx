import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FukuokaArea } from "@/components/FukuokaArea";
import { RichPage } from "@/components/RichPage";
import { areaPages, areaSlugByName, getAreaPage } from "@/lib/seoContent";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return areaPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAreaPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/areas/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
    },
  };
}

export default async function AreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getAreaPage(slug);
  if (!page) notFound();

  if (slug === "fukuoka") return <FukuokaArea />;

  const city = Object.entries(areaSlugByName).find(([, value]) => value === slug)?.[0];
  return <RichPage page={page} parent={{ href: "/areas", label: "対応エリア" }} kicker={city ? `${city}対応` : "対応エリア"} />;
}

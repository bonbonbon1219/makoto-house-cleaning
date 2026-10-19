import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoArticle } from "@/components/SeoArticle";
import { getServicePage, servicePages } from "@/lib/seoContent";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  return <SeoArticle page={page} parent={{ href: "/services", label: "サービス一覧" }} />;
}

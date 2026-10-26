import type { MetadataRoute } from "next";
import { areaPages, servicePages } from "@/lib/seoContent";

const base = "https://makoto-hk.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-20");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/areas`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/booking`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/business`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/tokushoho`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceEntries = servicePages.map((page) => ({
    url: `${base}/services/${page.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const areaEntries = areaPages.map((page) => ({
    url: `${base}/areas/${page.slug}`,
    lastModified: page.slug === "fukuoka" ? new Date("2026-10-26") : lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...serviceEntries, ...areaEntries];
}

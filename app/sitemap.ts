import type { MetadataRoute } from "next";

const base = "https://makoto-cleaning.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-18");

  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/tokushoho`, lastModified, changeFrequency: "yearly", priority: 0.4 },
  ];
}

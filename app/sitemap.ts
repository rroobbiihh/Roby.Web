import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://robydevera.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/portfolio`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ...projects.map((p) => ({
      url: `${siteUrl}/portfolio/${p.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

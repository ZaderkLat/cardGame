import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["es", "en"];

  return locales.map((locale) => ({
    url: new URL(`/${locale}`, baseUrl).toString(),
    lastModified: new Date(),
    changefreq: "weekly",
    priority: locale === "es" ? 1 : 0.9,
    alternates: {
      languages: {
        es: new URL("/es", baseUrl).toString(),
        en: new URL("/en", baseUrl).toString(),
      },
    },
  }));
}

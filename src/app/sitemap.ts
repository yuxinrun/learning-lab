import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { categories, siteConfig } from "@/lib/site";
import { methods } from "@/content/data/methods";
import { books } from "@/content/data/books";
import { resources } from "@/content/data/resources";
import { learningPaths } from "@/content/data/paths";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticPaths = [
    "", "/books", "/resources",
    "/tools", "/tools/study-tracker", "/tools/spaced-repetition", "/tools/active-recall",
    "/tools/reading-tracker", "/tools/learning-goals", "/tools/knowledge-cards",
    "/tools/focus-timer", "/tools/weekly-review", "/learning-paths", "/visualizations",
    "/search", "/about", "/editorial-policy", "/sources", "/privacy", "/contact",
  ].map((path) => ({ url: `${base}${path}`, lastModified: now, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }));

  const articles = getAllArticles().map((a) => ({
    url: `${base}/${a.category}/${a.slug}`,
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const methodsUrls = methods.map((m) => ({ url: `${base}/learning-methods/${m.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));
  const bookUrls = books.map((b) => ({ url: `${base}/books/${b.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  const resourceUrls = resources.map((r) => ({ url: `${base}/resources/${r.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  const pathUrls = learningPaths.map((p) => ({ url: `${base}/learning-paths/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));
  const categoryUrls = categories.map((c) => ({ url: `${base}/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 }));

  return [...staticPaths, ...categoryUrls, ...articles, ...methodsUrls, ...bookUrls, ...resourceUrls, ...pathUrls];
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article, CategorySlug } from "./types";
import { readingTime, slugify } from "./utils";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface TocEntry {
  depth: number;
  text: string;
  id: string;
}

function headingsFromMarkdown(content: string): TocEntry[] {
  const lines = content.split("\n");
  const out: TocEntry[] = [];
  let inCode = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) {
      const text = m[2].replace(/[*_`]/g, "");
      out.push({ depth: m[1].length, text, id: slugify(text) });
    }
  }
  return out;
}

function loadArticle(filename: string): Article {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: filename.replace(/\.mdx?$/, ""),
    title: String(data.title ?? "Untitled"),
    englishTitle: data.englishTitle ? String(data.englishTitle) : undefined,
    description: String(data.description ?? ""),
    category: (data.category ?? "learning-science") as CategorySlug,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author: String(data.author ?? "Learning Lab Editorial"),
    date: String(data.date ?? "2026-01-01"),
    updated: data.updated ? String(data.updated) : undefined,
    featured: Boolean(data.featured),
    order: Number(data.order ?? 100),
    evidence: data.evidence,
    diagram: data.diagram ? String(data.diagram) : undefined,
    readingTime: readingTime(content),
    content,
    toc: headingsFromMarkdown(content),
  };
}

let cache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (cache) return cache;
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  cache = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(loadArticle)
    .sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : a.order - b.order);
  return cache;
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: CategorySlug): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getFeaturedArticles(limit = 6): Article[] {
  const featured = getAllArticles().filter((a) => a.featured);
  return (featured.length ? featured : getAllArticles()).slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({
      article: a,
      score:
        (a.category === article.category ? 2 : 0) +
        a.tags.filter((t) => article.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.article);
}

export function getAdjacentArticles(article: Article): { prev?: Article; next?: Article } {
  const list = getAllArticles().filter((a) => a.category === article.category);
  const i = list.findIndex((a) => a.slug === article.slug);
  return { prev: list[i - 1], next: list[i + 1] };
}

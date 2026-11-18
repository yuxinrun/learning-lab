import { getAllArticles } from "./content";
import { books } from "@/content/data/books";
import { resources } from "@/content/data/resources";
import { methods } from "@/content/data/methods";
import { learningPaths } from "@/content/data/paths";
import { toolsList } from "./site";
import type { SearchItem } from "./types";

export function getAllSearchItems(): SearchItem[] {
  const articleItems: SearchItem[] = getAllArticles().map((a) => ({
    type: "article",
    title: a.title,
    subtitle: a.description,
    href: `/${a.category}/${a.slug}`,
    keywords: `${a.englishTitle ?? ""} ${a.tags.join(" ")} ${a.description}`,
    category: a.category,
    tags: a.tags,
  }));

  const bookItems: SearchItem[] = books.map((b) => ({
    type: "book",
    title: b.title,
    subtitle: b.authors.join(", "),
    href: `/books/${b.slug}`,
    keywords: `${b.originalTitle ?? ""} ${b.category} ${b.concepts.join(" ")} ${b.description}`,
    category: b.category,
    tags: b.concepts,
  }));

  const resourceItems: SearchItem[] = resources.map((r) => ({
    type: "resource",
    title: r.name,
    subtitle: r.description,
    href: `/resources/${r.slug}`,
    keywords: `${r.type} ${r.region} ${r.fields.join(" ")}`,
    category: r.type,
    tags: r.fields,
  }));

  const methodItems: SearchItem[] = methods.map((m) => ({
    type: "method",
    title: `${m.name} · ${m.chineseName}`,
    subtitle: m.tagline,
    href: `/learning-methods/${m.slug}`,
    keywords: `${m.name} ${m.chineseName} ${m.principle} ${m.scenarios.join(" ")}`,
    category: "learning-methods",
    tags: m.scenarios,
  }));

  const pathItems: SearchItem[] = learningPaths.map((p) => ({
    type: "path",
    title: p.title,
    subtitle: p.description,
    href: `/learning-paths/${p.slug}`,
    keywords: `${p.englishTitle} ${p.goal} ${p.description}`,
    category: "learning-path",
  }));

  const toolItems: SearchItem[] = toolsList.map((t) => ({
    type: "tool",
    title: t.label,
    subtitle: t.description ?? "",
    href: t.href,
    keywords: `${t.label} ${t.description ?? ""} tool 工具`,
    category: "tool",
  }));

  return [...articleItems, ...methodItems, ...bookItems, ...resourceItems, ...pathItems, ...toolItems];
}

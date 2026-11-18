import type { SearchItem } from "./types";

export function filterSearchItems(items: SearchItem[], query: string, type?: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  const filtered = type && type !== "all" ? items.filter((i) => i.type === type) : items;
  if (!q) return filtered.slice(0, 24);
  return filtered
    .map((item) => {
      const title = item.title.toLowerCase();
      const hay = `${title} ${item.subtitle} ${item.keywords}`.toLowerCase();
      let score = 0;
      if (title.includes(q)) score += 6;
      if (item.subtitle.toLowerCase().includes(q)) score += 2;
      if (hay.includes(q)) score += 1;
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map((x) => x.item);
}

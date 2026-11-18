"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Compass, FlaskConical, Library, Route, Search, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { filterSearchItems } from "@/lib/search-filter";
import type { SearchItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeMeta: Record<string, { label: string; icon: typeof Search }> = {
  article: { label: "文章", icon: BookOpen },
  method: { label: "方法", icon: FlaskConical },
  book: { label: "书籍", icon: Library },
  resource: { label: "资源", icon: Compass },
  path: { label: "路径", icon: Route },
  tool: { label: "工具", icon: Wrench },
};

const filters = [
  { value: "all", label: "全部" },
  { value: "article", label: "文章" },
  { value: "method", label: "方法" },
  { value: "book", label: "书籍" },
  { value: "resource", label: "资源" },
  { value: "path", label: "路径" },
  { value: "tool", label: "工具" },
];

export function SearchClient({ items, initialQuery }: { items: SearchItem[]; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("all");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  const results = useMemo(() => filterSearchItems(items, query, type), [items, query, type]);

  return (
    <div>
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索文章、概念、方法、书籍、资源或工具" className="h-14 pl-12 text-base" autoFocus />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setType(f.value)} className={cn("rounded-full px-3 py-1.5 text-xs transition-colors", type === f.value ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground")}>
            {f.label}
          </button>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">{query ? `“${query}” 的搜索结果：${results.length} 条` : `浏览全部 ${results.length} 条内容`}</p>
      {results.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border py-20 text-center text-sm text-muted-foreground">没有找到匹配内容，换一个关键词试试。</div>
      ) : (
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {results.map((item) => {
            const meta = typeMeta[item.type] ?? typeMeta.article;
            const Icon = meta.icon;
            return (
              <li key={`${item.type}-${item.href}`}>
                <Link href={item.href} className="group flex items-start gap-4 py-5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface text-primary"><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-lg font-semibold group-hover:text-primary">{item.title}</span>
                    <span className="mt-1 block line-clamp-2 text-sm text-muted-foreground">{item.subtitle}</span>
                  </span>
                  <Badge variant="outline" className="shrink-0">{meta.label}</Badge>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

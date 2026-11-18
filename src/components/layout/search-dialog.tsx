"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Compass, FlaskConical, LayoutGrid, Library, Route, Search, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export function SearchDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = useMemo(() => filterSearchItems(items, query, type), [items, query, type]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-ring"
        aria-label="搜索全站内容"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">搜索</span>
        <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] md:inline">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="border-b border-border px-6 pb-4 pt-6">
            <DialogTitle>搜索 Learning Lab</DialogTitle>
            <DialogDescription>搜索文章、概念、方法、书籍、资源、路径与工具。</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-3">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例如：间隔重复、工作记忆、Zettelkasten…"
              className="h-11 text-base"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                { value: "all", label: "全部" },
                { value: "article", label: "文章" },
                { value: "method", label: "方法" },
                { value: "book", label: "书籍" },
                { value: "resource", label: "资源" },
                { value: "path", label: "路径" },
                { value: "tool", label: "工具" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs transition-colors",
                    type === t.value ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[52vh] overflow-y-auto border-t border-border px-3 py-3">
            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <LayoutGrid className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">没有找到匹配内容，换一个关键词试试。</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {results.map((item) => {
                  const meta = typeMeta[item.type] ?? typeMeta.article;
                  const Icon = meta.icon;
                  return (
                    <li key={`${item.type}-${item.href}`}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-surface"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {meta.label}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="border-t border-border px-6 py-3 text-[11px] text-muted-foreground">
            输入关键词即时筛选 · 按 ⌘K 或 Ctrl+K 打开与关闭
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { books } from "@/content/data/books";
import { cn } from "@/lib/utils";

const categories = ["全部", ...Array.from(new Set(books.map((b) => b.category)))];

export function BooksGrid() {
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const inCategory = category === "全部" || b.category === category;
      const q = query.trim().toLowerCase();
      const match = !q || `${b.title} ${b.authors.join(" ")} ${b.concepts.join(" ")} ${b.description}`.toLowerCase().includes(q);
      return inCategory && match;
    });
  }, [category, query]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors",
                category === c ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索书名或作者" className="pl-9" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-20 text-center text-sm text-muted-foreground">没有匹配的书籍。</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((book) => (
            <Link key={book.slug} href={`/books/${book.slug}`} className="group flex flex-col">
              <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-md p-5 shadow-soft transition-transform group-hover:-translate-y-1" style={{ backgroundColor: book.accent }}>
                <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/30" />
                <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full border border-white/20" />
                <span className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">Learning Lab · Books</span>
                <div className="relative">
                  <h3 className="font-serif text-[22px] font-semibold leading-tight text-white">{book.title}</h3>
                  <p className="mt-2 text-xs text-white/85">{book.authors[0]}</p>
                </div>
              </div>
              <p className="mt-4 text-[13px] text-muted-foreground">{book.category}</p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground/90">{book.description}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

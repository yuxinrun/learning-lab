"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { resources } from "@/content/data/resources";
import { cn } from "@/lib/utils";

const types = ["全部", ...Array.from(new Set(resources.map((r) => r.type)))];

export function ResourcesGrid() {
  const [type, setType] = useState("全部");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const inType = type === "全部" || r.type === type;
      const q = query.trim().toLowerCase();
      const match = !q || `${r.name} ${r.description} ${r.fields.join(" ")} ${r.region ?? ""}`.toLowerCase().includes(q);
      return inType && match;
    });
  }, [type, query]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-colors",
                type === t ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索机构或领域" className="pl-9" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-20 text-center text-sm text-muted-foreground">没有匹配的资源。</p>
      ) : (
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link key={r.slug} href={`/resources/${r.slug}`} className="group flex flex-col bg-card p-6 transition-colors hover:bg-surface/70">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-md text-[11px] font-semibold text-white" style={{ backgroundColor: r.accent }}>{r.initials}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold group-hover:text-primary">{r.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{r.type} · {r.region}</p>
              <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">{r.description}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {r.fields.map((f) => <span key={f} className="rounded bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">{f}</span>)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

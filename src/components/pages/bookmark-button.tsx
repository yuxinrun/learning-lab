"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/storage";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export function BookmarkButton({ slug }: { slug: string }) {
  const { value, setValue, hydrated } = useLocalStorage<string[]>(STORAGE_KEYS.bookmarks, []);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(value.includes(slug));
  }, [value, slug]);

  if (!hydrated) return null;

  return (
    <button
      onClick={() => setValue((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-medium transition-colors",
        active ? "border-primary bg-primary-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      <Bookmark className={cn("h-3.5 w-3.5", active && "fill-primary text-primary")} />
      {active ? "已收藏" : "收藏"}
    </button>
  );
}

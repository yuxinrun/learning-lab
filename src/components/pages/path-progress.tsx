"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export function PathProgress({ pathSlug, tasks }: { pathSlug: string; tasks: string[] }) {
  const key = `ll:path-progress:${pathSlug}`;
  const { value, setValue, hydrated } = useLocalStorage<string[]>(key, []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const done = value.length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  if (!hydrated || !mounted) return <div className="h-24 animate-pulse rounded-md bg-surface" />;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="section-label mb-1">实践任务进度</p>
          <p className="text-sm text-muted-foreground">保存在此浏览器本地</p>
        </div>
        <span className="font-serif text-3xl font-semibold text-primary">{percent}%</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <ul className="mt-6 space-y-3">
        {tasks.map((task) => {
          const checked = value.includes(task);
          return (
            <li key={task}>
              <button
                onClick={() => setValue((prev) => (checked ? prev.filter((t) => t !== task) : [...prev, task]))}
                className={cn("flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors", checked ? "border-primary/40 bg-primary-soft/40" : "border-border hover:bg-surface")}
              >
                <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border", checked ? "border-primary bg-primary text-primary-foreground" : "border-input")}>
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span className={cn("leading-relaxed", checked ? "text-muted-foreground line-through" : "text-foreground/85")}>{task}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

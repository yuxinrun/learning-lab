import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categoryMap } from "@/lib/site";
import type { Article } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const coverTones: Record<string, string> = {
  "learning-science": "from-primary-soft to-surface",
  memory: "from-mist to-surface",
  attention: "from-olive to-surface",
  "learning-methods": "from-sand to-surface",
  reading: "from-surface-2 to-surface",
  thinking: "from-mist to-card",
  "knowledge-management": "from-olive to-card",
  "lifelong-learning": "from-sand to-card",
};

export function ArticleCover({ category, className }: { category: string; className?: string }) {
  const shapes = [
    <circle key="a" cx="82" cy="30" r="26" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />,
    <circle key="b" cx="60" cy="62" r="42" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.22" />,
    <path key="c" d="M10 78 L48 40 L88 78" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />,
  ];
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br text-primary",
        coverTones[category] ?? coverTones["learning-science"],
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 90" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {shapes}
        <line x1="12" y1="12" x2="45" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <line x1="88" y1="18" x2="60" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <circle cx="45" cy="48" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="60" cy="52" r="2" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}

export function ArticleCard({
  article,
  variant = "default",
  className,
}: {
  article: Article;
  variant?: "default" | "compact" | "feature";
  className?: string;
}) {
  const cat = categoryMap[article.category];
  const href = `/${article.category}/${article.slug}`;

  if (variant === "compact") {
    return (
      <Link href={href} className={cn("group flex gap-4 py-4", className)}>
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-primary">{cat?.title}</p>
          <h3 className="line-clamp-2 font-serif text-[17px] font-semibold leading-snug transition-colors group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatDate(article.date)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.readingTime} 分钟
            </span>
          </p>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    );
  }

  return (
    <Link href={href} className={cn("group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lift", className)}>
      <ArticleCover category={article.category} className={cn("w-full", variant === "feature" ? "h-56" : "h-40")} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="soft">{cat?.title}</Badge>
          {article.evidence === "well-supported" && <Badge variant="outline">证据较充分</Badge>}
        </div>
        <h3 className={cn("font-serif font-semibold leading-snug transition-colors group-hover:text-primary", variant === "feature" ? "text-2xl" : "text-[19px]")}>
          {article.title}
        </h3>
        {article.englishTitle && <p className="mt-1 text-xs italic text-muted-foreground">{article.englishTitle}</p>}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-muted-foreground">
          <span>{formatDate(article.date)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readingTime} 分钟
          </span>
        </div>
      </div>
    </Link>
  );
}

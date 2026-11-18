import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, PencilLine } from "lucide-react";
import { ArticleBody } from "@/components/articles/article-body";
import { ArticleCard } from "@/components/articles/article-card";
import { BookmarkButton } from "./bookmark-button";
import { Badge } from "@/components/ui/badge";
import { getAdjacentArticles, getRelatedArticles } from "@/lib/content";
import { categoryMap } from "@/lib/site";
import type { Article, EvidenceLevel } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { books } from "@/content/data/books";

const evidenceLabel: Record<EvidenceLevel, string> = {
  "well-supported": "证据较充分",
  emerging: "证据仍在发展",
  debated: "存在争议",
};

const categoryBooks: Record<string, string[]> = {
  "learning-science": ["understanding-how-we-learn", "make-it-stick"],
  memory: ["moonwalking-with-einstein", "the-organized-mind"],
  attention: ["the-organized-mind"],
  "learning-methods": ["make-it-stick", "powerful-teaching"],
  reading: ["how-to-read-a-book"],
  thinking: ["thinking-fast-and-slow", "superforecasting"],
  "knowledge-management": ["building-a-second-brain", "how-to-take-smart-notes"],
  "lifelong-learning": ["small-teaching"],
};

export function ArticleDetail({ article }: { article: Article }) {
  const category = categoryMap[article.category];
  const related = getRelatedArticles(article);
  const { prev, next } = getAdjacentArticles(article);
  const refs = (categoryBooks[article.category] ?? [])
    .map((s) => books.find((b) => b.slug === s))
    .filter((b): b is (typeof books)[number] => Boolean(b));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "Learning Lab" },
    inLanguage: "zh-CN",
    keywords: article.tags.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="border-b border-border bg-surface/40">
        <div className="container py-12 md:py-16">
          <nav aria-label="面包屑" className="mb-7 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href={`/${article.category}`} className="hover:text-primary">{category?.title}</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/${article.category}`}>
              <Badge>{category?.title}</Badge>
            </Link>
            {article.evidence && <Badge variant="outline">{evidenceLabel[article.evidence]}</Badge>}
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-[38px] font-semibold leading-[1.18] tracking-tight md:text-[52px]">
            {article.title}
          </h1>
          {article.englishTitle && (
            <p className="mt-3 font-serif text-lg italic text-muted-foreground">{article.englishTitle}</p>
          )}
          <p className="mt-6 max-w-3xl text-[17px] leading-[1.85] text-muted-foreground">{article.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-1.5"><PencilLine className="h-3.5 w-3.5" />{article.author}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />发布于 {formatDate(article.date)}</span>
              {article.updated && <span>更新于 {formatDate(article.updated)}</span>}
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />约 {article.readingTime} 分钟</span>
            </div>
            <BookmarkButton slug={article.slug} />
          </div>
        </div>
      </div>

      <div className="container grid gap-12 py-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-16">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="section-label mb-4">本文目录</p>
            {article.toc.length ? (
              <nav aria-label="文章目录">
                <ul className="space-y-2.5 border-l border-border">
                  {article.toc.map((h) => (
                    <li key={h.id} className={h.depth === 3 ? "pl-6" : "pl-4"}>
                      <a href={`#${h.id}`} className={`block text-[13px] leading-snug transition-colors hover:text-primary ${h.depth === 3 ? "text-muted-foreground" : "text-foreground/80"}`}>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <p className="text-xs text-muted-foreground">本文较短，无分节目录。</p>
            )}
            <div className="mt-8 border-t border-border pt-5">
              <p className="section-label mb-3">标签</p>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((t) => <Badge key={t} variant="muted">{t}</Badge>)}
              </div>
            </div>
          </div>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <ArticleBody content={article.content} />

          {refs.length > 0 && (
            <section className="mt-14 rounded-lg border border-border bg-surface/50 p-6">
              <h2 className="font-serif text-xl font-semibold">参考书籍</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {refs.map((b) => (
                  <Link key={b.slug} href={`/books/${b.slug}`} className="group rounded-md border border-border bg-card p-4">
                    <p className="font-serif text-sm font-semibold group-hover:text-primary">{b.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{b.authors.join(", ")}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6 lg:hidden">
            {article.tags.map((t) => <Badge key={t} variant="muted">{t}</Badge>)}
          </div>

          {(prev || next) && (
            <nav className="mt-12 grid gap-3 border-t border-border pt-8 sm:grid-cols-2" aria-label="上一篇下一篇">
              {prev ? (
                <Link href={`/${prev.category}/${prev.slug}`} className="group rounded-md border border-border p-4 transition-colors hover:bg-surface">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="h-3 w-3" />上一篇</span>
                  <span className="mt-2 block font-serif text-sm font-medium group-hover:text-primary">{prev.title}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link href={`/${next.category}/${next.slug}`} className="group rounded-md border border-border p-4 text-right transition-colors hover:bg-surface">
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">下一篇<ArrowRight className="h-3 w-3" /></span>
                  <span className="mt-2 block font-serif text-sm font-medium group-hover:text-primary">{next.title}</span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-surface/40">
          <div className="container py-16">
            <h2 className="mb-8 font-serif text-2xl font-semibold">相关内容</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

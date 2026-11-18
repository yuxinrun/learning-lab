import Link from "next/link";
import { ArrowUpRight, BookOpen, Layers3 } from "lucide-react";
import { PageHeader } from "./page-header";
import { EmptyState } from "./empty-state";
import { ArticleCard } from "@/components/articles/article-card";
import { CategoryIcon } from "@/components/category-icon";
import { SectionHeading } from "@/components/layout/section-heading";
import { ScienceDiagram } from "@/components/diagrams/science-diagrams";
import { getArticlesByCategory } from "@/lib/content";
import { categoryMap } from "@/lib/site";
import { methods } from "@/content/data/methods";
import { books } from "@/content/data/books";
import type { CategorySlug } from "@/lib/types";

const categoryDiagram: Record<CategorySlug, string> = {
  "learning-science": "memory-processing",
  memory: "forgetting-retrieval",
  attention: "cognitive-load",
  "learning-methods": "active-recall-flow",
  reading: "reading-comprehension",
  thinking: "metacognition-cycle",
  "knowledge-management": "knowledge-network",
  "lifelong-learning": "feedback-loop",
};

const categoryBooks: Record<CategorySlug, string[]> = {
  "learning-science": ["understanding-how-we-learn", "make-it-stick", "how-learning-works"],
  memory: ["moonwalking-with-einstein", "the-organized-mind", "the-memory-book"],
  attention: ["the-organized-mind", "thinking-fast-and-slow"],
  "learning-methods": ["make-it-stick", "powerful-teaching", "small-teaching"],
  reading: ["how-to-read-a-book", "how-to-take-smart-notes"],
  thinking: ["thinking-fast-and-slow", "superforecasting", "the-scout-mindset"],
  "knowledge-management": ["building-a-second-brain", "how-to-take-smart-notes", "the-para-method"],
  "lifelong-learning": ["building-a-second-brain", "small-teaching"],
};

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = categoryMap[slug];
  const articles = getArticlesByCategory(slug);
  const [lead, ...rest] = articles;
  const relatedMethods = methods.filter((m) =>
    m.relatedArticles.some((r) => articles.some((a) => a.slug === r)),
  );
  const relatedBooks = (categoryBooks[slug] ?? [])
    .map((s) => books.find((b) => b.slug === s))
    .filter((b): b is (typeof books)[number] => Boolean(b));

  return (
    <>
      <PageHeader
        eyebrow={category.englishTitle}
        title={category.title}
        englishTitle={category.englishTitle}
        description={category.description}
        crumbs={[{ label: category.title }]}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {category.keywords.map((k) => (
            <span key={k} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              {k}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="container py-14 md:py-20">
        {articles.length === 0 ? (
          <EmptyState title="这个主题还在整理中" description="我们会持续补充基于证据的内容。" />
        ) : (
          <>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <ArticleCard article={lead} variant="feature" />
              <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-6">
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-soft text-primary">
                    <CategoryIcon name={category.icon} className="h-5 w-5" />
                  </span>
                  <h2 className="mt-6 font-serif text-2xl font-semibold">从整体到细节</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {category.description}本页收录 {articles.length} 篇文章，按主题组织，建议从精选文章开始。
                  </p>
                </div>
                <div className="mt-8 rounded-md border border-border bg-background/60 p-3">
                  <ScienceDiagram name={categoryDiagram[slug]} />
                </div>
              </div>
            </div>

            <div className="mt-16">
              <SectionHeading eyebrow="Articles" title="全部文章" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => <ArticleCard key={a.slug} article={a} />)}
              </div>
            </div>

            {relatedMethods.length > 0 && (
              <div className="mt-20">
                <SectionHeading eyebrow="Methods" title="相关学习方法" href="/learning-methods" linkLabel="全部方法" />
                <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                  {relatedMethods.slice(0, 6).map((m) => (
                    <Link key={m.slug} href={`/learning-methods/${m.slug}`} className="group bg-card p-5 transition-colors hover:bg-surface/70">
                      <Layers3 className="h-4 w-4 text-primary" />
                      <h3 className="mt-4 font-serif text-lg font-semibold group-hover:text-primary">{m.chineseName}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{m.tagline}</p>
                      <ArrowUpRight className="ml-auto mt-4 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedBooks.length > 0 && (
              <div className="mt-20">
                <SectionHeading eyebrow="Further Reading" title="延伸阅读" href="/books" linkLabel="书籍库" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {relatedBooks.map((b) => (
                    <Link key={b.slug} href={`/books/${b.slug}`} className="group flex gap-4 rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-soft">
                      <BookOpen className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h3 className="font-serif text-base font-semibold group-hover:text-primary">{b.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{b.authors.join(", ")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

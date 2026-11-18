import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BookOpen, ExternalLink, Lightbulb, Users } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";
import { Badge } from "@/components/ui/badge";
import { books, getBook } from "@/content/data/books";

export const dynamicParams = false;

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return {
    title: `${book.title} — ${book.authors.join(", ")}`,
    description: book.description,
    alternates: { canonical: `/books/${slug}` },
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const related = book.related.map(getBook).filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <>
      <PageHeader
        eyebrow={book.category}
        title={book.title}
        englishTitle={book.originalTitle}
        description={book.description}
        crumbs={[{ label: "书籍库", href: "/books" }, { label: book.title }]}
      >
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>作者：{book.authors.join("、")}</span>
          {book.year && <span>出版年份：{book.year}</span>}
        </div>
      </PageHeader>

      <div className="container grid gap-12 py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-20">
        <aside>
          <div className="sticky top-24">
            <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-md p-6 shadow-lift" style={{ backgroundColor: book.accent }}>
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/25" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">Learning Lab · Books</span>
              <div>
                <h2 className="font-serif text-3xl font-semibold leading-tight text-white">{book.title}</h2>
                <p className="mt-3 text-sm text-white/85">{book.authors.join(", ")}</p>
              </div>
            </div>
            {book.link && (
              <a href={book.link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary">
                官方或作者站点 <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {!book.link && <p className="mt-5 text-xs text-muted-foreground">暂无可核实的官方页面链接。</p>}
          </div>
        </aside>

        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-semibold">内容简介</h2>
            <p className="mt-4 text-[17px] leading-[1.9] text-foreground/85">{book.description}</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">核心观点</h2>
            <ul className="mt-5 space-y-3">
              {book.keyIdeas.map((idea) => (
                <li key={idea} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                  <BookOpen className="mt-1 h-4 w-4 shrink-0 text-primary" />{idea}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 font-serif text-lg font-semibold"><Users className="h-4 w-4 text-primary" />适合读者</h3>
              <ul className="mt-4 space-y-2 text-[15px] text-muted-foreground">
                {book.audience.map((a) => <li key={a}>- {a}</li>)}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 font-serif text-lg font-semibold"><Lightbulb className="h-4 w-4 text-primary" />关键概念</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {book.concepts.map((c) => <Badge key={c} variant="soft">{c}</Badge>)}
              </div>
            </div>
          </section>

          <section className="rounded-lg border-l-2 border-primary bg-primary-soft/40 p-6">
            <h2 className="font-serif text-lg font-semibold">实践启发</h2>
            <p className="mt-3 text-[15px] leading-[1.85] text-foreground/80">{book.practice}</p>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="mb-6 font-serif text-2xl font-semibold">相关书籍</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((b) => (
                  <Link key={b.slug} href={`/books/${b.slug}`} className="group flex items-center justify-between rounded-lg border border-border bg-card p-5">
                    <span>
                      <span className="block font-serif font-semibold group-hover:text-primary">{b.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{b.authors.join(", ")}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flag } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";
import { PathProgress } from "@/components/pages/path-progress";
import { Badge } from "@/components/ui/badge";
import { learningPaths, getLearningPath } from "@/content/data/paths";
import { getArticle } from "@/lib/content";
import { getBook } from "@/content/data/books";

export const dynamicParams = false;

export function generateStaticParams() {
  return learningPaths.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = getLearningPath(slug);
  if (!path) return {};
  return {
    title: `${path.title} · 学习路径`,
    description: path.description,
    alternates: { canonical: `/learning-paths/${slug}` },
  };
}

export default async function PathDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = getLearningPath(slug);
  if (!path) notFound();
  const allTasks = path.stages.flatMap((s) => s.tasks);

  return (
    <>
      <PageHeader
        eyebrow="Learning Path"
        title={path.title}
        englishTitle={path.englishTitle}
        description={path.description}
        crumbs={[{ label: "学习路径", href: "/learning-paths" }, { label: path.title }]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>{path.level}</Badge>
          <Badge variant="outline">{path.duration}</Badge>
        </div>
      </PageHeader>

      <div className="container grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-20">
        <div className="min-w-0">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-xs text-muted-foreground"><Flag className="h-3.5 w-3.5 text-primary" />学习目标</p>
              <p className="mt-2 text-[15px] leading-relaxed">{path.goal}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />完成标准</p>
              <p className="mt-2 text-[15px] leading-relaxed">{path.outcome}</p>
            </div>
          </div>

          <h2 className="mb-8 mt-14 font-serif text-2xl font-semibold">学习阶段</h2>
          <ol className="space-y-5">
            {path.stages.map((stage, i) => (
              <li key={stage.title} className="relative rounded-lg border border-border bg-card p-6 pl-14">
                <span className="absolute left-5 top-6 flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold text-white" style={{ backgroundColor: path.accent }}>
                  {i + 1}
                </span>
                <h3 className="font-serif text-xl font-semibold">{stage.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{stage.description}</p>

                <p className="section-label mt-5 mb-2">实践任务</p>
                <ul className="space-y-1.5 text-sm text-foreground/80">
                  {stage.tasks.map((t) => <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{t}</li>)}
                </ul>

                {(stage.articles.length > 0 || stage.books.length > 0) && (
                  <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                    <div>
                      <p className="section-label mb-2">推荐文章</p>
                      <ul className="space-y-1.5">
                        {stage.articles.map((s) => {
                          const a = getArticle(s);
                          return a ? (
                            <li key={s}>
                              <Link href={`/${a.category}/${a.slug}`} className="inline-flex items-center gap-1 text-[13px] text-primary hover:underline">
                                <BookOpen className="h-3 w-3" />{a.title}
                              </Link>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                    <div>
                      <p className="section-label mb-2">推荐书籍</p>
                      <ul className="space-y-1.5">
                        {stage.books.map((s) => {
                          const b = getBook(s);
                          return b ? (
                            <li key={s}>
                              <Link href={`/books/${b.slug}`} className="inline-flex items-center gap-1 text-[13px] text-primary hover:underline">
                                <ArrowRight className="h-3 w-3" />{b.title}
                              </Link>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <aside>
          <div className="sticky top-24 space-y-6">
            <PathProgress pathSlug={path.slug} tasks={allTasks} />
            <div className="rounded-lg border border-border bg-surface/50 p-5">
              <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />建议节奏</p>
              <p className="mt-2 text-sm leading-relaxed">{path.duration}。任务进度仅保存在本地浏览器，不会上传。</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

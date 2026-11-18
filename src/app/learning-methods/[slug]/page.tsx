import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, CircleAlert, Lightbulb, Target } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";
import { ArticleCard } from "@/components/articles/article-card";
import { ScienceDiagram } from "@/components/diagrams/science-diagrams";
import { Badge } from "@/components/ui/badge";
import { methods, getMethod } from "@/content/data/methods";
import { getArticle } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return methods.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const method = getMethod(slug);
  if (!method) return {};
  return {
    title: `${method.chineseName} · ${method.name}`,
    description: `${method.tagline}。${method.principle}`,
    alternates: { canonical: `/learning-methods/${slug}` },
  };
}

const levelLabel = {
  "well-supported": "证据较充分",
  emerging: "证据仍在发展",
  debated: "存在争议",
};

export default async function MethodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const method = getMethod(slug);
  if (!method) notFound();

  const articles = method.relatedArticles.map(getArticle).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const idx = methods.findIndex((m) => m.slug === method.slug);
  const next = methods[(idx + 1) % methods.length];

  return (
    <>
      <PageHeader
        eyebrow={`Learning Method · ${String(idx + 1).padStart(2, "0")}`}
        title={method.chineseName}
        englishTitle={method.name}
        description={method.tagline}
        crumbs={[{ label: "学习方法", href: "/learning-methods" }, { label: method.chineseName }]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant={method.evidenceLevel === "well-supported" ? "soft" : "outline"}>{levelLabel[method.evidenceLevel]}</Badge>
          {method.scenarios.slice(0, 4).map((s) => <Badge key={s} variant="muted">{s}</Badge>)}
        </div>
      </PageHeader>

      <div className="container grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-20">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-semibold">原理</h2>
            <p className="mt-4 text-[17px] leading-[1.9] text-foreground/85">{method.principle}</p>
          </section>

          {method.diagram && (
            <figure className="rounded-lg border border-border bg-card p-5">
              <ScienceDiagram name={method.diagram} />
            </figure>
          )}

          <section className="rounded-lg border-l-2 border-primary bg-primary-soft/40 p-6">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold"><Lightbulb className="h-5 w-5 text-primary" />研究依据</h2>
            <p className="mt-3 text-[15px] leading-[1.85] text-foreground/80">{method.evidence}</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">操作步骤</h2>
            <ol className="mt-5 space-y-4">
              {method.steps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft font-mono text-xs text-primary">{i + 1}</span>
                  <p className="pt-1 text-[15px] leading-relaxed text-foreground/85">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-serif text-lg font-semibold"><Target className="h-4 w-4 text-primary" />实际例子</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{method.example}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-serif text-lg font-semibold"><Check className="h-4 w-4 text-primary" />适用场景</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-muted-foreground">
                {method.scenarios.map((s) => <li key={s}>- {s}</li>)}
              </ul>
            </div>
          </section>

          <section className="rounded-lg border border-sand bg-surface p-6">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold"><CircleAlert className="h-5 w-5 text-primary" />常见误区与局限</h2>
            <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-foreground/80">
              {method.pitfalls.map((p) => <li key={p}>- {p}</li>)}
            </ul>
            <p className="mt-4 border-t border-border pt-4 text-[15px] leading-relaxed text-muted-foreground">{method.limitations}</p>
          </section>

          {articles.length > 0 && (
            <section>
              <h2 className="mb-6 font-serif text-2xl font-semibold">深入阅读</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {articles.slice(0, 2).map((a) => <ArticleCard key={a.slug} article={a} />)}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="section-label mb-4">快速概览</p>
              <dl className="space-y-4 text-sm">
                <div><dt className="text-muted-foreground">核心动作</dt><dd className="mt-1 font-medium">{method.tagline}</dd></div>
                <div><dt className="text-muted-foreground">证据等级</dt><dd className="mt-1 font-medium">{levelLabel[method.evidenceLevel]}</dd></div>
                <div><dt className="text-muted-foreground">步骤数</dt><dd className="mt-1 font-medium">{method.steps.length} 步</dd></div>
              </dl>
            </div>
            <Link href={`/learning-methods/${next.slug}`} className="group flex items-center justify-between rounded-lg border border-border bg-surface/50 p-5 transition-colors hover:bg-surface">
              <span>
                <span className="block text-xs text-muted-foreground">下一种方法</span>
                <span className="mt-1 block font-serif font-semibold group-hover:text-primary">{next.chineseName}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

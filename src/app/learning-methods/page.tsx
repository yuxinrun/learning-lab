import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { ScienceDiagram } from "@/components/diagrams/science-diagrams";
import { Badge } from "@/components/ui/badge";
import { methods } from "@/content/data/methods";
import { getArticle } from "@/lib/content";

export const metadata: Metadata = {
  title: "学习方法 · 15 种有证据支持的方法",
  description: "主动回忆、间隔重复、交错练习等 15 种学习方法的原理、研究依据、操作步骤、常见误区与局限。",
  alternates: { canonical: "/learning-methods" },
};

const levelLabel = {
  "well-supported": "证据较充分",
  emerging: "证据仍在发展",
  debated: "存在争议",
};

export default function MethodsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Methods"
        title="学习方法"
        englishTitle="Evidence-Informed Learning Methods"
        description="不提供万能技巧。每一种方法都写清楚它解决什么问题、研究支持到什么程度，以及在哪些情况下并不适用。"
        crumbs={[{ label: "学习方法" }]}
      />
      <div className="container py-14 md:py-20">
        <div className="grid items-center gap-10 rounded-lg border border-border bg-card p-6 md:grid-cols-[1fr_1fr] md:p-10">
          <div>
            <p className="eyebrow mb-3">How to use this section</p>
            <h2 className="font-serif text-2xl font-semibold">先辨认问题，再选择方法</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              想记牢概念，优先考虑提取与间隔；想提高辨别与迁移，加入交错；想理解原理，使用自我解释与精细化提问。方法中标注的证据等级提醒你保持审慎。
            </p>
          </div>
          <div className="rounded-md border border-border bg-background/60 p-3">
            <ScienceDiagram name="active-recall-flow" />
          </div>
        </div>

        <div className="mt-16">
          <SectionHeading eyebrow="All Methods" title="15 种方法" description="按学习目的浏览，或逐条阅读完整说明。" />
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {methods.map((m, i) => (
              <Link key={m.slug} href={`/learning-methods/${m.slug}`} className="group flex min-h-[210px] flex-col bg-card p-6 transition-colors hover:bg-surface/70">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] text-primary/70">{String(i + 1).padStart(2, "0")}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold group-hover:text-primary">{m.chineseName}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{m.name}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{m.tagline}</p>
                <div className="mt-auto pt-5">
                  <Badge variant={m.evidenceLevel === "well-supported" ? "soft" : "outline"} className="text-[10px]">
                    {levelLabel[m.evidenceLevel]}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-lg border border-border bg-surface/50 p-6 md:p-8">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
            <CheckCircle2 className="h-5 w-5 text-primary" /> 阅读建议
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            每种方法都附有相关文章。方法页中的“常见误区”与“局限性”和“操作步骤”同样重要：学习方法不是越多越好，而是越匹配越有效。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["retrieval-practice", "spaced-repetition", "self-explanation"].map((s) => {
              const a = getArticle(s);
              return a ? (
                <Link key={s} href={`/${a.category}/${a.slug}`} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:text-primary">
                  {a.title}
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

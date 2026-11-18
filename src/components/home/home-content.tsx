import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookMarked, CircleHelp, Compass, Layers3 } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { CategoryIcon } from "@/components/category-icon";
import { ArticleCard } from "@/components/articles/article-card";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/site";
import { methods } from "@/content/data/methods";
import type { Article } from "@/lib/types";

const startHere = [
  { title: "如何开始科学学习", href: "/learning-science/how-humans-learn", note: "建立整体图景" },
  { title: "人类如何形成记忆", href: "/memory/encoding-storage-retrieval", note: "编码、存储与提取" },
  { title: "为什么遗忘是正常的", href: "/memory/forgetting-curve", note: "遗忘的功能与局限" },
  { title: "如何提高长期记忆", href: "/learning-methods/spaced-repetition", note: "间隔与提取" },
  { title: "如何建立学习系统", href: "/lifelong-learning/learning-systems", note: "从意图到习惯" },
];

export function FeaturedTopics() {
  return (
    <section className="container py-20 md:py-24">
      <SectionHeading
        eyebrow="Featured Topics"
        title="八个核心学习主题"
        description="从学习机制到知识体系，循序渐进地理解人类如何学习。"
      />
      <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="group border-t border-border py-6 pr-4 transition-colors hover:border-primary"
          >
            <div className="mb-5 flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-surface text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <CategoryIcon name={c.icon} className="h-5 w-5" />
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/60">0{i + 1}</span>
            </div>
            <h3 className="font-serif text-lg font-semibold group-hover:text-primary">{c.title}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{c.englishTitle}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{c.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              进入主题 <ArrowUpRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function StartHere() {
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="container grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-24">
        <div>
          <p className="eyebrow mb-3">Start Here</p>
          <h2 className="font-serif text-[32px] font-semibold leading-tight">从这里开始</h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            如果你是第一次接触学习科学，这五篇文章会帮你建立最基本的框架。按顺序阅读，大约需要 40 分钟。
          </p>
          <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-primary">
            <Compass className="h-5 w-5" />
          </div>
        </div>
        <ol className="divide-y divide-border border-y border-border">
          {startHere.map((item, i) => (
            <li key={item.href}>
              <Link href={item.href} className="group flex items-center gap-5 py-5">
                <span className="w-8 shrink-0 font-serif text-2xl text-primary/50">0{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-[19px] font-medium transition-colors group-hover:text-primary">{item.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{item.note}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FeaturedArticles({ articles }: { articles: Article[] }) {
  const [lead, ...rest] = articles;
  return (
    <section className="container py-20 md:py-24">
      <SectionHeading
        eyebrow="Featured Articles"
        title="精选文章"
        description="把研究结论写得清楚，也写清楚它们的边界。"
        href="/search"
        linkLabel="浏览全部文章"
      />
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {lead && <ArticleCard article={lead} variant="feature" />}
        <div className="divide-y divide-border border-y border-border">
          {rest.slice(0, 4).map((a) => (
            <ArticleCard key={a.slug} article={a} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

const methodAccents = [
  "从记忆中提取",
  "分散到多天",
  "混合不同类型",
  "追问为什么",
  "语言与图像",
  "生成答案",
  "解释每一步",
  "向他人讲述",
];

export function MethodsPreview() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container py-20 md:py-24">
        <SectionHeading
          eyebrow="Learning Methods"
          title="有证据支持的学习方法"
          description="每种方法都包含原理、研究依据、适用场景、操作步骤与局限性。"
          href="/learning-methods"
          linkLabel="查看全部方法"
        />
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {methods.slice(0, 8).map((m, i) => (
            <Link
              key={m.slug}
              href={`/learning-methods/${m.slug}`}
              className="group flex min-h-[190px] flex-col bg-card p-5 transition-colors hover:bg-surface/60"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="font-serif text-[17px] font-semibold leading-snug">{m.chineseName}</h3>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{m.name}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{methodAccents[i]}</p>
              <div className="mt-auto pt-4">
                <Badge variant="outline" className="text-[10px]">
                  {m.evidenceLevel === "well-supported" ? "证据较充分" : m.evidenceLevel === "emerging" ? "证据发展中" : "存在争议"}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
          <p className="flex items-start gap-2"><BookMarked className="mt-0.5 h-4 w-4 shrink-0 text-primary" />阅读卡片了解每种方法的研究依据。</p>
          <p className="flex items-start gap-2"><Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />结合图解理解方法背后的机制。</p>
          <p className="flex items-start gap-2"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />注意局限：没有方法适合所有场景。</p>
        </div>
      </div>
    </section>
  );
}

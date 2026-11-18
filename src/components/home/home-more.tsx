import Link from "next/link";
import { ArrowRight, ArrowUpRight, BarChart3, BookMarked, CalendarCheck2, Layers3, Library, Timer, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { ScienceDiagram } from "@/components/diagrams/science-diagrams";
import { books } from "@/content/data/books";
import { resources } from "@/content/data/resources";
import { toolsList } from "@/lib/site";

const toolIcons = [BarChart3, CalendarCheck2, Layers3, BookMarked, Library, Wrench, Timer, CalendarCheck2];

export function VisualizationsPreview() {
  return (
    <section className="container py-20 md:py-24">
      <SectionHeading
        eyebrow="Knowledge Visualizations"
        title="用图解理解机制"
        description="原创 SVG 科学图解，把抽象的学习过程变成可以看见的结构。"
        href="/visualizations"
        linkLabel="查看全部图解"
      />
      <div className="grid items-center gap-10 rounded-lg border border-border bg-card p-6 md:grid-cols-[1fr_0.85fr] md:p-10">
        <div className="order-2 md:order-1">
          <p className="section-label mb-3">Diagram 04 / 12</p>
          <h3 className="font-serif text-2xl font-semibold">遗忘与提取</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            保持量随时间下降是一个有用的近似描述，而不是精确公式。提取会在短期内提高可及性，并可能减缓之后的遗忘；具体曲线受材料、学习程度与个体差异影响。
          </p>
          <Link href="/visualizations" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            探索全部 12 张图解 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="order-1 rounded-md border border-border bg-background/60 p-4 md:order-2">
          <ScienceDiagram name="forgetting-retrieval" />
        </div>
      </div>
    </section>
  );
}

export function BooksPreview() {
  const picks = [books[0], books[5], books[10], books[14]];
  return (
    <section className="border-y border-border bg-surface/50">
      <div className="container py-20 md:py-24">
        <SectionHeading
          eyebrow="Learning Books"
          title="值得精读的书"
          description="聚焦学习、记忆、思维与知识管理的经典与新作。信息以可核实的资料为准。"
          href="/books"
          linkLabel="浏览书籍库"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((book) => (
            <Link key={book.slug} href={`/books/${book.slug}`} className="group flex flex-col">
              <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-md p-5 shadow-soft transition-transform group-hover:-translate-y-1" style={{ backgroundColor: book.accent }}>
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/30" />
                <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full border border-white/20" />
                <span className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">Learning Lab · Books</span>
                <div className="relative">
                  <h3 className="font-serif text-[23px] font-semibold leading-tight text-white">{book.title}</h3>
                  <p className="mt-2 text-xs text-white/85">{book.authors[0]}</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{book.description}</p>
              {book.year && <p className="mt-1.5 text-xs text-muted-foreground">{book.year}</p>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResourcesPreview() {
  return (
    <section className="container py-20 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow mb-3">Global Resources</p>
          <h2 className="font-serif text-[30px] font-semibold leading-tight">连接全球专业资源</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            大学、学术组织、研究机构与开放学习平台。每个链接都指向机构的官方网站，不编造地址。
          </p>
          <Link href="/resources" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            查看全部资源 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {resources.slice(0, 6).map((r) => (
            <Link key={r.slug} href={`/resources/${r.slug}`} className="group flex items-center gap-4 bg-card p-5 transition-colors hover:bg-surface/70">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-white" style={{ backgroundColor: r.accent }}>
                {r.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium group-hover:text-primary">{r.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{r.type} · {r.region}</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ToolsPreview() {
  return (
    <section className="border-t border-border bg-card">
      <div className="container py-20 md:py-24">
        <SectionHeading
          eyebrow="Interactive Tools"
          title="把方法变成日常实践"
          description="所有数据默认保存在你的浏览器本地，不会自动上传。图表只使用你真实记录的数据。"
          href="/tools"
          linkLabel="进入工具中心"
        />
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {toolsList.slice(1).map((tool, i) => {
            const Icon = toolIcons[i] ?? Wrench;
            return (
              <Link key={tool.href} href={tool.href} className="group flex min-h-[150px] flex-col bg-card p-5 transition-colors hover:bg-surface/60">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.7} />
                <h3 className="mt-5 font-serif text-[17px] font-semibold group-hover:text-primary">{tool.label}</h3>
                <p className="mt-1.5 text-[13px] text-muted-foreground">{tool.description}</p>
                <ArrowUpRight className="ml-auto mt-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

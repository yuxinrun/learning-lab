import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/page-header";
import { ScienceDiagram, diagramMeta, diagramNames } from "@/components/diagrams/science-diagrams";

export const metadata: Metadata = {
  title: "学习科学图解",
  description: "12 张原创 SVG 科学图解：记忆处理、工作记忆、遗忘与提取、间隔重复、认知负荷、知识网络、元认知等。",
  alternates: { canonical: "/visualizations" },
};

export default function VisualizationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Knowledge Visualizations"
        title="学习科学图解"
        englishTitle="Visual Explanations"
        description="用原创 SVG 图解把学习机制变得可见。每张图都配有文字说明与无障碍描述；图解是理解框架，不是精确公式。"
        crumbs={[{ label: "图解" }]}
      />
      <div className="container py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {diagramNames.map((name, i) => (
            <figure key={name} id={name} className="scroll-mt-24 overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <p className="section-label">Diagram {String(i + 1).padStart(2, "0")} / 12</p>
                  <h2 className="mt-1 font-serif text-xl font-semibold">{diagramMeta[name].title}</h2>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <ScienceDiagram name={name} />
              </div>
              <figcaption className="border-t border-border bg-surface/40 px-6 py-4 text-sm leading-relaxed text-muted-foreground">
                {diagramMeta[name].description}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Layers3, Target } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";
import { learningPaths } from "@/content/data/paths";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "学习路径",
  description: "从新手入门到个人知识管理，五条系统化学习路线：目标、阶段、文章、书籍、实践任务与完成标准。",
  alternates: { canonical: "/learning-paths" },
};

export default function LearningPathsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Paths"
        title="学习路径"
        englishTitle="Structured Journeys"
        description="把文章、方法、书籍与实践任务组织成一条可执行的路线。每条路径都有明确目标、阶段划分与完成标准。"
        crumbs={[{ label: "学习路径" }]}
      />
      <div className="container py-14 md:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {learningPaths.map((path, i) => (
            <Link key={path.slug} href={`/learning-paths/${path.slug}`} className="group flex flex-col rounded-lg border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-md font-mono text-sm font-semibold text-white" style={{ backgroundColor: path.accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Badge variant="outline">{path.level}</Badge>
              </div>
              <h2 className="mt-6 font-serif text-2xl font-semibold group-hover:text-primary">{path.title}</h2>
              <p className="mt-1 font-serif text-sm italic text-muted-foreground">{path.englishTitle}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{path.description}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{path.duration}</span>
                <span className="inline-flex items-center gap-1.5"><Layers3 className="h-3.5 w-3.5" />{path.stages.length} 个阶段</span>
                <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5" />{path.goal}</span>
              </div>
              <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                查看路径 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

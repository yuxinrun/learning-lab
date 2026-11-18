import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";
import { resources } from "@/content/data/resources";

export const metadata: Metadata = {
  title: "参考来源",
  description: "Learning Lab 内容所依赖的学术组织、研究机构与文献检索入口。",
  alternates: { canonical: "/sources" },
};

const core = [
  { name: "PubMed · 生物医学文献检索", url: "https://pubmed.ncbi.nlm.nih.gov", note: "核对论文出处、摘要与研究设计。" },
  { name: "What Works Clearinghouse", url: "https://ies.ed.gov/ncee/wwc", note: "按标准评估教育干预研究质量。" },
  { name: "Education Endowment Foundation", url: "https://educationendowmentfoundation.org.uk", note: "循证教学工具包与证据强度分级。" },
  { name: "Association for Psychological Science", url: "https://www.psychologicalscience.org", note: "心理学研究进展与方法讨论。" },
];

export default function SourcesPage() {
  return (
    <>
      <PageHeader eyebrow="Sources" title="参考来源" description="我们优先使用的权威检索入口与机构网站。本站不编造论文出处或 DOI；具体文献请以原始数据库记录为准。" crumbs={[{ label: "参考来源" }]} />
      <div className="container max-w-4xl py-14 md:py-20">
        <div className="space-y-3">
          {core.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-lg border border-border bg-card p-5">
              <span>
                <span className="block font-serif text-lg font-semibold group-hover:text-primary">{s.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{s.note}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>

        <h2 className="mt-14 font-serif text-2xl font-semibold">常引用研究方向</h2>
        <ul className="mt-5 space-y-2 text-[16px] leading-[1.8] text-foreground/85">
          <li>- 提取练习与测验效应（Roediger、Karpicke、Agarwal 等）。</li>
          <li>- 间隔效应与复习安排（Cepeda 等的综述与再分析）。</li>
          <li>- 工作记忆与认知负荷（Baddeley、Sweller 等）。</li>
          <li>- 睡眠与记忆巩固（Walker、Stickgold 等）。</li>
          <li>- 自我解释与样例学习（Chi、Renkl 等）。</li>
          <li>- 判断与决策（Kahneman、Tetlock 等，注意重复性与边界讨论）。</li>
        </ul>

        <div className="mt-14 rounded-lg border border-border bg-surface/50 p-6">
          <h2 className="font-serif text-xl font-semibold">完整资源导航</h2>
          <p className="mt-2 text-sm text-muted-foreground">更多大学、学会与开放学习平台请访问资源导航。</p>
          <Link href="/resources" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            查看 {resources.length} 个专业资源 <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

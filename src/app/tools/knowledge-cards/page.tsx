import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { KnowledgeCards } from "@/components/tools/knowledge-cards";

export const metadata: Metadata = {
  title: "Knowledge Cards · 知识卡片",
  description: "创建支持 Markdown 的知识卡片，按标签与分类搜索、收藏、编辑并关联主题。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Knowledge Cards" title="知识卡片" description="一张卡片只表达一个观点：原子化、自解释、可连接。" current="/tools/knowledge-cards">
      <KnowledgeCards />
    </ToolShell>
  );
}

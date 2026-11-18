import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { ReadingTracker } from "@/components/tools/reading-tracker";

export const metadata: Metadata = {
  title: "Reading Tracker · 阅读记录器",
  description: "添加书籍、记录阅读进度与时间、撰写笔记、设定收藏并查看阅读趋势。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Reading Tracker" title="阅读记录器" description="把阅读变成可见的进度与可回顾的笔记。" current="/tools/reading-tracker">
      <ReadingTracker />
    </ToolShell>
  );
}

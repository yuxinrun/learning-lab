import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { LearningGoals } from "@/components/tools/learning-goals";

export const metadata: Metadata = {
  title: "Learning Goals · 学习目标规划器",
  description: "创建学习目标、拆解阶段、设定截止日期、记录进度并每周回顾。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Learning Goals" title="学习目标规划器" description="把意图变成可执行的阶段与可回顾的进度。" current="/tools/learning-goals">
      <LearningGoals />
    </ToolShell>
  );
}

import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { Dashboard } from "@/components/tools/dashboard";

export const metadata: Metadata = {
  title: "学习工具与仪表盘",
  description: "学习仪表盘、学习记录、间隔重复、主动回忆、阅读记录、目标规划、知识卡片、专注计时与每周复盘。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Learning Dashboard" title="我的学习空间" description="所有工具的数据都保存在本地浏览器。图表只使用你真实记录的数据。" current="/tools">
      <Dashboard />
    </ToolShell>
  );
}

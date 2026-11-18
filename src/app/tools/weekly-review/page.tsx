import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { WeeklyReview } from "@/components/tools/weekly-review";

export const metadata: Metadata = {
  title: "Weekly Review · 每周学习复盘",
  description: "回顾本周学习时间、目标完成情况、最有效的方法、困难与下周改进计划。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Weekly Review" title="每周学习复盘" description="用一小段时间回看整周，找到真正有效的调整。" current="/tools/weekly-review">
      <WeeklyReview />
    </ToolShell>
  );
}

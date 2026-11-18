import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { SpacedRepetition } from "@/components/tools/spaced-repetition";

export const metadata: Metadata = {
  title: "Spaced Repetition · 间隔重复计划器",
  description: "创建复习项、生成可调整的复习日期、查看今日待复习内容并记录掌握程度。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Spaced Repetition" title="间隔重复计划器" description="把复习分散到多个时间点。间隔是可调的辅助方案，不是通用科学公式。" current="/tools/spaced-repetition">
      <SpacedRepetition />
    </ToolShell>
  );
}

import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { ActiveRecall } from "@/components/tools/active-recall";

export const metadata: Metadata = {
  title: "Active Recall · 主动回忆练习",
  description: "创建问题与答案，隐藏答案尝试回忆，记录自我评价并保存练习历史。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Active Recall" title="主动回忆练习" description="把“我认识”变成“我能想起来”：先提取，再核对。" current="/tools/active-recall">
      <ActiveRecall />
    </ToolShell>
  );
}

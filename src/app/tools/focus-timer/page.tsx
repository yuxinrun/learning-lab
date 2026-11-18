import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { FocusTimer } from "@/components/tools/focus-timer";

export const metadata: Metadata = {
  title: "Focus Timer · 专注学习计时器",
  description: "自定义专注与休息时长，支持暂停、结束与番茄钟模式，自动记录历史专注时间。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Focus Timer" title="专注学习计时器" description="一个时段只做一件事：开始、专注、结束、记录。" current="/tools/focus-timer">
      <FocusTimer />
    </ToolShell>
  );
}

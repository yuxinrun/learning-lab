import type { Metadata } from "next";
import { ToolShell } from "@/components/tools/tool-shell";
import { StudyTracker } from "@/components/tools/study-tracker";

export const metadata: Metadata = {
  title: "Study Tracker · 学习记录器",
  description: "记录学习日期、主题、时长、内容、感受与成果，支持编辑、筛选与导出。",
};

export default function Page() {
  return (
    <ToolShell eyebrow="Study Tracker" title="学习记录器" description="记录每一次学习的主题、时长与成果。所有数据保存在本地浏览器。" current="/tools/study-tracker">
      <StudyTracker />
    </ToolShell>
  );
}

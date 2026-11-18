import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/page-header";

export const metadata: Metadata = {
  title: "隐私与条款",
  description: "Learning Lab 如何处理你的学习数据：默认本地保存、不上传、可导出。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Privacy & Terms" title="隐私与条款" description="你的学习记录属于你。本站默认把它们留在你的浏览器里。" crumbs={[{ label: "隐私与条款" }]} />
      <div className="container max-w-4xl space-y-12 py-14 md:py-20">
        <section>
          <h2 className="font-serif text-2xl font-semibold">本地优先的数据策略</h2>
          <p className="mt-5 text-[16px] leading-[1.9] text-foreground/85">
            学习仪表盘、学习记录、复习计划、主动回忆、阅读记录、目标规划、知识卡片、专注计时与每周复盘中的数据，默认保存在当前浏览器的 localStorage。本站没有账号系统，也不会自动上传这些内容到任何服务器。
          </p>
          <p className="mt-4 text-[16px] leading-[1.9] text-foreground/85">
            清除浏览器数据、更换设备或使用隐私模式可能导致这些记录丢失。每个工具都提供 JSON（部分支持 CSV）导出功能，建议定期备份。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold">示例数据</h2>
          <p className="mt-5 text-[16px] leading-[1.9] text-foreground/85">
            仪表盘中的 Demo Data 仅供预览图表，明确标注为“非真实学习记录”，不会写入本地存储，也不会被描述为你的实际学习数据。
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold">第三方资源</h2>
          <p className="mt-5 text-[16px] leading-[1.9] text-foreground/85">
            外部字体与资源链接由相应提供方管理。点击书籍或资源页面的外部链接会离开本站，请阅读目标站点的隐私政策。
          </p>
        </section>

        <section id="terms">
          <h2 className="font-serif text-2xl font-semibold">使用条款</h2>
          <p className="mt-5 text-[16px] leading-[1.9] text-foreground/85">
            本站内容用于学习与参考，不构成医疗、心理治疗、法律或职业建议。学习方法的效果因人而异；请结合自身情况判断，并在需要时咨询专业人士。站点内容采用 CC BY-NC-SA 4.0 许可（另有说明除外）。
          </p>
        </section>
      </div>
    </>
  );
}

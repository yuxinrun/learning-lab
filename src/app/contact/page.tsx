import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, GitPullRequest } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";

export const metadata: Metadata = {
  title: "联系与反馈",
  description: "如何反馈内容错误、提出建议或参与 Learning Lab 的改进。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="联系与反馈" description="发现事实错误、过时结论或交互问题？你的反馈会让这个知识库更可靠。" crumbs={[{ label: "联系" }]} />
      <div className="container max-w-3xl py-14 md:py-20">
        <div className="rounded-lg border border-border bg-card p-8">
          <GitPullRequest className="h-6 w-6 text-primary" />
          <h2 className="mt-5 font-serif text-2xl font-semibold">通过项目仓库反馈</h2>
          <p className="mt-4 text-[16px] leading-[1.9] text-foreground/85">
            本项目以开源方式维护。请使用项目仓库的 Issues 页面提交内容勘误、研究更新建议或功能问题。提交时请写明页面地址、涉及段落与建议依据，这能显著提高处理效率。
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            当前站点未配置邮件收件箱或表单后端，因此这里不提供会假装提交成功的联系表单。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/editorial-policy" className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm hover:border-primary">
              查看编辑政策 <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/sources" className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm hover:border-primary">
              查看参考来源 <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

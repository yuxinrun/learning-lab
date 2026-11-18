import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, FlaskConical, Library, Wrench } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";

export const metadata: Metadata = {
  title: "关于我们",
  description: "Learning Lab 是一个基于证据的学习科学知识平台，帮助人们理解学习、记忆、认知与思维。",
  alternates: { canonical: "/about" },
};

const principles = [
  { icon: FlaskConical, title: "证据优先", text: "优先采用同行评审研究、系统综述与权威机构资料。区分结论、适用范围与局限。" },
  { icon: Compass, title: "机制与边界并重", text: "不只告诉读者做什么，也解释为什么，以及在什么情况下不应使用。" },
  { icon: Library, title: "内容可持续", text: "文章与 UI 分离，结构化分类与标签让内容可以持续扩展和修订。" },
  { icon: Wrench, title: "工具服务实践", text: "学习工具把方法变成日常动作，默认本地保存，不上传私人记录。" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="关于 Learning Lab"
        englishTitle="Learn Smarter. Grow Further."
        description="Learning Lab（学习实验室）是一个融合学习科学、认知心理学、记忆科学、阅读方法、深度思考与知识管理的综合知识平台。"
        crumbs={[{ label: "关于" }]}
      />
      <div className="container max-w-4xl py-14 md:py-20">
        <p className="text-[17px] leading-[1.95] text-foreground/85">
          我们希望做的不是一份学习技巧合集，而是一座可以长期使用的知识库：帮助读者理解人类如何学习，理解记忆、注意与思维的科学与局限，掌握有研究依据的方法，并逐步建立自己的知识体系与长期学习习惯。
        </p>
        <p className="mt-6 text-[17px] leading-[1.95] text-foreground/85">
          网站由知识库、学习路径、书籍与资源导航、原创科学图解、数据可视化和九项本地学习工具组成。所有内容都以结构化方式组织，便于检索、交叉引用与持续修订。
        </p>

        <h2 className="mt-16 font-serif text-2xl font-semibold">编辑原则</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-card p-6">
              <p.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-serif text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-lg border-l-2 border-primary bg-primary-soft/40 p-7">
          <h2 className="font-serif text-xl font-semibold">我们如何对待不确定性</h2>
          <p className="mt-3 text-[15px] leading-[1.85] text-foreground/80">
            学习科学中许多结论是有条件的。我们明确区分“已有较充分研究支持的结论”“证据仍在发展的观点”“存在争议或被过度通俗化的说法”。任何涉及学习效果的结论，都应连同适用场景与研究局限一起阅读。
          </p>
          <Link href="/editorial-policy" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            阅读编辑政策 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

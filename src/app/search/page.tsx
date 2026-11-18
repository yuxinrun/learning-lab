import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/page-header";
import { SearchClient } from "@/components/pages/search-client";
import { getAllSearchItems } from "@/lib/search";

export const metadata: Metadata = {
  title: "全站搜索",
  description: "搜索 Learning Lab 的文章、概念、学习方法、书籍、专业资源、学习路径与工具。",
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Search"
        title="搜索"
        description="一个入口查找全站内容：文章、概念、方法、书籍、资源、路径与工具。"
        crumbs={[{ label: "搜索" }]}
      />
      <div className="container py-14 md:py-20">
        <SearchClient items={getAllSearchItems()} initialQuery="" />
      </div>
    </>
  );
}

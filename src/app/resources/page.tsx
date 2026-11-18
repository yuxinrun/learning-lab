import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/page-header";
import { ResourcesGrid } from "@/components/pages/resources-grid";
import { resources } from "@/content/data/resources";

export const metadata: Metadata = {
  title: "全球专业资源导航",
  description: "学习科学、教育研究、认知科学、大学与开放学习平台的官方网站导航。",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Global Resources"
        title="专业资源导航"
        englishTitle="Research & Learning Resources"
        description={`${resources.length} 个来自大学、学术组织、研究机构与开放学习平台的权威入口。所有链接均指向机构官方网站。`}
        crumbs={[{ label: "资源导航" }]}
      />
      <div className="container py-14 md:py-20">
        <ResourcesGrid />
      </div>
    </>
  );
}

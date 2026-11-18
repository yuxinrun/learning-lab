import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/page-header";
import { BooksGrid } from "@/components/pages/books-grid";
import { books } from "@/content/data/books";

export const metadata: Metadata = {
  title: "学习书籍库",
  description: "学习科学、记忆、认知、阅读、思维与知识管理领域的精选书籍。作者与年份以可核实信息为准。",
  alternates: { canonical: "/books" },
};

export default function BooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learning Books"
        title="书籍库"
        englishTitle="A Curated Reading List"
        description={`收录 ${books.length} 本关于学习、记忆、思维与知识管理的书。我们对作者与出版年份保持谨慎：无法核实的信息留空，不编造评分或链接。`}
        crumbs={[{ label: "书籍库" }]}
      />
      <div className="container py-14 md:py-20">
        <BooksGrid />
      </div>
    </>
  );
}

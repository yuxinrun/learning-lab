import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/page-header";

export const metadata: Metadata = {
  title: "编辑政策",
  description: "Learning Lab 的证据标准、内容分级、引用规范与更正机制。",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <>
      <PageHeader eyebrow="Editorial Policy" title="编辑政策" description="我们如何选题、如何判断证据、如何处理不确定性与错误。" crumbs={[{ label: "编辑政策" }]} />
      <div className="container max-w-4xl space-y-12 py-14 md:py-20">
        <section>
          <h2 className="font-serif text-2xl font-semibold">证据来源优先级</h2>
          <ol className="mt-5 space-y-3 text-[16px] leading-[1.85] text-foreground/85">
            <li>1. 系统综述、荟萃分析与同行评审论文。</li>
            <li>2. 权威大学与研究机构发布的报告。</li>
            <li>3. 专业学术组织与教育研究机构的指南。</li>
            <li>4. 经典学术著作与经过核实的通俗读物。</li>
          </ol>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">通俗读物适合作为入口，但其中的例证与数字仍应回到原始研究核实。</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold">证据分级</h2>
          <div className="mt-5 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface"><tr><th className="p-4 text-left">标注</th><th className="p-4 text-left">含义</th></tr></thead>
              <tbody>
                <tr className="border-t border-border"><td className="p-4 font-medium">证据较充分</td><td className="p-4 text-muted-foreground">多项研究与综述支持，仍有适用条件。</td></tr>
                <tr className="border-t border-border"><td className="p-4 font-medium">证据仍在发展</td><td className="p-4 text-muted-foreground">有积极发现，但研究数量、样本或一致性有限。</td></tr>
                <tr className="border-t border-border"><td className="p-4 font-medium">存在争议</td><td className="p-4 text-muted-foreground">研究结论不一致，或通俗说法超出证据范围。</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold">写作规范</h2>
          <ul className="mt-5 space-y-3 text-[16px] leading-[1.85] text-foreground/85">
            <li>- 不编造论文、DOI、统计数据、研究结论或链接。</li>
            <li>- 不把相关性写成因果关系，不把单项研究写成科学共识。</li>
            <li>- 不宣称某一方法适合所有学习者或所有场景。</li>
            <li>- 不把学习风格理论当作已被证实的个性化教学依据。</li>
            <li>- 图表中的示例数据必须明确标注为 Demo Data；用户实际数据只来自本地记录。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold">引用与更正</h2>
          <p className="mt-5 text-[16px] leading-[1.85] text-foreground/85">
            文章在末尾列出参考来源与延伸阅读。书籍信息仅在可核实时填写出版年份与官方链接，否则留空。发现事实错误或过时结论时，我们会修订正文并在文章元信息中更新“更新时间”。重要更正会在页面上明确说明。
          </p>
        </section>
      </div>
    </>
  );
}

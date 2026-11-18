import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/pages/page-header";
import { toolsList } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ToolNav({ current }: { current: string }) {
  return (
    <nav aria-label="学习工具" className="no-scrollbar flex max-w-full gap-1.5 overflow-x-auto pb-1">
      {toolsList.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
            current === t.href ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function ToolShell({
  eyebrow,
  title,
  description,
  current,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} crumbs={[{ label: "工具", href: "/tools" }, { label: title }]} />
      <div className="container py-10 md:py-14">
        <ToolNav current={current} />
        <div className="mt-8">{children}</div>
        <div className="mt-12 flex items-start gap-2 rounded-md border border-border bg-surface/50 p-4 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>你的记录只保存在当前浏览器的 localStorage 中，本站不会自动上传任何私人学习数据。清除浏览器数据会同时删除这些记录，请定期使用页面中的导出功能备份。</span>
        </div>
      </div>
    </>
  );
}

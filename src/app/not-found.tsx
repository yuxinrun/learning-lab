import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <FileQuestion className="h-10 w-10 text-primary" />
      <p className="mt-6 font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">这个页面不存在</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">链接可能已更改，或者这篇文章尚未发布。你可以返回首页或使用全站搜索。</p>
      <div className="mt-8 flex gap-3">
        <Button asChild><Link href="/"><ArrowLeft className="h-4 w-4" />返回首页</Link></Button>
        <Button asChild variant="outline"><Link href="/search">搜索内容</Link></Button>
      </div>
    </div>
  );
}

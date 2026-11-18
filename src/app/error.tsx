"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <AlertTriangle className="h-10 w-10 text-primary" />
      <h1 className="mt-6 font-serif text-3xl font-semibold">页面加载遇到问题</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">这可能是临时错误。你可以重试，或通过搜索找到需要的内容。</p>
      <Button className="mt-8" onClick={reset}>重试</Button>
    </div>
  );
}

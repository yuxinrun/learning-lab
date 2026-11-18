"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error" | "unconfigured">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!endpoint) {
      setStatus("unconfigured");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="container py-20 md:py-24">
      <div className="grid gap-8 overflow-hidden rounded-lg border border-border bg-surface/60 md:grid-cols-[1fr_0.9fr]">
        <div className="p-8 md:p-12">
          <p className="eyebrow mb-3">Learning Notes</p>
          <h2 className="font-serif text-[30px] font-semibold leading-tight">每周一封，审慎的学习笔记</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            一份关于学习科学、记忆与思维的简短通讯：一篇值得读的研究、一个可实践的方法，以及相应的证据边界。
          </p>
        </div>
        <div className="flex flex-col justify-center border-t border-border p-8 md:border-l md:border-t-0 md:p-12">
          {status === "sent" ? (
            <p className="text-sm text-primary">已收到你的订阅请求。感谢关注。</p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="邮箱地址"
                />
                <Button type="submit" disabled={status === "submitting"} className="shrink-0">
                  {status === "submitting" ? "提交中…" : "订阅"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {status === "unconfigured"
                  ? "当前站点尚未接入邮件服务，提交不会真正订阅。请通过 Contact 页面获取更新方式。"
                  : status === "error"
                    ? "提交失败，请稍后重试或前往 Contact 页面。"
                    : "我们不会出售你的邮箱，也不会默认上传你的学习记录。"}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

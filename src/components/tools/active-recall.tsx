"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { RecallItem } from "@/lib/tool-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DeleteButton, ToolEmpty, ToolHeader } from "./tool-ui";
import { formatDate, uid } from "@/lib/utils";

const schema = z.object({
  question: z.string().min(1, "请填写问题").max(300),
  answer: z.string().min(1, "请填写答案").max(2000),
  topic: z.string().max(60),
});
type FormValues = z.infer<typeof schema>;

export function ActiveRecall() {
  const { value: cards, setValue: setCards, hydrated } = useLocalStorage<RecallItem[]>(STORAGE_KEYS.recall, []);
  const [showForm, setShowForm] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { question: "", answer: "", topic: "" },
  });

  const active = cards.find((c) => c.id === activeId);
  const today = new Date().toISOString().slice(0, 10);

  function onSubmit(values: FormValues) {
    setCards((prev) => [...prev, { id: uid(), ...values, history: [] }]);
    reset({ question: "", answer: "", topic: "" });
    setShowForm(false);
  }

  function rate(rating: number) {
    if (!active) return;
    setCards((prev) => prev.map((c) => c.id === active.id ? { ...c, history: [...c.history, { date: today, rating }] } : c));
    setRevealed(false);
  }

  if (!hydrated) return <div className="h-64 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="主动回忆练习"
        description="先尝试从记忆中提取答案，再揭晓并给出诚实评价。"
        onAdd={() => setShowForm((v) => !v)}
        addLabel={showForm ? "收起表单" : "创建问题"}
        exportFilename="learning-lab-active-recall.json"
        exportRows={cards}
      />

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 grid gap-5 rounded-lg border border-border bg-card p-6">
          <div>
            <Label htmlFor="question">问题</Label>
            <Input id="question" placeholder="例如：工作记忆模型包含哪些成分？" {...register("question")} className="mt-2" />
            {errors.question && <p className="mt-1 text-xs text-destructive">{errors.question.message}</p>}
          </div>
          <div>
            <Label htmlFor="answer">答案</Label>
            <Textarea id="answer" placeholder="写出完整答案，稍后练习时先自己回忆" {...register("answer")} className="mt-2 min-h-28" />
            {errors.answer && <p className="mt-1 text-xs text-destructive">{errors.answer.message}</p>}
          </div>
          <div>
            <Label htmlFor="topic">主题（可选）</Label>
            <Input id="topic" placeholder="例如：记忆科学" {...register("topic")} className="mt-2" />
          </div>
          <div className="flex gap-2">
            <Button type="submit">保存问题</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>取消</Button>
          </div>
        </form>
      )}

      {cards.length === 0 ? (
        <ToolEmpty text="还没有练习题。创建一张问题卡片，合上答案先自己尝试回忆。" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {active ? (
              <div className="rounded-lg border border-border bg-card p-7">
                <div className="flex items-center justify-between">
                  <Badge>{active.topic || "未分类"}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => { setActiveId(null); setRevealed(false); }}>返回列表</Button>
                </div>
                <h3 className="mt-6 font-serif text-2xl font-semibold leading-snug">{active.question}</h3>
                <p className="mt-2 text-xs text-muted-foreground">先不要看答案，在脑中或纸上写出你的回答。</p>

                {revealed ? (
                  <div className="mt-8 rounded-md border border-primary/25 bg-primary-soft/40 p-6">
                    <p className="section-label mb-2">参考答案</p>
                    <p className="whitespace-pre-wrap text-[15px] leading-[1.85]">{active.answer}</p>
                  </div>
                ) : (
                  <Button className="mt-8" size="lg" onClick={() => setRevealed(true)}><Eye className="h-4 w-4" />显示答案</Button>
                )}

                {revealed && (
                  <div className="mt-8 border-t border-border pt-6">
                    <p className="mb-3 text-sm font-medium">自我评价：这次回忆得怎么样？</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { n: 1, label: "完全想不起" },
                        { n: 2, label: "有一点印象" },
                        { n: 3, label: "基本正确" },
                        { n: 4, label: "比较完整" },
                        { n: 5, label: "非常熟练" },
                      ].map((r) => (
                        <Button key={r.n} variant={r.n >= 3 ? "soft" : "outline"} size="sm" onClick={() => rate(r.n)}>{r.n} · {r.label}</Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <ToolEmpty text="从右侧选择一道题开始练习。" />
            )}
          </div>

          <aside className="space-y-3">
            <h3 className="font-serif text-lg font-semibold">问题列表 · {cards.length}</h3>
            {cards.map((c) => {
              const avg = c.history.length ? Math.round(c.history.reduce((s, h) => s + h.rating, 0) / c.history.length * 10) / 10 : null;
              return (
                <div key={c.id} className={`flex items-start gap-2 rounded-lg border p-4 ${activeId === c.id ? "border-primary bg-primary-soft/30" : "border-border bg-card"}`}>
                  <button onClick={() => { setActiveId(c.id); setRevealed(false); }} className="min-w-0 flex-1 text-left">
                    <span className="block line-clamp-2 text-sm font-medium">{c.question}</span>
                    <span className="mt-1.5 block text-xs text-muted-foreground">练习 {c.history.length} 次{avg ? ` · 平均 ${avg}/5` : ""}</span>
                  </button>
                  <DeleteButton label="删除" onClick={() => { setCards((prev) => prev.filter((x) => x.id !== c.id)); if (activeId === c.id) setActiveId(null); }} />
                </div>
              );
            })}
            {active && revealed && (
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setRevealed(false)}><EyeOff className="h-3.5 w-3.5" />重新隐藏答案</Button>
            )}
            {active && (
              <Button variant="ghost" size="sm" className="w-full" onClick={() => { setActiveId(null); setRevealed(false); }}><RotateCcw className="h-3.5 w-3.5" />结束本轮</Button>
            )}
            <p className="pt-2 text-[11px] leading-relaxed text-muted-foreground">最近一次练习：{cards.flatMap((c) => c.history).sort((a, b) => a.date < b.date ? 1 : -1)[0] ? formatDate(cards.flatMap((c) => c.history).sort((a, b) => a.date < b.date ? 1 : -1)[0].date) : "暂无"}</p>
          </aside>
        </div>
      )}
    </div>
  );
}

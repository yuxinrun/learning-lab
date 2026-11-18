"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Flag, NotebookPen } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { LearningGoal } from "@/lib/tool-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DeleteButton, ToolEmpty, ToolHeader } from "./tool-ui";
import { uid } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "请填写目标").max(150),
  description: z.string().max(800),
  deadline: z.string().min(1, "请选择截止日期"),
  stages: z.string().min(1, "请至少填写一个阶段，用逗号分隔"),
});
type FormValues = z.infer<typeof schema>;

export function LearningGoals() {
  const { value: goals, setValue: setGoals, hydrated } = useLocalStorage<LearningGoal[]>(STORAGE_KEYS.goals, []);
  const [showForm, setShowForm] = useState(false);
  const [reviewFor, setReviewFor] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", deadline: "", stages: "" },
  });

  function onSubmit(values: FormValues) {
    setGoals((prev) => [...prev, {
      id: uid(), title: values.title, description: values.description, deadline: values.deadline,
      createdAt: new Date().toISOString().slice(0, 10),
      stages: values.stages.split(/[,，、]/).map((s) => s.trim()).filter(Boolean).map((title) => ({ id: uid(), title, done: false })),
      reviews: [],
    }]);
    reset({ title: "", description: "", deadline: "", stages: "" });
    setShowForm(false);
  }

  const completed = goals.filter((g) => g.stages.length > 0 && g.stages.every((s) => s.done)).length;

  if (!hydrated) return <div className="h-64 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="学习目标规划器"
        description={`${goals.length} 个目标 · 已完成 ${completed} 个`}
        onAdd={() => setShowForm((v) => !v)}
        addLabel={showForm ? "收起表单" : "创建目标"}
        exportFilename="learning-lab-goals.json"
        exportRows={goals}
      />

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label htmlFor="title">目标</Label><Input id="title" placeholder="例如：掌握基础统计推断" {...register("title")} className="mt-2" />{errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}</div>
          <div className="sm:col-span-2"><Label htmlFor="description">描述与完成标准</Label><Textarea id="description" {...register("description")} className="mt-2" /></div>
          <div><Label htmlFor="deadline">截止日期</Label><Input id="deadline" type="date" {...register("deadline")} className="mt-2" />{errors.deadline && <p className="mt-1 text-xs text-destructive">{errors.deadline.message}</p>}</div>
          <div><Label htmlFor="stages">阶段（用逗号分隔）</Label><Input id="stages" placeholder="确定范围，学习概念，完成练习，复盘" {...register("stages")} className="mt-2" />{errors.stages && <p className="mt-1 text-xs text-destructive">{errors.stages.message}</p>}</div>
          <div className="flex gap-2 sm:col-span-2"><Button type="submit">创建目标</Button><Button type="button" variant="ghost" onClick={() => setShowForm(false)}>取消</Button></div>
        </form>
      )}

      {goals.length === 0 ? (
        <ToolEmpty text="还没有学习目标。写一个具体目标，把它拆成几个阶段，然后开始追踪。" />
      ) : (
        <div className="space-y-5">
          {goals.map((g) => {
            const doneCount = g.stages.filter((s) => s.done).length;
            const percent = g.stages.length ? Math.round(doneCount / g.stages.length * 100) : 0;
            return (
              <div key={g.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Flag className="h-4 w-4 text-primary" />
                      <h3 className="font-serif text-xl font-semibold">{g.title}</h3>
                      {percent === 100 && <Badge>已完成</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{g.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">截止 {g.deadline} · 创建于 {g.createdAt}</p>
                  </div>
                  <DeleteButton label="删除" onClick={() => setGoals((prev) => prev.filter((x) => x.id !== g.id))} />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <Progress value={percent} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{percent}%</span>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {g.stages.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setGoals((prev) => prev.map((x) => x.id === g.id ? { ...x, stages: x.stages.map((st) => st.id === s.id ? { ...st, done: !st.done } : st) } : x))}
                      className={`flex items-center gap-3 rounded-md border p-3 text-left text-sm transition-colors ${s.done ? "border-primary/40 bg-primary-soft/40 text-muted-foreground line-through" : "border-border hover:bg-surface"}`}
                    >
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${s.done ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                        {s.done && <Check className="h-3 w-3" />}
                      </span>
                      {s.title}
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t border-border pt-5">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-medium"><NotebookPen className="h-4 w-4 text-primary" />每周回顾 · {g.reviews.length} 次</p>
                    <Button variant="ghost" size="sm" onClick={() => setReviewFor(reviewFor === g.id ? null : g.id)}>{reviewFor === g.id ? "收起" : "添加回顾"}</Button>
                  </div>
                  {reviewFor === g.id && (
                    <div className="mt-3">
                      <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="本周进展、遇到的困难、下周调整" className="min-h-20" />
                      <Button size="sm" className="mt-2" onClick={() => {
                        if (!reviewText.trim()) return;
                        setGoals((prev) => prev.map((x) => x.id === g.id ? { ...x, reviews: [...x.reviews, { date: new Date().toISOString().slice(0, 10), note: reviewText.trim() }] } : x));
                        setReviewText("");
                        setReviewFor(null);
                      }}>保存回顾</Button>
                    </div>
                  )}
                  {g.reviews.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {g.reviews.slice(-3).reverse().map((r, i) => (
                        <li key={`${r.date}-${i}`} className="rounded-md bg-surface/60 p-3 text-sm text-muted-foreground">
                          <span className="mr-2 text-xs font-medium text-foreground">{r.date}</span>{r.note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

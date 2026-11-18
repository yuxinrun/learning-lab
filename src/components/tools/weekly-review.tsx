"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NotebookPen } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { WeeklyReview, StudySession, FocusSession, LearningGoal } from "@/lib/tool-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DeleteButton, ToolEmpty, ToolHeader } from "./tool-ui";
import { uid } from "@/lib/utils";

const schema = z.object({
  weekStart: z.string().min(1, "请选择本周起始日期"),
  minutes: z.coerce.number().min(0).max(100000),
  goalsCompleted: z.string().max(1000),
  newKnowledge: z.string().max(2000),
  bestMethod: z.string().max(1000),
  difficulties: z.string().max(2000),
  nextPlan: z.string().max(2000),
});
type FormValues = z.infer<typeof schema>;

function mondayOf(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export function WeeklyReview() {
  const { value: reviews, setValue: setReviews, hydrated } = useLocalStorage<WeeklyReview[]>(STORAGE_KEYS.reviewNotes, []);
  const { value: sessions } = useLocalStorage<StudySession[]>(STORAGE_KEYS.studySessions, []);
  const { value: focus } = useLocalStorage<FocusSession[]>(STORAGE_KEYS.focus, []);
  const { value: goals } = useLocalStorage<LearningGoal[]>(STORAGE_KEYS.goals, []);
  const [showForm, setShowForm] = useState(true);
  const weekDefault = mondayOf(new Date());
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { weekStart: weekDefault, minutes: 0, goalsCompleted: "", newKnowledge: "", bestMethod: "", difficulties: "", nextPlan: "" },
  });
  const selectedWeek = watch("weekStart");

  const weekSessions = sessions.filter((s) => s.date >= selectedWeek && s.date < new Date(new Date(selectedWeek).getTime() + 7 * 86400000).toISOString().slice(0, 10));
  const focusMinutes = focus.filter((f) => f.date >= selectedWeek).reduce((s, f) => s + f.minutes, 0);
  const derived = weekSessions.reduce((s, x) => s + x.minutes, 0) + focusMinutes;
  const completedGoals = goals.filter((g) => g.stages.length > 0 && g.stages.every((s) => s.done)).length;

  function onSubmit(values: FormValues) {
    setReviews((prev) => [...prev.filter((r) => r.weekStart !== values.weekStart), { id: uid(), ...values }]);
    reset({ ...values, goalsCompleted: "", newKnowledge: "", bestMethod: "", difficulties: "", nextPlan: "" });
  }

  if (!hydrated) return <div className="h-64 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="每周学习复盘"
        description={`共 ${reviews.length} 份复盘 · 基于你本地记录自动生成部分统计`}
        onAdd={() => setShowForm((v) => !v)}
        addLabel={showForm ? "收起表单" : "新建复盘"}
        exportFilename="learning-lab-weekly-reviews.json"
        exportRows={reviews}
      />

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 rounded-lg border border-border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Label htmlFor="weekStart">本周起始日</Label><Input id="weekStart" type="date" {...register("weekStart")} className="mt-2" />{errors.weekStart && <p className="mt-1 text-xs text-destructive">{errors.weekStart.message}</p>}</div>
            <div>
              <Label htmlFor="minutes">本周学习时间（分钟）</Label>
              <Input id="minutes" type="number" {...register("minutes")} className="mt-2" />
              <button type="button" onClick={() => reset({ ...watch(), minutes: derived })} className="mt-2 text-xs text-primary hover:underline">
                使用本地记录统计：{derived} 分钟（学习 {weekSessions.reduce((s, x) => s + x.minutes, 0)} + 专注 {focusMinutes}）
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label htmlFor="goalsCompleted">学习目标完成情况</Label><Textarea id="goalsCompleted" placeholder={`当前共 ${completedGoals} 个目标已全部完成。写下本周推进了哪些目标。`} {...register("goalsCompleted")} className="mt-2 min-h-20" /></div>
            <div><Label htmlFor="newKnowledge">新学知识</Label><Textarea id="newKnowledge" {...register("newKnowledge")} className="mt-2 min-h-24" /></div>
            <div><Label htmlFor="bestMethod">最有效的学习方法</Label><Textarea id="bestMethod" {...register("bestMethod")} className="mt-2 min-h-24" /></div>
            <div><Label htmlFor="difficulties">遇到的困难</Label><Textarea id="difficulties" {...register("difficulties")} className="mt-2 min-h-24" /></div>
            <div><Label htmlFor="nextPlan">下周改进计划</Label><Textarea id="nextPlan" {...register("nextPlan")} className="mt-2 min-h-24" /></div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button type="submit"><NotebookPen className="h-4 w-4" />保存复盘</Button>
            {reviews.some((r) => r.weekStart === selectedWeek) && <Badge>该周已有复盘，保存将覆盖</Badge>}
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <ToolEmpty text="还没有周复盘。每周花 15 分钟回顾一次，比每天追加学习时间更容易发现真正的问题。" />
      ) : (
        <div className="space-y-5">
          {[...reviews].sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1)).map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold">自 {r.weekStart} 起的一周</h3>
                  <p className="mt-1 text-xs text-muted-foreground">记录学习 {r.minutes} 分钟</p>
                </div>
                <DeleteButton label="删除" onClick={() => setReviews((prev) => prev.filter((x) => x.id !== r.id))} />
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["目标完成情况", r.goalsCompleted],
                  ["新学知识", r.newKnowledge],
                  ["最有效的方法", r.bestMethod],
                  ["遇到的困难", r.difficulties],
                  ["下周改进计划", r.nextPlan],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="rounded-md bg-surface/60 p-4">
                    <dt className="section-label mb-2">{k}</dt>
                    <dd className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

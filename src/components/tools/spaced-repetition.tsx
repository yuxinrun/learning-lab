"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarClock, Check, RotateCcw, Sparkles } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { ReviewItem } from "@/lib/tool-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DeleteButton, ToolEmpty, ToolHeader } from "./tool-ui";
import { formatShortDate, uid } from "@/lib/utils";

const schema = z.object({
  item: z.string().min(1, "请填写要复习的内容").max(200),
  topic: z.string().max(60),
  note: z.string().max(500),
  firstDate: z.string().min(1),
  rule: z.enum(["focused", "standard", "relaxed"]),
});
type FormValues = z.infer<typeof schema>;

const intervals: Record<FormValues["rule"], number[]> = {
  focused: [1, 2, 4, 8, 16],
  standard: [1, 3, 7, 16, 35],
  relaxed: [2, 5, 12, 30, 60],
};

function addDays(date: string, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function SpacedRepetition() {
  const { value: items, setValue: setItems, hydrated } = useLocalStorage<ReviewItem[]>(STORAGE_KEYS.reviews, []);
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { item: "", topic: "", note: "", firstDate: today, rule: "standard" },
  });
  const rule = watch("rule");

  const due = items.filter((i) => i.nextDate <= today);

  function onSubmit(values: FormValues) {
    const first = intervals[values.rule][0];
    setItems((prev) => [...prev, {
      id: uid(), item: values.item, note: values.note, topic: values.topic, firstDate: values.firstDate,
      interval: first, nextDate: addDays(values.firstDate, first), mastery: 0, history: [],
    }]);
    reset({ item: "", topic: "", note: "", firstDate: today, rule: values.rule });
    setShowForm(false);
  }

  function review(id: string, result: "again" | "good" | "easy") {
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const steps = intervals.standard;
      let step = i.interval;
      if (result === "again") {
        step = steps[0];
      } else if (result === "good") {
        step = steps[Math.min(steps.indexOf(i.interval) + 1, steps.length - 1)] || steps[1];
      } else {
        step = steps[Math.min(steps.indexOf(i.interval) + 2, steps.length - 1)] || steps[2];
      }
      return {
        ...i,
        interval: step,
        nextDate: addDays(today, step),
        mastery: Math.min(100, i.mastery + (result === "again" ? -20 : result === "good" ? 20 : 35)),
        history: [...i.history, { date: today, result }],
      };
    }));
  }

  const stats = useMemo(() => ({
    total: items.length,
    due: due.length,
    mastered: items.filter((i) => i.mastery >= 80).length,
  }), [items, due.length]);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="间隔重复计划器"
        description={`${stats.total} 个复习项 · 今日待复习 ${stats.due} 项 · 已掌握 ${stats.mastered} 项`}
        onAdd={() => setShowForm((v) => !v)}
        addLabel={showForm ? "收起表单" : "添加复习项"}
        exportFilename="learning-lab-spaced-repetition.json"
        exportRows={items}
      />

      <div className="mb-8 rounded-lg border-l-2 border-primary bg-primary-soft/40 p-5 text-sm leading-relaxed text-foreground/80">
        <p className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4 text-primary" />关于复习间隔</p>
        <p className="mt-2">这里的间隔是可调整的启发式方案，用于辅助安排复习，并不是所有人通用的科学固定周期。请根据自己答对与答错的情况随时修改间隔天数。</p>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="item">需要复习的知识</Label>
            <Input id="item" placeholder="例如：工作记忆的四个组成部分" {...register("item")} className="mt-2" />
            {errors.item && <p className="mt-1 text-xs text-destructive">{errors.item.message}</p>}
          </div>
          <div>
            <Label htmlFor="topic">主题</Label>
            <Input id="topic" placeholder="例如：记忆科学" {...register("topic")} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="firstDate">首次学习日期</Label>
            <Input id="firstDate" type="date" {...register("firstDate")} className="mt-2" />
          </div>
          <div className="sm:col-span-2">
            <Label>复习节奏</Label>
            <Select value={rule} onValueChange={(v) => reset({ ...watch(), rule: v as FormValues["rule"] })}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="focused">紧凑 · {intervals.focused.join(" / ")} 天</SelectItem>
                <SelectItem value="standard">标准 · {intervals.standard.join(" / ")} 天</SelectItem>
                <SelectItem value="relaxed">舒缓 · {intervals.relaxed.join(" / ")} 天</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1.5 text-xs text-muted-foreground">首次间隔：{intervals[rule][0]} 天，之后按复习表现调整。</p>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="note">备注</Label>
            <Textarea id="note" placeholder="补充线索或易错点" {...register("note")} className="mt-2" />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">添加到复习计划</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>取消</Button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <ToolEmpty text="还没有复习项。添加一条需要长期记住的知识，开始安排自己的复习节奏。" />
      ) : (
        <div className="space-y-10">
          {due.length > 0 && (
            <section>
              <h3 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold"><CalendarClock className="h-5 w-5 text-primary" />今日待复习 · {due.length}</h3>
              <div className="space-y-3">
                {due.map((i) => (
                  <div key={i.id} className="rounded-lg border border-primary/30 bg-primary-soft/30 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-serif text-lg font-semibold">{i.item}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{i.topic} · 原定 {formatShortDate(i.nextDate)}</p>
                        {i.note && <p className="mt-2 text-sm text-muted-foreground">{i.note}</p>}
                      </div>
                      <DeleteButton label="删除" onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => review(i.id, "again")}><RotateCcw className="h-3.5 w-3.5" />忘记了</Button>
                      <Button size="sm" onClick={() => review(i.id, "good")}><Check className="h-3.5 w-3.5" />想起来了</Button>
                      <Button size="sm" variant="soft" onClick={() => review(i.id, "easy")}><Sparkles className="h-3.5 w-3.5" />很轻松</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-4 font-serif text-xl font-semibold">全部复习项</h3>
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-serif text-base font-semibold">{i.item}</h4>
                        {i.nextDate <= today && <Badge>待复习</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">下次复习 {formatShortDate(i.nextDate)} · 当前间隔 {i.interval} 天 · 已复习 {i.history.length} 次</p>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={Math.max(0, i.mastery)} className="max-w-52" />
                        <span className="text-xs text-muted-foreground">掌握度 {Math.max(0, i.mastery)}%</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <label htmlFor={`interval-${i.id}`}>调整间隔</label>
                        <Input
                          id={`interval-${i.id}`}
                          type="number"
                          min={1}
                          max={365}
                          defaultValue={i.interval}
                          key={`${i.id}-${i.interval}`}
                          className="h-8 w-20"
                          onBlur={(e) => {
                            const days = Math.max(1, Number(e.target.value) || 1);
                            setItems((prev) => prev.map((x) => x.id === i.id ? { ...x, interval: days, nextDate: addDays(today, days) } : x));
                          }}
                        />
                        <span>天（保存后从今天重新计算）</span>
                      </div>
                    </div>
                    <DeleteButton label="删除" onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

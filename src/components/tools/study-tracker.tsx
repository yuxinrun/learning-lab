"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Pencil, Search } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { StudySession } from "@/lib/tool-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DeleteButton, ToolEmpty, ToolHeader } from "./tool-ui";
import { downloadFile, formatDate, toCSV, uid } from "@/lib/utils";

const schema = z.object({
  date: z.string().min(1, "请选择日期"),
  topic: z.string().min(1, "请填写学习主题").max(80),
  minutes: z.coerce.number().min(1, "时长至少 1 分钟").max(1440),
  content: z.string().max(1000),
  feeling: z.string().max(200),
  outcome: z.string().max(500),
});

type FormValues = z.infer<typeof schema>;
const empty: FormValues = { date: new Date().toISOString().slice(0, 10), topic: "", minutes: 25, content: "", feeling: "", outcome: "" };

export function StudyTracker() {
  const { value: sessions, setValue: setSessions, hydrated } = useLocalStorage<StudySession[]>(STORAGE_KEYS.studySessions, []);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });

  const topics = useMemo(() => [...new Set(sessions.map((s) => s.topic))], [sessions]);
  const filtered = sessions
    .filter((s) => !filter || `${s.topic} ${s.content}`.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const total = sessions.reduce((sum, s) => sum + s.minutes, 0);

  function onSubmit(values: FormValues) {
    if (editing) {
      setSessions((prev) => prev.map((s) => (s.id === editing ? { ...s, ...values } : s)));
    } else {
      setSessions((prev) => [...prev, { id: uid(), ...values }]);
    }
    reset(empty);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(s: StudySession) {
    setEditing(s.id);
    setShowForm(true);
    reset({ date: s.date, topic: s.topic, minutes: s.minutes, content: s.content, feeling: s.feeling, outcome: s.outcome });
  }

  if (!hydrated) return <div className="h-64 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="学习记录器"
        description={`共 ${sessions.length} 条记录 · 累计 ${Math.round(total / 60 * 10) / 10} 小时`}
        onAdd={() => { setEditing(null); reset(empty); setShowForm((v) => !v); }}
        addLabel={showForm ? "收起表单" : "记录学习"}
        exportFilename="learning-lab-study-sessions.json"
        exportRows={sessions}
      />
      {sessions.length > 0 && (
        <div className="mb-6 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => downloadFile("learning-lab-study-sessions.csv", "\uFEFF" + toCSV(sessions), "text/csv;charset=utf-8")}>
            导出 CSV
          </Button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h3 className="font-serif text-lg font-semibold">{editing ? "编辑记录" : "新增学习记录"}</h3>
          </div>
          <div>
            <Label htmlFor="date">日期</Label>
            <Input id="date" type="date" {...register("date")} className="mt-2" />
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="topic">学习主题</Label>
            <Input id="topic" placeholder="例如：工作记忆模型" {...register("topic")} className="mt-2" />
            {errors.topic && <p className="mt-1 text-xs text-destructive">{errors.topic.message}</p>}
          </div>
          <div>
            <Label htmlFor="minutes">时长（分钟）</Label>
            <Input id="minutes" type="number" min={1} {...register("minutes")} className="mt-2" />
            {errors.minutes && <p className="mt-1 text-xs text-destructive">{errors.minutes.message}</p>}
          </div>
          <div>
            <Label htmlFor="feeling">学习感受</Label>
            <Input id="feeling" placeholder="例如：有些吃力但能复述" {...register("feeling")} className="mt-2" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="content">学习内容</Label>
            <Textarea id="content" placeholder="今天学了什么？" {...register("content")} className="mt-2" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="outcome">学习成果</Label>
            <Input id="outcome" placeholder="例如：完成 5 张提取卡片" {...register("outcome")} className="mt-2" />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">{editing ? "保存修改" : "保存记录"}</Button>
            <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>取消</Button>
          </div>
        </form>
      )}

      {topics.length > 1 && (
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="筛选主题或内容" className="pl-9" />
        </div>
      )}

      {filtered.length === 0 ? (
        <ToolEmpty text="还没有学习记录。点击“记录学习”添加第一条，数据只保存在本地。" />
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg font-semibold">{s.topic}</h3>
                    <Badge variant="outline">{s.minutes} 分钟</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(s.date)}</p>
                  {s.content && <p className="mt-3 text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">{s.content}</p>}
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    {s.feeling && <span>感受：{s.feeling}</span>}
                    {s.outcome && <span>成果：{s.outcome}</span>}
                  </div>
                </div>
                <div className="flex shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(s)} aria-label="编辑"><Pencil className="h-4 w-4" /></Button>
                  <DeleteButton label="删除" onClick={() => setSessions((prev) => prev.filter((x) => x.id !== s.id))} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

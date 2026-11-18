"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BookMarked, Star } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { ReadingBook } from "@/lib/tool-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DeleteButton, ToolEmpty, ToolHeader } from "./tool-ui";
import { clamp, downloadFile, toCSV, uid } from "@/lib/utils";

const ReadingProgressChart = dynamic(() => import("@/components/charts/charts").then((m) => m.ReadingProgressChart), { ssr: false });

const schema = z.object({
  title: z.string().min(1, "请填写书名").max(200),
  author: z.string().max(120),
  totalPages: z.coerce.number().min(1, "总页数至少 1").max(20000),
  currentPage: z.coerce.number().min(0).max(20000),
  minutes: z.coerce.number().min(0).max(100000),
  notes: z.string().max(2000),
});
type FormValues = z.infer<typeof schema>;

const today = () => new Date().toISOString().slice(0, 10);

export function ReadingTracker() {
  const { value: books, setValue: setBooks, hydrated } = useLocalStorage<ReadingBook[]>(STORAGE_KEYS.books, []);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", author: "", totalPages: 300, currentPage: 0, minutes: 0, notes: "" },
  });

  function onSubmit(values: FormValues) {
    const page = clamp(values.currentPage, 0, values.totalPages);
    setBooks((prev) => [...prev, {
      id: uid(), title: values.title, author: values.author, totalPages: values.totalPages,
      currentPage: page, minutes: values.minutes, notes: values.notes, favorite: false,
      addedAt: today(), progressLog: page > 0 ? [{ date: today(), pages: page }] : [],
    }]);
    reset({ title: "", author: "", totalPages: 300, currentPage: 0, minutes: 0, notes: "" });
    setShowForm(false);
  }

  function updateProgress(id: string, page: number, minutes: number) {
    setBooks((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      const p = clamp(page, 0, b.totalPages);
      return {
        ...b, currentPage: p, minutes: minutes,
        progressLog: p !== b.currentPage ? [...b.progressLog, { date: today(), pages: p }] : b.progressLog,
      };
    }));
  }

  const totalPages = books.reduce((s, b) => s + b.currentPage, 0);
  const favorites = books.filter((b) => b.favorite).length;
  const log = books.flatMap((b) => b.progressLog).sort((a, b) => a.date < b.date ? -1 : 1).slice(-20);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="阅读记录器"
        description={`${books.length} 本书 · 已读 ${totalPages} 页 · 收藏 ${favorites} 本`}
        onAdd={() => setShowForm((v) => !v)}
        addLabel={showForm ? "收起表单" : "添加书籍"}
        exportFilename="learning-lab-reading-tracker.json"
        exportRows={books}
      />

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
          <div><Label htmlFor="title">书名</Label><Input id="title" {...register("title")} className="mt-2" />{errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}</div>
          <div><Label htmlFor="author">作者</Label><Input id="author" {...register("author")} className="mt-2" /></div>
          <div><Label htmlFor="totalPages">总页数</Label><Input id="totalPages" type="number" {...register("totalPages")} className="mt-2" />{errors.totalPages && <p className="mt-1 text-xs text-destructive">{errors.totalPages.message}</p>}</div>
          <div><Label htmlFor="currentPage">当前页</Label><Input id="currentPage" type="number" {...register("currentPage")} className="mt-2" />{errors.currentPage && <p className="mt-1 text-xs text-destructive">{errors.currentPage.message}</p>}</div>
          <div className="sm:col-span-2"><Label htmlFor="minutes">已投入阅读时间（分钟）</Label><Input id="minutes" type="number" {...register("minutes")} className="mt-2" /></div>
          <div className="sm:col-span-2"><Label htmlFor="notes">阅读笔记</Label><Textarea id="notes" {...register("notes")} className="mt-2" /></div>
          <div className="flex gap-2 sm:col-span-2"><Button type="submit">保存书籍</Button><Button type="button" variant="ghost" onClick={() => setShowForm(false)}>取消</Button></div>
        </form>
      )}

      {books.length > 0 && (
        <section className="mb-10 rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">阅读进度趋势</h3>
          <ReadingProgressChart data={log} />
          <p className="mt-2 text-[11px] text-muted-foreground">数据来自你记录的阅读页数；尚无记录时显示空状态。</p>
        </section>
      )}

      {books.length === 0 ? (
        <ToolEmpty text="还没有阅读记录。添加一本书，开始记录进度、时间与笔记。" />
      ) : (
        <div className="space-y-4">
          {books.map((b) => {
            const percent = Math.round(b.currentPage / b.totalPages * 100);
            return (
              <div key={b.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <BookMarked className="h-4 w-4 text-primary" />
                      <h3 className="font-serif text-lg font-semibold">{b.title}</h3>
                      {b.favorite && <Badge>收藏</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{b.author || "作者未填写"} · {b.minutes} 分钟 · 添加于 {b.addedAt}</p>
                  </div>
                  <div className="flex shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => setBooks((prev) => prev.map((x) => x.id === b.id ? { ...x, favorite: !x.favorite } : x))} aria-label="切换收藏">
                      <Star className={`h-4 w-4 ${b.favorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </Button>
                    <DeleteButton label="删除" onClick={() => setBooks((prev) => prev.filter((x) => x.id !== b.id))} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Progress value={percent} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{percent}%</span>
                </div>
                <div className="mt-4 flex flex-wrap items-end gap-3">
                  <div><Label htmlFor={`page-${b.id}`} className="text-xs">当前页</Label><Input id={`page-${b.id}`} type="number" min={0} max={b.totalPages} defaultValue={b.currentPage} key={`${b.id}-${b.currentPage}`} className="mt-1 h-9 w-24" onBlur={(e) => updateProgress(b.id, Number(e.target.value), b.minutes)} /></div>
                  <div><Label htmlFor={`min-${b.id}`} className="text-xs">阅读分钟</Label><Input id={`min-${b.id}`} type="number" min={0} defaultValue={b.minutes} key={`${b.id}-min-${b.minutes}`} className="mt-1 h-9 w-24" onBlur={(e) => updateProgress(b.id, b.currentPage, Number(e.target.value))} /></div>
                  <Button size="sm" variant="outline" onClick={() => updateProgress(b.id, b.currentPage + 10, b.minutes)}>读了 10 页</Button>
                </div>
                <Textarea
                  aria-label={`${b.title} 的阅读笔记`}
                  defaultValue={b.notes}
                  key={`${b.id}-notes-${b.notes}`}
                  onBlur={(e) => setBooks((prev) => prev.map((x) => x.id === b.id ? { ...x, notes: e.target.value } : x))}
                  className="mt-4 min-h-16 text-sm"
                  placeholder="记录阅读笔记，失焦时自动保存"
                />
              </div>
            );
          })}
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => downloadFile("learning-lab-reading-tracker.csv", "\uFEFF" + toCSV(books), "text/csv;charset=utf-8")}>导出 CSV</Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileText, Pencil, Search, Star } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { KnowledgeCard } from "@/lib/tool-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DeleteButton, ToolEmpty, ToolHeader } from "./tool-ui";
import { uid } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "请填写标题").max(200),
  body: z.string().min(1, "请填写正文").max(10000),
  tags: z.string().max(200),
  category: z.string().max(60),
  linkedTopic: z.string().max(100),
});
type FormValues = z.infer<typeof schema>;

const empty: FormValues = { title: "", body: "", tags: "", category: "", linkedTopic: "" };

export function KnowledgeCards() {
  const { value: cards, setValue: setCards, hydrated } = useLocalStorage<KnowledgeCard[]>(STORAGE_KEYS.cards, []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("全部");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });

  const tags = useMemo(() => ["全部", ...Array.from(new Set(cards.flatMap((c) => c.tags)))], [cards]);
  const filtered = cards.filter((c) => {
    const q = query.trim().toLowerCase();
    return (!q || `${c.title} ${c.body} ${c.tags.join(" ")}`.toLowerCase().includes(q))
      && (tag === "全部" || c.tags.includes(tag))
      && (!favoritesOnly || c.favorite);
  }).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  function onSubmit(values: FormValues) {
    const tagsList = values.tags.split(/[,，、]/).map((t) => t.trim()).filter(Boolean);
    const now = new Date().toISOString().slice(0, 10);
    if (editing) {
      setCards((prev) => prev.map((c) => c.id === editing ? { ...c, ...values, tags: tagsList, updatedAt: now } : c));
    } else {
      setCards((prev) => [...prev, { id: uid(), ...values, tags: tagsList, favorite: false, createdAt: now, updatedAt: now }]);
    }
    reset(empty);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(c: KnowledgeCard) {
    setEditing(c.id);
    setShowForm(true);
    reset({ title: c.title, body: c.body, tags: c.tags.join(", "), category: c.category, linkedTopic: c.linkedTopic });
  }

  if (!hydrated) return <div className="h-64 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="知识卡片"
        description={`${cards.length} 张卡片 · 支持 Markdown、标签、分类、搜索与关联主题`}
        onAdd={() => { setEditing(null); reset(empty); setShowForm((v) => !v); }}
        addLabel={showForm ? "收起表单" : "新建卡片"}
        exportFilename="learning-lab-knowledge-cards.json"
        exportRows={cards}
      />

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label htmlFor="title">标题</Label><Input id="title" placeholder="一张卡片只表达一个观点" {...register("title")} className="mt-2" />{errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}</div>
          <div className="sm:col-span-2">
            <Label htmlFor="body">正文（Markdown）</Label>
            <Textarea id="body" placeholder={"支持 **加粗**、# 标题、- 列表、`代码` 等语法"} {...register("body")} className="mt-2 min-h-40 font-mono text-sm" />
            {errors.body && <p className="mt-1 text-xs text-destructive">{errors.body.message}</p>}
          </div>
          <div><Label htmlFor="tags">标签（逗号分隔）</Label><Input id="tags" placeholder="记忆, 方法" {...register("tags")} className="mt-2" /></div>
          <div><Label htmlFor="category">分类</Label><Input id="category" placeholder="例如：学习笔记" {...register("category")} className="mt-2" /></div>
          <div className="sm:col-span-2"><Label htmlFor="linkedTopic">关联主题</Label><Input id="linkedTopic" placeholder="例如：/memory/forgetting-curve" {...register("linkedTopic")} className="mt-2" /></div>
          <div className="flex gap-2 sm:col-span-2"><Button type="submit">{editing ? "保存修改" : "创建卡片"}</Button><Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }}>取消</Button></div>
        </form>
      )}

      {cards.length > 0 && (
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 12).map((t) => (
              <button key={t} onClick={() => setTag(t)} className={`rounded-full px-3 py-1.5 text-xs transition-colors ${tag === t ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant={favoritesOnly ? "soft" : "outline"} size="sm" onClick={() => setFavoritesOnly((v) => !v)}><Star className={`h-3.5 w-3.5 ${favoritesOnly ? "fill-primary text-primary" : ""}`} />收藏</Button>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索卡片" className="pl-9" />
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <ToolEmpty text={cards.length ? "没有匹配的卡片，换个筛选条件试试。" : "还没有知识卡片。用自己的话写一张只表达一个观点的卡片。"} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((c) => (
            <div key={c.id} className="flex flex-col rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-semibold">{c.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.category || "未分类"} · 更新于 {c.updatedAt}</p>
                </div>
                <div className="flex shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setCards((prev) => prev.map((x) => x.id === c.id ? { ...x, favorite: !x.favorite } : x))} aria-label="切换收藏">
                    <Star className={`h-4 w-4 ${c.favorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(c)} aria-label="编辑"><Pencil className="h-4 w-4" /></Button>
                  <DeleteButton label="删除" onClick={() => setCards((prev) => prev.filter((x) => x.id !== c.id))} />
                </div>
              </div>
              <div className="prose-article mt-4 max-w-none text-[14px] leading-relaxed [&>*:first-child]:mt-0">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.body}</ReactMarkdown>
              </div>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                {c.tags.map((t) => <Badge key={t} variant="muted">{t}</Badge>)}
                {c.linkedTopic && <a href={c.linkedTopic} className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><FileText className="h-3 w-3" />关联主题</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

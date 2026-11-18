"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, Clock3, Flame, Layers3, Target } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { StudySession, FocusSession, LearningGoal, ReadingBook, ReviewItem } from "@/lib/tool-data";
import { ToolHeader } from "./tool-ui";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn, uid } from "@/lib/utils";

const {
  WeeklyStudyChart, MonthlyTrendChart, TopicDistributionChart, GoalProgressChart,
  ReadingProgressChart, FocusDurationChart, ActivityCalendarChart, StreakChart,
} = {
  WeeklyStudyChart: dynamic(() => import("@/components/charts/charts").then((m) => m.WeeklyStudyChart), { ssr: false }),
  MonthlyTrendChart: dynamic(() => import("@/components/charts/charts").then((m) => m.MonthlyTrendChart), { ssr: false }),
  TopicDistributionChart: dynamic(() => import("@/components/charts/charts").then((m) => m.TopicDistributionChart), { ssr: false }),
  GoalProgressChart: dynamic(() => import("@/components/charts/charts").then((m) => m.GoalProgressChart), { ssr: false }),
  ReadingProgressChart: dynamic(() => import("@/components/charts/charts").then((m) => m.ReadingProgressChart), { ssr: false }),
  FocusDurationChart: dynamic(() => import("@/components/charts/charts").then((m) => m.FocusDurationChart), { ssr: false }),
  ActivityCalendarChart: dynamic(() => import("@/components/charts/charts").then((m) => m.ActivityCalendarChart), { ssr: false }),
  StreakChart: dynamic(() => import("@/components/charts/charts").then((m) => m.StreakChart), { ssr: false }),
};

function iso(d: Date) { return d.toISOString().slice(0, 10); }
function shift(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return iso(d); }

function demoData() {
  const sessions: StudySession[] = Array.from({ length: 28 }, (_, i) => ({
    id: uid(), date: shift(-i), topic: ["记忆科学", "学习方法", "阅读", "思维"][i % 4],
    minutes: [25, 40, 30, 55, 20][i % 5], content: "Demo Data", feeling: "", outcome: "",
  }));
  const focus: FocusSession[] = Array.from({ length: 14 }, (_, i) => ({
    id: uid(), date: shift(-i), minutes: [25, 45, 25, 30][i % 4], mode: "classic", completed: true,
  }));
  const goals: LearningGoal[] = [{
    id: "demo-goal", title: "Demo Data · 示例目标", description: "仅用于预览图表", deadline: shift(30), createdAt: shift(-30),
    stages: Array.from({ length: 5 }, (_, i) => ({ id: `ds-${i}`, title: `阶段 ${i + 1}`, done: i < 3 })), reviews: [],
  }];
  const books: ReadingBook[] = [{
    id: "demo-book", title: "Demo Data · 示例书籍", author: "示例", totalPages: 300, currentPage: 180, minutes: 240,
    notes: "", favorite: false, addedAt: shift(-20),
    progressLog: Array.from({ length: 8 }, (_, i) => ({ date: shift(-20 + i * 3), pages: 20 + i * 20 })),
  }];
  return { sessions, focus, goals, books };
}

function ChartCard({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border border-border bg-card p-6", className)}>
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Dashboard() {
  const { value: sessions, hydrated } = useLocalStorage<StudySession[]>(STORAGE_KEYS.studySessions, []);
  const { value: focus } = useLocalStorage<FocusSession[]>(STORAGE_KEYS.focus, []);
  const { value: goals } = useLocalStorage<LearningGoal[]>(STORAGE_KEYS.goals, []);
  const { value: books } = useLocalStorage<ReadingBook[]>(STORAGE_KEYS.books, []);
  const { value: reviews } = useLocalStorage<ReviewItem[]>(STORAGE_KEYS.reviews, []);
  const [demo, setDemo] = useState(false);

  const data = useMemo(() => (demo ? demoData() : { sessions, focus, goals, books }), [demo, sessions, focus, goals, books]);

  const stats = useMemo(() => {
    const today = iso(new Date());
    const weekStart = shift(-6);
    const todayMinutes = data.sessions.filter((s) => s.date === today).reduce((s, x) => s + x.minutes, 0)
      + data.focus.filter((f) => f.date === today).reduce((s, x) => s + x.minutes, 0);
    const weekMinutes = data.sessions.filter((s) => s.date >= weekStart).reduce((s, x) => s + x.minutes, 0)
      + data.focus.filter((f) => f.date >= weekStart).reduce((s, x) => s + x.minutes, 0);
    const allDates = [...data.sessions.map((s) => s.date), ...data.focus.map((f) => f.date), ...reviews.map((r) => r.firstDate)];
    const unique = [...new Set(allDates)].sort().reverse();
    let streak = 0;
    let cursor = new Date();
    if (unique[0] && unique[0] !== today) cursor = new Date(unique[0]);
    for (;;) {
      if (!unique.includes(iso(cursor))) break;
      streak += 1;
      cursor = new Date(cursor.getTime() - 86400000);
    }
    const allStages = data.goals.flatMap((g) => g.stages);
    const doneStages = allStages.filter((s) => s.done).length;
    return { todayMinutes, weekMinutes, streak, goalPercent: allStages.length ? Math.round(doneStages / allStages.length * 100) : 0, unique };
  }, [data, reviews]);

  const weekly = Array.from({ length: 7 }, (_, i) => {
    const d = shift(i - 6);
    const label = new Date(d).toLocaleDateString("zh-CN", { weekday: "short" });
    const minutes = data.sessions.filter((s) => s.date === d).reduce((s, x) => s + x.minutes, 0)
      + data.focus.filter((f) => f.date === d).reduce((s, x) => s + x.minutes, 0);
    return { label, minutes };
  });

  const monthly = Array.from({ length: 30 }, (_, i) => {
    const d = shift(i - 29);
    const minutes = data.sessions.filter((s) => s.date === d).reduce((s, x) => s + x.minutes, 0)
      + data.focus.filter((f) => f.date === d).reduce((s, x) => s + x.minutes, 0);
    return { label: d.slice(5), minutes };
  });

  const topics = Object.entries(data.sessions.reduce<Record<string, number>>((acc, s) => { acc[s.topic || "未分类"] = (acc[s.topic || "未分类"] ?? 0) + 1; return acc; }, {}))
    .map(([name, value]) => ({ name, value }));

  const focusDaily = Object.entries(data.focus.reduce<Record<string, number>>((acc, f) => { acc[f.date] = (acc[f.date] ?? 0) + f.minutes; return acc; }, {}))
    .sort(([a], [b]) => (a < b ? -1 : 1)).slice(-14).map(([date, minutes]) => ({ date, minutes }));

  const readingLog = data.books.flatMap((b) => b.progressLog).sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-20);

  const activity = stats.unique.map((date) => ({
    date,
    count: data.sessions.filter((s) => s.date === date).length + data.focus.filter((f) => f.date === date).length,
  }));

  const streakSeries = Array.from({ length: 14 }, (_, i) => {
    const d = shift(i - 13);
    let count = 0;
    let cur = new Date(d);
    while (stats.unique.includes(iso(cur))) { count++; cur = new Date(cur.getTime() - 86400000); }
    return { label: d.slice(5), days: count };
  });

  const recent = [...data.sessions.map((s) => ({ id: s.id, date: s.date, title: s.topic, minutes: s.minutes, type: "学习" })),
    ...data.focus.map((f) => ({ id: f.id, date: f.date, title: `${f.mode === "pomodoro" ? "番茄钟" : "专注"}时段`, minutes: f.minutes, type: "专注" }))]
    .sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="学习仪表盘"
        description="汇总你在其他工具中真实记录的数据。没有记录时图表显示空状态，不会伪造学习数据。"
      />

      <div className="mb-8 flex flex-col gap-3 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Label htmlFor="demo-toggle" className="cursor-pointer">预览示例数据（Demo Data）</Label>
          <p className="mt-1 text-xs text-muted-foreground">开启后仅在此页面临时显示示例图表，不会写入你的本地记录。</p>
        </div>
        <div className="flex items-center gap-3">
          {demo && <Badge variant="soft">Demo Data · 非真实学习记录</Badge>}
          <Switch id="demo-toggle" checked={demo} onCheckedChange={setDemo} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "今日学习", value: `${stats.todayMinutes}`, unit: "分钟", icon: Clock3 },
          { label: "近 7 天", value: `${stats.weekMinutes}`, unit: "分钟", icon: CalendarDays },
          { label: "连续记录", value: `${stats.streak}`, unit: "天", icon: Flame },
          { label: "目标完成度", value: `${stats.goalPercent}`, unit: "%", icon: Target },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold">{s.value}<span className="ml-1 text-sm font-normal text-muted-foreground">{s.unit}</span></p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="每周学习时间" subtitle="最近 7 天，来自学习记录与专注计时">
          <WeeklyStudyChart data={weekly} />
        </ChartCard>
        <ChartCard title="每月学习趋势" subtitle="最近 30 天的每日时长">
          <MonthlyTrendChart data={monthly} />
        </ChartCard>
        <ChartCard title="学习主题分布" subtitle="按学习记录中填写的主题统计次数">
          <TopicDistributionChart data={topics} />
        </ChartCard>
        <ChartCard title="学习目标完成进度" subtitle="所有目标阶段中已完成的比例">
          <GoalProgressChart value={stats.goalPercent} />
          <Link href="/tools/learning-goals" className="mt-3 inline-flex items-center gap-1 text-xs text-primary">管理目标 <ArrowUpRight className="h-3 w-3" /></Link>
        </ChartCard>
        <ChartCard title="阅读进度趋势" subtitle="来自阅读记录器的页数更新">
          <ReadingProgressChart data={readingLog} />
        </ChartCard>
        <ChartCard title="每日专注时长" subtitle="来自专注计时器的已完成时段">
          <FocusDurationChart data={focusDaily} />
        </ChartCard>
        <ChartCard title="学习与复习活动日历" subtitle="有记录的日期与当日活动次数" className="lg:col-span-2">
          <ActivityCalendarChart data={activity} year={new Date().getFullYear()} />
        </ChartCard>
        <ChartCard title="连续记录" subtitle="最近 14 天，按有记录的日期计算" className="lg:col-span-2">
          <StreakChart data={streakSeries} />
        </ChartCard>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">最近学习记录</h3>
          <Link href="/tools/study-tracker" className="inline-flex items-center gap-1 text-xs text-primary">查看全部 <ArrowUpRight className="h-3 w-3" /></Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-6 rounded-md border border-dashed border-border bg-surface/40 py-12 text-center text-sm text-muted-foreground">还没有学习记录。先从 Study Tracker 记一条，或在上方开启 Demo Data 预览图表。</p>
        ) : (
          <ul className="mt-5 divide-y divide-border">
            {recent.map((r) => (
              <li key={`${r.type}-${r.id}`} className="flex items-center justify-between py-3 text-sm">
                <span className="flex items-center gap-2">
                  {r.type === "学习" ? <BookOpen className="h-4 w-4 text-primary" /> : <Layers3 className="h-4 w-4 text-primary" />}
                  <span>{r.title}</span>
                </span>
                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{r.date}</span><span>{r.minutes} 分钟</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

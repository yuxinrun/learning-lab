"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Coffee, Pause, Play, RotateCcw, SkipForward, Timer } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { FocusSession } from "@/lib/tool-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ToolEmpty, ToolHeader } from "./tool-ui";
import { uid } from "@/lib/utils";

const FocusDurationChart = dynamic(() => import("@/components/charts/charts").then((m) => m.FocusDurationChart), { ssr: false });

export function FocusTimer() {
  const { value: sessions, setValue: setSessions, hydrated } = useLocalStorage<FocusSession[]>(STORAGE_KEYS.focus, []);
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [mode, setMode] = useState<"classic" | "pomodoro">("classic");
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(focusMin * 60);
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState(0);
  const completeRef = useRef<() => void>(() => {});

  const total = (phase === "focus" ? focusMin : breakMin) * 60;
  const progress = total ? Math.max(0, Math.min(1, 1 - left / total)) : 0;
  const mins = String(Math.floor(left / 60)).padStart(2, "0");
  const secs = String(left % 60).padStart(2, "0");

  const complete = useCallback(() => {
    setRunning(false);
    if (phase === "focus") {
      setSessions((prev) => [...prev, { id: uid(), date: new Date().toISOString().slice(0, 10), minutes: focusMin, mode, completed: true }]);
      setRounds((r) => r + 1);
      setPhase("break");
      setLeft(breakMin * 60);
    } else {
      setPhase("focus");
      setLeft(focusMin * 60);
    }
  }, [phase, focusMin, breakMin, mode, setSessions]);

  completeRef.current = complete;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left === 0 && running) completeRef.current();
  }, [left, running]);

  function reset() {
    setRunning(false);
    setPhase("focus");
    setLeft(focusMin * 60);
  }

  function applyFocus(v: number) {
    const n = Math.max(1, Math.min(180, v || 25));
    setFocusMin(n);
    if (phase === "focus" && !running) setLeft(n * 60);
  }

  function applyBreak(v: number) {
    const n = Math.max(1, Math.min(60, v || 5));
    setBreakMin(n);
    if (phase === "break" && !running) setLeft(n * 60);
  }

  const chartData = Object.entries(
    sessions.reduce<Record<string, number>>((acc, s) => { acc[s.date] = (acc[s.date] ?? 0) + s.minutes; return acc; }, {}),
  ).sort(([a], [b]) => (a < b ? -1 : 1)).slice(-14).map(([date, minutes]) => ({ date, minutes }));

  if (!hydrated) return <div className="h-64 animate-pulse rounded-lg bg-surface" />;

  return (
    <div>
      <ToolHeader
        title="专注学习计时器"
        description={`已完成 ${sessions.length} 次专注 · 累计 ${sessions.reduce((s, x) => s + x.minutes, 0)} 分钟`}
        exportFilename="learning-lab-focus-sessions.json"
        exportRows={sessions}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col items-center rounded-lg border border-border bg-card p-8">
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant={mode === "classic" ? "soft" : "outline"} size="sm" onClick={() => { setMode("classic"); setFocusMin(25); setBreakMin(5); if (!running) setLeft(25 * 60); }}>经典模式</Button>
            <Button variant={mode === "pomodoro" ? "soft" : "outline"} size="sm" onClick={() => { setMode("pomodoro"); setFocusMin(25); setBreakMin(5); if (!running) setLeft(25 * 60); }}>番茄钟模式 · 第 {rounds} 轮</Button>
          </div>

          <div className="relative mt-10 h-64 w-64">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle cx="100" cy="100" r="88" fill="none" stroke="hsl(var(--surface-2))" strokeWidth="10" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="hsl(var(--primary))" strokeWidth="10" strokeLinecap="round" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - progress)} className="transition-all duration-500" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {phase === "focus" ? <Timer className="h-3.5 w-3.5" /> : <Coffee className="h-3.5 w-3.5" />}
                {phase === "focus" ? "专注中" : "休息中"}
              </span>
              <span className="mt-2 font-mono text-5xl font-semibold tracking-tight">{mins}:{secs}</span>
              <span className="mt-2 text-xs text-muted-foreground">{Math.round(progress * 100)}% 已完成</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => setRunning((v) => !v)}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "暂停" : left === total ? "开始" : "继续"}
            </Button>
            <Button size="lg" variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" />重置</Button>
            <Button size="lg" variant="ghost" onClick={complete}><SkipForward className="h-4 w-4" />结束本段</Button>
          </div>
          <p className="mt-6 max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
            专注时段结束后会自动记录一次学习。点击“结束本段”可提前完成并记录。
          </p>
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-serif text-lg font-semibold">时长设置</h3>
            <div className="mt-5 space-y-4">
              <div><Label htmlFor="focusMin">专注时长（分钟）</Label><Input id="focusMin" type="number" min={1} max={180} value={focusMin} onChange={(e) => applyFocus(Number(e.target.value))} className="mt-2" /></div>
              <div><Label htmlFor="breakMin">休息时长（分钟）</Label><Input id="breakMin" type="number" min={1} max={60} value={breakMin} onChange={(e) => applyBreak(Number(e.target.value))} className="mt-2" /></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {[15, 25, 45, 60].map((n) => <Button key={n} variant={focusMin === n ? "soft" : "outline"} size="sm" onClick={() => applyFocus(n)}>{n} 分钟</Button>)}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-serif text-lg font-semibold">最近记录</h3>
            {sessions.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">还没有完成的专注时段。</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {sessions.slice(-5).reverse().map((s) => (
                  <li key={s.id} className="flex items-center justify-between border-b border-border pb-2 text-sm last:border-0">
                    <span className="text-muted-foreground">{s.date}</span>
                    <span className="flex items-center gap-2"><Badge variant="muted">{s.mode === "pomodoro" ? "番茄钟" : "经典"}</Badge>{s.minutes} 分钟</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {chartData.length > 0 && (
        <section className="mt-10 rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">每日专注时长</h3>
          <FocusDurationChart data={chartData} />
        </section>
      )}
      {sessions.length === 0 && <div className="mt-8"><ToolEmpty text="完成一个专注时段后，这里会出现每日专注时长统计。" /></div>}
    </div>
  );
}

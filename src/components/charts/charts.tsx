"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

const EChart = dynamic(() => import("./echart"), {
  ssr: false,
  loading: () => <Skeleton className="h-[280px] w-full" />,
});

function usePalette() {
  const { resolvedTheme } = useTheme();
  return useMemo(() => {
    const dark = resolvedTheme === "dark";
    return {
      axis: dark ? "#A8B0A8" : "#737A74",
      split: dark ? "#2A352D" : "#E7E4DA",
      text: dark ? "#E8E6DE" : "#252B27",
      series: [dark ? "#8FB08F" : "#7C947C", dark ? "#8FA8B8" : "#8FA8B8", "#C8B79A", "#A3A97F"],
      bg: dark ? "#18221B" : "#FFFFFF",
    };
  }, [resolvedTheme]);
}

function baseTooltip(p: ReturnType<typeof usePalette>) {
  return {
    backgroundColor: p.bg,
    borderColor: p.split,
    textStyle: { color: p.text, fontSize: 12 },
    extraCssText: "box-shadow:0 8px 24px rgba(37,43,39,.12);border-radius:6px;",
  };
}

export function WeeklyStudyChart({ data }: { data: { label: string; minutes: number }[] }) {
  const p = usePalette();
  const option = useMemo(
    () => ({
      color: p.series,
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, ...baseTooltip(p), valueFormatter: (v: number) => `${v} 分钟` },
      grid: { left: 8, right: 12, top: 28, bottom: 4, containLabel: true },
      xAxis: { type: "category", data: data.map((d) => d.label), axisLine: { lineStyle: { color: p.split } }, axisTick: { show: false }, axisLabel: { color: p.axis, fontSize: 11 } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: p.split, type: "dashed" } }, axisLabel: { color: p.axis, fontSize: 11 } },
      series: [{ type: "bar", name: "学习时长", data: data.map((d) => d.minutes), barMaxWidth: 36, itemStyle: { borderRadius: [3, 3, 0, 0] } }],
    }),
    [data, p],
  );
  return <EChart option={option} empty={data.length === 0} />;
}

export function MonthlyTrendChart({ data }: { data: { label: string; minutes: number }[] }) {
  const p = usePalette();
  const option = useMemo(
    () => ({
      color: p.series,
      tooltip: { trigger: "axis", ...baseTooltip(p), valueFormatter: (v: number) => `${v} 分钟` },
      grid: { left: 8, right: 12, top: 28, bottom: 4, containLabel: true },
      xAxis: { type: "category", boundaryGap: false, data: data.map((d) => d.label), axisLine: { lineStyle: { color: p.split } }, axisTick: { show: false }, axisLabel: { color: p.axis, fontSize: 11 } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: p.split, type: "dashed" } }, axisLabel: { color: p.axis, fontSize: 11 } },
      series: [{ type: "line", name: "学习时长", smooth: 0.3, showSymbol: true, symbolSize: 6, data: data.map((d) => d.minutes), areaStyle: { opacity: 0.1 }, lineStyle: { width: 2.5 } }],
    }),
    [data, p],
  );
  return <EChart option={option} empty={data.length === 0} />;
}

export function TopicDistributionChart({ data }: { data: { name: string; value: number }[] }) {
  const p = usePalette();
  const option = useMemo(
    () => ({
      color: p.series,
      tooltip: { trigger: "item", ...baseTooltip(p), valueFormatter: (v: number) => `${v} 次` },
      legend: { bottom: 0, textStyle: { color: p.axis, fontSize: 11 }, icon: "circle", itemWidth: 8, itemHeight: 8 },
      series: [
        {
          type: "pie",
          radius: ["48%", "72%"],
          center: ["50%", "43%"],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: p.bg, borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 13, fontWeight: 600, color: p.text } },
          data,
        },
      ],
    }),
    [data, p],
  );
  return <EChart option={option} empty={data.length === 0} height={260} />;
}

export function GoalProgressChart({ value, label }: { value: number; label?: string }) {
  const p = usePalette();
  const option = useMemo(
    () => ({
      series: [
        {
          type: "gauge",
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          radius: "92%",
          center: ["50%", "58%"],
          progress: { show: true, width: 12, roundCap: true, itemStyle: { color: p.series[0] } },
          axisLine: { roundCap: true, lineStyle: { width: 12, color: [[1, p.split]] } },
          pointer: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          anchor: { show: false },
          title: { show: false },
          detail: {
            valueAnimation: true,
            offsetCenter: [0, "0%"],
            fontSize: 28,
            fontWeight: 600,
            color: p.text,
            formatter: "{value}%",
          },
          data: [{ value: Math.round(value), name: label ?? "完成度" }],
        },
      ],
    }),
    [value, label, p],
  );
  return <EChart option={option} height={220} />;
}

export function ReadingProgressChart({ data }: { data: { date: string; pages: number }[] }) {
  const p = usePalette();
  const option = useMemo(
    () => ({
      color: p.series,
      tooltip: { trigger: "axis", ...baseTooltip(p), valueFormatter: (v: number) => `${v} 页` },
      grid: { left: 8, right: 12, top: 28, bottom: 4, containLabel: true },
      xAxis: { type: "category", data: data.map((d) => d.date.slice(5)), axisLine: { lineStyle: { color: p.split } }, axisTick: { show: false }, axisLabel: { color: p.axis, fontSize: 11 } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: p.split, type: "dashed" } }, axisLabel: { color: p.axis, fontSize: 11 } },
      series: [{ type: "line", name: "阅读页数", smooth: true, data: data.map((d) => d.pages), lineStyle: { width: 2.5 }, itemStyle: { color: p.series[1] }, areaStyle: { opacity: 0.12 } }],
    }),
    [data, p],
  );
  return <EChart option={option} empty={data.length === 0} height={240} />;
}

export function FocusDurationChart({ data }: { data: { date: string; minutes: number }[] }) {
  const p = usePalette();
  const option = useMemo(
    () => ({
      color: p.series,
      tooltip: { trigger: "axis", ...baseTooltip(p), valueFormatter: (v: number) => `${v} 分钟` },
      grid: { left: 8, right: 12, top: 28, bottom: 4, containLabel: true },
      xAxis: { type: "category", data: data.map((d) => d.date.slice(5)), axisLine: { lineStyle: { color: p.split } }, axisTick: { show: false }, axisLabel: { color: p.axis, fontSize: 11 } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: p.split, type: "dashed" } }, axisLabel: { color: p.axis, fontSize: 11 } },
      series: [{ type: "bar", name: "专注时长", data: data.map((d) => d.minutes), barMaxWidth: 24, itemStyle: { color: p.series[3], borderRadius: [3, 3, 0, 0] } }],
    }),
    [data, p],
  );
  return <EChart option={option} empty={data.length === 0} height={240} />;
}

export function ActivityCalendarChart({ data, year }: { data: { date: string; count: number }[]; year: number }) {
  const p = usePalette();
  const max = Math.max(1, ...data.map((d) => d.count));
  const option = useMemo(
    () => ({
      tooltip: { ...baseTooltip(p), formatter: (params: { value: [string, number] }) => `${params.value[0]} · ${params.value[1]} 次活动` },
      visualMap: { min: 0, max, calculable: false, orient: "horizontal", left: "right", top: 0, itemWidth: 12, itemHeight: 90, text: ["多", "少"], textStyle: { color: p.axis, fontSize: 10 }, inRange: { color: [p.split, p.series[0], p.series[1]] } },
      calendar: {
        top: 40,
        left: 30,
        right: 30,
        cellSize: ["auto", 16],
        range: String(year),
        itemStyle: { color: "transparent", borderColor: p.bg, borderWidth: 2 },
        yearLabel: { show: false },
        monthLabel: { color: p.axis, fontSize: 10, nameMap: "cn" },
        dayLabel: { color: p.axis, fontSize: 10, nameMap: "cn", firstDay: 1 },
        splitLine: { lineStyle: { color: p.split } },
      },
      series: [{ type: "heatmap", coordinateSystem: "calendar", data: data.map((d) => [d.date, d.count]) }],
    }),
    [data, year, max, p],
  );
  return <EChart option={option} empty={data.length === 0} height={220} />;
}

export function StreakChart({ data }: { data: { label: string; days: number }[] }) {
  const p = usePalette();
  const option = useMemo(
    () => ({
      color: p.series,
      tooltip: { trigger: "axis", ...baseTooltip(p), valueFormatter: (v: number) => `${v} 天` },
      grid: { left: 8, right: 12, top: 28, bottom: 4, containLabel: true },
      xAxis: { type: "category", data: data.map((d) => d.label), axisLine: { lineStyle: { color: p.split } }, axisTick: { show: false }, axisLabel: { color: p.axis, fontSize: 11 } },
      yAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: p.split, type: "dashed" } }, axisLabel: { color: p.axis, fontSize: 11 } },
      series: [{ type: "line", step: "end", name: "连续天数", data: data.map((d) => d.days), lineStyle: { width: 2 }, areaStyle: { opacity: 0.1 }, itemStyle: { color: p.series[3] } }],
    }),
    [data, p],
  );
  return <EChart option={option} empty={data.length === 0} height={220} />;
}

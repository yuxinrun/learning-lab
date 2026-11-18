"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart, HeatmapChart, GaugeChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CalendarComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart3 } from "lucide-react";

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  HeatmapChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CalendarComponent,
  CanvasRenderer,
]);

export interface EChartProps {
  option: echarts.EChartsCoreOption;
  height?: number;
  empty?: boolean;
  emptyText?: string;
}

export default function EChart({ option, height = 280, empty, emptyText = "还没有足够的数据，记录几次学习后这里会显示图表。" }: EChartProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || empty) return;
    const chart = echarts.init(ref.current, undefined, { renderer: "canvas" });
    chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option, empty]);

  if (empty) {
    return (
      <div
        style={{ height }}
        className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface/40 text-center"
      >
        <BarChart3 className="h-6 w-6 text-muted-foreground/70" />
        <p className="max-w-xs px-4 text-xs leading-relaxed text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return <div ref={ref} style={{ height }} className="w-full" role="img" aria-label="数据图表" />;
}

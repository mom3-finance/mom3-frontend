"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

export type TimeRange = "1D" | "1W" | "1M" | "1Y";
export type ChartView = "line" | "bar";

export const timeRanges: TimeRange[] = ["1D", "1W", "1M", "1Y"];

type MiniChartProps = {
  values: number[];
  label: string;
  tone?: "green" | "purple" | "yellow" | "red";
  defaultView?: ChartView;
  className?: string;
};

const toneClassName = {
  green: "text-[#ccff00]",
  purple: "text-[#8F89FF]",
  yellow: "text-[#FFD166]",
  red: "text-[#FF6B6B]",
};

const chartColor = {
  green: "#ccff00",
  purple: "#8F89FF",
  yellow: "#FFD166",
  red: "#FF6B6B",
};

function formatDelta(values: number[]) {
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  const delta = last - first;

  return `${delta >= 0 ? "+" : "-"}${Math.abs(delta).toFixed(2)}%`;
}

export function MiniChart({
  values,
  label,
  tone = "green",
  defaultView = "line",
  className,
}: MiniChartProps) {
  const [view, setView] = React.useState<ChartView>(defaultView);
  const data = React.useMemo(
    () =>
      values.map((value, index) => ({
        label: `${index + 1}`,
        value,
      })),
    [values],
  );

  const color = chartColor[tone];

  return (
    <div className={cn("rounded-[24px] border border-white/10 bg-[#0D0E13] p-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[#8F8F99]">{label}</p>
          <p className={cn("mt-1 text-lg font-black", toneClassName[tone])}>
            {formatDelta(values)}
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-full bg-black/35 p-1">
          {(["line", "bar"] as ChartView[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={cn(
                "h-8 min-w-12 rounded-full px-3 text-[11px] font-black capitalize transition-colors focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
                view === item
                  ? "bg-[#3B33BD] text-[#ccff00]"
                  : "text-[#8F8F99] hover:text-white",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {view === "line" ? (
            <LineChart data={data} margin={{ top: 12, right: 8, bottom: 4, left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#77777f", fontSize: 11, fontWeight: 700 }}
              />
              <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.12)" }}
                contentStyle={{
                  background: "#15161D",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  color: "#fff",
                }}
                formatter={(value) => [`${Number(value).toFixed(2)}%`, "Change"]}
                labelFormatter={(value) => `Point ${value}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: color, stroke: "#111217", strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 12, right: 8, bottom: 4, left: -20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#77777f", fontSize: 11, fontWeight: 700 }}
              />
              <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#15161D",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  color: "#fff",
                }}
                formatter={(value) => [`${Number(value).toFixed(2)}%`, "Change"]}
                labelFormatter={(value) => `Point ${value}`}
              />
              <Bar dataKey="value" fill={color} radius={[8, 8, 3, 3]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TimeRangeControl({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}) {
  return (
    <div className="grid grid-cols-4 rounded-full bg-black/30 p-1">
      {timeRanges.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className={cn(
            "h-8 rounded-full text-xs font-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
            value === range
              ? "bg-[#3B33BD] text-[#ccff00]"
              : "text-[#8F8F99] hover:text-white",
          )}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

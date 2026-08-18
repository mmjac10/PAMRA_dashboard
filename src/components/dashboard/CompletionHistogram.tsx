"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ResponsiveContainer } from "recharts";
import type { ProjectSummary } from "@/types/project";
import { CHART_HEIGHT, CHART_TICK_SIZE, CHART_LABEL_SIZE, CHART_TOOLTIP_SIZE } from "@/lib/globalConstants";

// Ordinal ramp: one hue, monotone lightness — dim near the dark surface at
// low completion, brightening toward the full neon accent at high completion
// (the anchor flips for a dark surface: light-mode ramps run the other way).
const BUCKETS = [
  { label: "0–25%", min: 0, max: 25, color: "#164a37" },
  { label: "25–50%", min: 25, max: 50, color: "#1c7a55" },
  { label: "50–75%", min: 50, max: 75, color: "#22ac78" },
  { label: "75–100%", min: 75, max: 101, color: "#22e5a0" },
];

export default function CompletionHistogram({ projects }: { projects: ProjectSummary[] }) {
  const data = BUCKETS.map((bucket) => ({
    label: bucket.label,
    count: projects.filter(
      (project) =>
        project.percentWorkDone !== null &&
        project.percentWorkDone >= bucket.min &&
        project.percentWorkDone < bucket.max
    ).length,
    color: bucket.color,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: CHART_HEIGHT,
        transform: "perspective(900px) rotateX(14deg)",
        transformOrigin: "center left",
      }}
    >
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={70}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: CHART_TICK_SIZE, fill: "#9db3ac" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "rgba(9,18,16,0.92)",
              border: "1px solid rgba(148,233,199,0.3)",
              borderRadius: 8,
              color: "#eaf6f1",
              fontSize: CHART_TOOLTIP_SIZE,
            }}
            labelStyle={{ color: "#eaf6f1" }}
            itemStyle={{ color: "#eaf6f1" }}
            formatter={(value) => [`${value} project${value === 1 ? "" : "s"}`, "Count"]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fontSize: CHART_LABEL_SIZE, fill: "#eaf6f1", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

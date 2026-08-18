"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, type TooltipContentProps } from "recharts";
import type { ProjectSummary } from "@/types/project";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import { CHART_HEIGHT, CHART_TICK_SIZE, CHART_LEGEND_SIZE, CHART_TOOLTIP_SIZE } from "@/lib/globalConstants";

const SPENT_COLOR = "#22e5a0";
const REMAINING_OPACITY = 0.3;

type BudgetDatum = {
  serial: number;
  name: string;
  spent: number;
  remaining: number;
};

function CustomTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;
  const datum = payload[0].payload as BudgetDatum;

  return (
    <div
      style={{
        background: "rgba(9,18,16,0.94)",
        border: "1px solid rgba(148,233,199,0.3)",
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: CHART_TOOLTIP_SIZE,
        boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
        maxWidth: 220,
      }}
    >
      <div style={{ fontWeight: 600, color: "#eaf6f1", marginBottom: 4 }}>{datum.name}</div>
      <div style={{ color: "#22e5a0" }}>
        Spent: <strong>{formatCurrency(datum.spent)}</strong>
      </div>
      <div style={{ color: "#9db3ac" }}>
        Remaining: <strong>{formatCurrency(datum.remaining)}</strong>
      </div>
    </div>
  );
}

export default function BudgetChart({ projects }: { projects: ProjectSummary[] }) {
  const data: BudgetDatum[] = projects.map((project, index) => {
    const spent = project.workDoneAmount ?? 0;
    const remaining = Math.max(project.cost - spent, 0);
    return { serial: index + 1, name: project.name, spent, remaining };
  });

  return (
    <div
      style={{
        width: "100%",
        height: CHART_HEIGHT,
        transform: "perspective(900px) rotateX(14deg)",
        transformOrigin: "center bottom",
      }}
    >
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 4 }} barCategoryGap={4}>
          <XAxis
            dataKey="serial"
            tickLine={false}
            axisLine={{ stroke: "rgba(148,233,199,0.25)" }}
            tick={{ fontSize: CHART_TICK_SIZE, fill: "#9db3ac" }}
          />
          <YAxis
            tickFormatter={(value: number) => formatCompactCurrency(value)}
            tickLine={false}
            axisLine={false}
            width={60}
            tick={{ fontSize: CHART_TICK_SIZE, fill: "#6c8079" }}
          />
          <Tooltip content={CustomTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend
            verticalAlign="top"
            height={26}
            iconType="square"
            wrapperStyle={{ fontSize: CHART_LEGEND_SIZE, color: "#c7d9d2" }}
          />
          <Bar dataKey="spent" stackId="budget" name="Spent" fill={SPENT_COLOR} maxBarSize={22} />
          <Bar
            dataKey="remaining"
            stackId="budget"
            name="Remaining"
            fill={SPENT_COLOR}
            fillOpacity={REMAINING_OPACITY}
            radius={[3, 3, 0, 0]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  ResponsiveContainer,
  type PieLabelRenderProps,
  type PieSectorShapeProps,
} from "recharts";
import type { ProjectHealth, ProjectSummary } from "@/types/project";
import { HEALTH_META } from "@/lib/health";
import {
  CHART_HEIGHT,
  PIE_OUTER_RADIUS,
  PIE_INNER_RADIUS,
  PIE_ACTIVE_RADIUS_OFFSET,
  PIE_LABEL_SIZE,
} from "@/lib/globalConstants";

const ORDER: ProjectHealth[] = ["ON_TRACK", "AT_RISK", "DELAYED"];
const RADIAN = Math.PI / 180;

function renderLabel(props: PieLabelRenderProps) {
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  const midAngle = Number(props.midAngle);
  const outerRadius = Number(props.outerRadius);
  const radius = outerRadius + 22;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={PIE_LABEL_SIZE}>
      <tspan fill={props.fill} fontWeight={700}>
        {props.value}
      </tspan>
      <tspan fill="#c7d9d2" dx={4}>
        {props.name}
      </tspan>
    </text>
  );
}

export default function StatusPieChart({ projects }: { projects: ProjectSummary[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = ORDER.map((key) => ({
    key,
    name: HEALTH_META[key].label,
    value: projects.filter((project) => project.health === key).length,
    fill: HEALTH_META[key].fill,
  })).filter((entry) => entry.value > 0);

  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const activeEntry = hoveredIndex !== null ? data[hoveredIndex] : null;

  function renderShape(props: PieSectorShapeProps) {
    const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0, startAngle, endAngle, fill, index } = props;
    const isActive = index === hoveredIndex;
    const grownOuterRadius = isActive ? Number(outerRadius) + PIE_ACTIVE_RADIUS_OFFSET : Number(outerRadius);

    return (
      <g>
        {isActive && (
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={Number(innerRadius)}
            outerRadius={grownOuterRadius + 6}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            opacity={0.22}
          />
        )}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={grownOuterRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#0b1614"
          strokeWidth={isActive ? 4 : 3}
        />
      </g>
    );
  }

  if (data.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        height: CHART_HEIGHT,
        filter: "drop-shadow(0 12px 14px rgba(0,0,0,0.5)) drop-shadow(0 0 10px rgba(34,229,160,0.25))",
        transform: "perspective(900px) rotateX(24deg)",
        transformOrigin: "center center",
      }}
    >
      <ResponsiveContainer>
        <PieChart margin={{ top: 20, right: 36, bottom: 20, left: 36 }}>
          <defs>
            {data.map((entry) => (
              <radialGradient key={entry.key} id={`pieGradient-${entry.key}`} cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
                <stop offset="45%" stopColor={entry.fill} stopOpacity={1} />
                <stop offset="100%" stopColor={entry.fill} stopOpacity={0.8} />
              </radialGradient>
            ))}
          </defs>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={PIE_INNER_RADIUS}
            outerRadius={PIE_OUTER_RADIUS}
            isAnimationActive={false}
            label={renderLabel}
            labelLine={{ stroke: "rgba(234,246,241,0.35)", strokeWidth: 1 }}
            shape={renderShape}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={`url(#pieGradient-${entry.key})`} />
            ))}
          </Pie>
          {activeEntry ? (
            <>
              <text x="50%" y="45%" textAnchor="middle" fill="#eaf6f1" fontSize={15} fontWeight={700}>
                {activeEntry.name}
              </text>
              <text x="50%" y="54%" textAnchor="middle" fill={activeEntry.fill} fontSize={24} fontWeight={700}>
                {activeEntry.value}
              </text>
              <text x="50%" y="62%" textAnchor="middle" fill="#9db3ac" fontSize={12}>
                {Math.round((activeEntry.value / total) * 100)}% of projects
              </text>
            </>
          ) : (
            <>
              <text x="50%" y="48%" textAnchor="middle" fill="#eaf6f1" fontSize={26} fontWeight={700}>
                {total}
              </text>
              <text x="50%" y="60%" textAnchor="middle" fill="#9db3ac" fontSize={12}>
                Total Projects
              </text>
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

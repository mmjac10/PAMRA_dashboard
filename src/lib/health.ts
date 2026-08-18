import type { ProjectHealth } from "@/types/project";

export const HEALTH_META: Record<ProjectHealth, { label: string; stroke: string; fill: string; glow: string }> = {
  ON_TRACK: { label: "On Track", stroke: "#22e5a0", fill: "#22e5a0", glow: "rgba(34, 229, 160, 0.85)" },
  AT_RISK: { label: "At Risk", stroke: "#fbbf24", fill: "#fbbf24", glow: "rgba(251, 191, 36, 0.85)" },
  DELAYED: { label: "Delayed", stroke: "#f87171", fill: "#f87171", glow: "rgba(248, 113, 113, 0.85)" },
};

import type { ProjectHealth } from "@/types/project";

export const HEALTH_META: Record<ProjectHealth, { label: string; stroke: string; fill: string }> = {
  ON_TRACK: { label: "On Track", stroke: "#15803d", fill: "#22c55e" },
  AT_RISK: { label: "At Risk", stroke: "#b45309", fill: "#f59e0b" },
  DELAYED: { label: "Delayed", stroke: "#b91c1c", fill: "#ef4444" },
};

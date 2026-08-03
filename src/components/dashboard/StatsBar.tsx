"use client";

import { useEffect, useState } from "react";
import type { ProjectSummary } from "@/types/project";
import { HEALTH_META } from "@/lib/health";
import styles from "./StatsBar.module.css";

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.value} style={color ? { color } : undefined}>
        {value}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export default function StatsBar() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json() as Promise<ProjectSummary[]>;
      })
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch(() => {
        // Stats are a secondary, non-critical view; the map already
        // surfaces load errors, so failures here just leave counts at 0.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const newCount = projects.filter((p) => p.type === "NEW").length;
  const mrCount = projects.filter((p) => p.type === "MAINTENANCE_REPAIR").length;
  const onTrackCount = projects.filter((p) => p.health === "ON_TRACK").length;
  const atRiskCount = projects.filter((p) => p.health === "AT_RISK").length;
  const delayedCount = projects.filter((p) => p.health === "DELAYED").length;

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <StatCard label="New Projects" value={newCount} />
        <StatCard label="M&R Projects" value={mrCount} />
      </div>
      <div className={styles.row}>
        <StatCard label="Total On-Track" value={onTrackCount} color={HEALTH_META.ON_TRACK.fill} />
        <StatCard label="Total At-Risk" value={atRiskCount} color={HEALTH_META.AT_RISK.fill} />
        <StatCard label="Total Delayed" value={delayedCount} color={HEALTH_META.DELAYED.fill} />
      </div>
    </div>
  );
}

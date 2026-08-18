"use client";

import { CircleMarker, Tooltip } from "react-leaflet";
import type { ProjectSummary } from "@/types/project";
import { formatCurrency } from "@/lib/format";
import { HEALTH_META } from "@/lib/health";
import styles from "./ProjectMarker.module.css";

export default function ProjectMarker({
  project,
  onSelect,
}: {
  project: ProjectSummary;
  onSelect: (projectId: string) => void;
}) {
  const health = HEALTH_META[project.health];
  const glowClass = {
    ON_TRACK: styles.glowOnTrack,
    AT_RISK: styles.glowAtRisk,
    DELAYED: styles.glowDelayed,
  }[project.health];

  return (
    <CircleMarker
      center={[project.latitude, project.longitude]}
      radius={7}
      pathOptions={{
        color: "rgba(255,255,255,0.85)",
        weight: 1.5,
        fillColor: health.fill,
        fillOpacity: 1,
      }}
      className={glowClass}
      eventHandlers={{ click: () => onSelect(project.id) }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={1} className={styles.tooltipWrapper}>
        <div className={styles.tooltip}>
          <p className={styles.name}>{project.name}</p>
          <p>{formatCurrency(project.cost)}</p>
          <p>{project.subengineerName}</p>
          <p className={styles.health} style={{ color: health.stroke }}>
            {health.label}
          </p>
        </div>
      </Tooltip>
    </CircleMarker>
  );
}

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

  return (
    <CircleMarker
      center={[project.latitude, project.longitude]}
      radius={8}
      pathOptions={{ color: health.stroke, fillColor: health.fill, fillOpacity: 0.9, weight: 2 }}
      eventHandlers={{ click: () => onSelect(project.id) }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={1}>
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

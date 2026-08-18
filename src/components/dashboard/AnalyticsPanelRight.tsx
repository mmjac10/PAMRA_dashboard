"use client";

import type { ProjectSummary } from "@/types/project";
import { PANEL_TITLE_SIZE, STAT_VALUE_SIZE, STAT_LABEL_SIZE } from "@/lib/globalConstants";
import BudgetChart from "./BudgetChart";
import styles from "./AnalyticsPanelRight.module.css";

export type ProjectTypeFilterValue = "ALL" | "NEW" | "MAINTENANCE_REPAIR";

export default function AnalyticsPanelRight({
  projects,
  typeBreakdownProjects,
  loading,
  typeFilter,
  onTypeFilterChange,
}: {
  projects: ProjectSummary[];
  typeBreakdownProjects: ProjectSummary[];
  loading: boolean;
  typeFilter: ProjectTypeFilterValue;
  onTypeFilterChange: (value: ProjectTypeFilterValue) => void;
}) {
  if (loading) return null;

  // Deliberately keyed off typeBreakdownProjects (status-filtered only) so
  // clicking New/M&R/All here never changes this section's own numbers —
  // it always reflects the full type breakdown for the current status filter.
  const totalCount = typeBreakdownProjects.length;
  const newCount = typeBreakdownProjects.filter((project) => project.type === "NEW").length;
  const mrCount = typeBreakdownProjects.filter((project) => project.type === "MAINTENANCE_REPAIR").length;
  const newShare = totalCount > 0 ? Math.round((newCount / totalCount) * 100) : 0;
  const mrShare = totalCount > 0 ? 100 - newShare : 0;

  return (
    <div className={styles.column}>
      <section className={styles.panel}>
        <h3 className={styles.panelTitle} style={{ fontSize: PANEL_TITLE_SIZE }}>
          Projects by Type
        </h3>
        <div className={styles.statRow}>
          <button
            type="button"
            className={`${styles.statCard} ${typeFilter === "ALL" ? styles.statCardActiveAll : ""}`}
            onClick={() => onTypeFilterChange("ALL")}
          >
            <div className={styles.statValue} style={{ fontSize: STAT_VALUE_SIZE }}>
              {totalCount}
            </div>
            <div className={styles.statLabel} style={{ fontSize: STAT_LABEL_SIZE }}>
              All
            </div>
          </button>
          <button
            type="button"
            className={`${styles.statCard} ${typeFilter === "NEW" ? styles.statCardActive : ""}`}
            onClick={() => onTypeFilterChange(typeFilter === "NEW" ? "ALL" : "NEW")}
          >
            <div className={styles.statValue} style={{ fontSize: STAT_VALUE_SIZE }}>
              {newCount}
            </div>
            <div className={styles.statLabel} style={{ fontSize: STAT_LABEL_SIZE }}>
              New ({newShare}%)
            </div>
          </button>
          <button
            type="button"
            className={`${styles.statCard} ${typeFilter === "MAINTENANCE_REPAIR" ? styles.statCardActiveMr : ""}`}
            onClick={() => onTypeFilterChange(typeFilter === "MAINTENANCE_REPAIR" ? "ALL" : "MAINTENANCE_REPAIR")}
          >
            <div className={`${styles.statValue} ${styles.statValueMr}`} style={{ fontSize: STAT_VALUE_SIZE }}>
              {mrCount}
            </div>
            <div className={styles.statLabel} style={{ fontSize: STAT_LABEL_SIZE }}>
              M&amp;R ({mrShare}%)
            </div>
          </button>
        </div>
        <div className={styles.typeBar}>
          <div className={styles.typeBarNew} style={{ width: `${newShare}%` }} />
          <div className={styles.typeBarMr} style={{ width: `${mrShare}%` }} />
        </div>
      </section>

      <section className={styles.panel}>
        <h3 className={styles.panelTitle} style={{ fontSize: PANEL_TITLE_SIZE }}>
          Budget Utilization by Project
        </h3>
        <BudgetChart projects={projects} />
      </section>
    </div>
  );
}

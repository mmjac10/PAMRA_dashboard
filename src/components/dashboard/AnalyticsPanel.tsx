"use client";

import type { ProjectSummary } from "@/types/project";
import { formatCompactCurrency } from "@/lib/format";
import { PANEL_TITLE_SIZE, STAT_VALUE_SIZE, STAT_LABEL_SIZE } from "@/lib/globalConstants";
import StatusPieChart from "./StatusPieChart";
import CompletionHistogram from "./CompletionHistogram";
import styles from "./AnalyticsPanel.module.css";

export default function AnalyticsPanel({
  projects,
  loading,
}: {
  projects: ProjectSummary[];
  loading: boolean;
}) {
  if (loading) return null;

  const totalProjects = projects.length;
  const totalCost = projects.reduce((sum, project) => sum + project.cost, 0);
  const progressValues = projects
    .map((project) => project.percentWorkDone)
    .filter((value): value is number => value !== null);
  const avgProgress =
    progressValues.length > 0
      ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
      : null;

  return (
    <div className={styles.column}>
      <section className={styles.panel}>
        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ fontSize: STAT_VALUE_SIZE }}>
              {totalProjects}
            </div>
            <div className={styles.statLabel} style={{ fontSize: STAT_LABEL_SIZE }}>
              Total Projects
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ fontSize: STAT_VALUE_SIZE }}>
              {formatCompactCurrency(totalCost)}
            </div>
            <div className={styles.statLabel} style={{ fontSize: STAT_LABEL_SIZE }}>
              Total Cost
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ fontSize: STAT_VALUE_SIZE }}>
              {avgProgress !== null ? `${avgProgress}%` : "—"}
            </div>
            <div className={styles.statLabel} style={{ fontSize: STAT_LABEL_SIZE }}>
              Avg. Work Progress
            </div>
          </div>
        </div>
        <StatusPieChart projects={projects} />
      </section>

      <section className={styles.panel}>
        <h3 className={styles.panelTitle} style={{ fontSize: PANEL_TITLE_SIZE }}>
          Work Completion Status
        </h3>
        <CompletionHistogram projects={projects} />
      </section>
    </div>
  );
}

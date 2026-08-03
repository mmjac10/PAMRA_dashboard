"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import MilestonesSection from "./MilestonesSection";
import BottlenecksSection from "./BottlenecksSection";
import PhotoGallery from "./PhotoGallery";
import type { ProjectDetail } from "@/types/project";
import { formatCurrency } from "@/lib/format";
import { HEALTH_META } from "@/lib/health";
import styles from "./ProjectModal.module.css";

function summarizeCostMilestones(project: ProjectDetail) {
  const costMilestones = project.milestones.filter((m) => m.type === "COST");
  if (costMilestones.length === 0) return null;
  const spent = costMilestones.reduce((sum, m) => sum + (m.achievedValue ?? 0), 0);
  const percent = project.cost > 0 ? Math.round((spent / project.cost) * 100) : 0;
  return { spent, percent };
}

function summarizePhysicalProgress(project: ProjectDetail) {
  const physicalMilestones = project.milestones.filter((m) => m.type === "PHYSICAL");
  if (physicalMilestones.length === 0) return null;
  const total = physicalMilestones.reduce((sum, m) => sum + (m.achievedValue ?? 0), 0);
  return { percent: Math.round(total / physicalMilestones.length), count: physicalMilestones.length };
}

export default function ProjectModal({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json() as Promise<ProjectDetail>;
      })
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load project");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <Modal onClose={onClose}>
      {error && <p className={styles.error}>Couldn&apos;t load project: {error}</p>}
      {!project && !error && <p className={styles.loading}>Loading…</p>}
      {project && <ProjectModalBody project={project} />}
    </Modal>
  );
}

function ProjectModalBody({ project }: { project: ProjectDetail }) {
  const health = HEALTH_META[project.health];
  const costSummary = summarizeCostMilestones(project);
  const progressSummary = summarizePhysicalProgress(project);

  return (
    <div>
      <header className={styles.header}>
        <h2 className={styles.name}>{project.name}</h2>
        <div className={styles.statusRow}>
          <span className={styles.statusDot} style={{ background: health.fill }} />
          <span>Status: {health.label}</span>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Project Cost</div>
            <div className={styles.infoValue}>{formatCurrency(project.cost)}</div>
            {costSummary && (
              <div className={styles.infoSub}>
                Spent: {formatCurrency(costSummary.spent)} ({costSummary.percent}%)
              </div>
            )}
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Physical Progress</div>
            <div className={styles.infoValue}>
              {progressSummary ? `${progressSummary.percent}%` : "—"}
            </div>
            {progressSummary && (
              <div className={styles.infoSub}>
                {progressSummary.count} milestone{progressSummary.count === 1 ? "" : "s"} tracked
              </div>
            )}
          </div>
        </div>

        <div className={styles.sectionTitle}>Subengineer</div>
        <div className={styles.engineerCard}>
          <div className={styles.engineerName}>{project.subengineerName}</div>
          {project.subengineerContact && (
            <div className={styles.engineerDetail}>{project.subengineerContact}</div>
          )}
        </div>

        <div className={styles.sectionTitle}>Milestones &amp; Progress</div>
        <MilestonesSection milestones={project.milestones} />

        <div className={styles.sectionTitle}>Bottlenecks</div>
        <BottlenecksSection bottlenecks={project.bottlenecks} />

        <div className={styles.sectionTitle}>Site Photos (Weekly)</div>
        <PhotoGallery photos={project.sitePhotos} />
      </div>
    </div>
  );
}

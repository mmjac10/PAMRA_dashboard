"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import PhotoGallery from "./PhotoGallery";
import type { ProjectDetail } from "@/types/project";
import { formatCurrency } from "@/lib/format";
import { HEALTH_META } from "@/lib/health";
import styles from "./ProjectModal.module.css";

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
        <div className={styles.sectionTitle}>Contractor Name</div>
        <div className={styles.engineerCard}>
          <div className={styles.engineerName}>{project.subengineerName}</div>
        </div>

        <div className={styles.sectionTitle}>Project Details</div>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Project Location</div>
            <div className={styles.infoValue}>{project.location ?? "—"}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Coordinates</div>
            <div className={styles.infoValue}>
              {project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Admin Approval</div>
            <div className={styles.infoValue}>
              {project.adminApproval !== null ? formatCurrency(project.adminApproval) : "—"}
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Work Order Amount</div>
            <div className={styles.infoValue}>
              {project.workOrderAmount !== null ? formatCurrency(project.workOrderAmount) : "—"}
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Work Done Amount</div>
            <div className={styles.infoValue}>
              {project.workDoneAmount !== null ? formatCurrency(project.workDoneAmount) : "—"}
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Percentage Work Done</div>
            <div className={styles.infoValue}>
              {project.percentWorkDone !== null ? `${project.percentWorkDone}%` : "—"}
            </div>
          </div>
        </div>

        <div className={styles.sectionTitle}>Scope of Work</div>

        {project.scopeOfWork.length === 0 ? (
          <div className={styles.infoCard}>
            <p className={styles.empty}>No scope of work recorded.</p>
          </div>
        ) : (
          <div className={styles.scopeTable}>
            <div className={styles.scopeHeaderRow}>
              <span>Scope Item</span>
              <span>Quantity</span>
              <span>Progress/Status</span>
            </div>
            {project.scopeOfWork.map((scopeItem, index) => (
              <div className={styles.scopeRow} key={index}>
                <span className={styles.scopeItemName}>{scopeItem.item}</span>
                <span className={styles.scopeQuantity}>{scopeItem.quantity ?? "—"}</span>
                <span className={styles.scopeProgress}>{scopeItem.progress ?? "—"}</span>
              </div>
            ))}
          </div>
        )}
        <div className={styles.sectionTitle}>Site Photos (Weekly)</div>
        <PhotoGallery photos={project.sitePhotos} />
      </div>
    </div>
  );
}

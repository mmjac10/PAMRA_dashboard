"use client";

import dynamic from "next/dynamic";
import type { StatusFilterValue } from "./StatusFilterBar";
import type { ProjectSummary } from "@/types/project";
import styles from "./ProjectMap.module.css";

const ProjectMap = dynamic(() => import("./ProjectMap"), {
  ssr: false,
  loading: () => <p className={styles.loading}>Loading map…</p>,
});

export default function MapLoader({
  projects,
  error,
  statusFilter,
  onStatusFilterChange,
}: {
  projects: ProjectSummary[];
  error: string | null;
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (value: StatusFilterValue) => void;
}) {
  return (
    <ProjectMap
      projects={projects}
      error={error}
      statusFilter={statusFilter}
      onStatusFilterChange={onStatusFilterChange}
    />
  );
}

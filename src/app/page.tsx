"use client";

import { useEffect, useState } from "react";
import Header from "@/components/dashboard/Header";
import AnalyticsPanel from "@/components/dashboard/AnalyticsPanel";
import AnalyticsPanelRight, { type ProjectTypeFilterValue } from "@/components/dashboard/AnalyticsPanelRight";
import MapLoader from "@/components/map/MapLoader";
import type { StatusFilterValue } from "@/components/map/StatusFilterBar";
import type { ProjectSummary } from "@/types/project";
import styles from "./page.module.css";

export default function Home() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("ALL");
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilterValue>("ALL");

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
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load projects");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Filtered by status only — the "Projects by Type" section is keyed off
  // this so its own New/M&R buttons never shrink its own numbers.
  const statusFilteredProjects = projects.filter(
    (project) => statusFilter === "ALL" || project.health === statusFilter
  );

  // The single source of truth for "what's currently shown on the map" —
  // every other stat and chart on both side panels derives from this same
  // set, so they always match the dots visible on the map.
  const visibleProjects = statusFilteredProjects.filter(
    (project) => typeFilter === "ALL" || project.type === typeFilter
  );

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.mapArea}>
        <AnalyticsPanel projects={visibleProjects} loading={loading} />
        <AnalyticsPanelRight
          projects={visibleProjects}
          typeBreakdownProjects={statusFilteredProjects}
          loading={loading}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
        />
        <MapLoader
          projects={visibleProjects}
          error={error}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ProjectMarker from "./ProjectMarker";
import Legend from "./Legend";
import ProjectModal from "@/components/project/ProjectModal";
import SignOutButton from "@/components/ui/SignOutButton";
import type { ProjectSummary } from "@/types/project";
import styles from "./ProjectMap.module.css";

const PUNJAB_CENTER: [number, number] = [30.9, 72.35];
// Loose bounding box around Punjab, Pakistan — keeps panning focused on the
// region without hard-locking the view like a fixed embed.
const PUNJAB_BOUNDS: [[number, number], [number, number]] = [
  [26.5, 68.0],
  [35.0, 76.5],
];

export default function ProjectMap() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* <SignOutButton /> */}
      {error && <p className={styles.error}>Couldn&apos;t load projects: {error}</p>}
      <MapContainer
        center={PUNJAB_CENTER}
        zoom={7}
        minZoom={6}
        maxBounds={PUNJAB_BOUNDS}
        maxBoundsViscosity={0.8}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {projects.map((project) => (
          <ProjectMarker key={project.id} project={project} onSelect={setSelectedProjectId} />
        ))}
      </MapContainer>
      <Legend />
      {selectedProjectId && (
        <ProjectModal projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}
    </div>
  );
}

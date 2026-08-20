"use client";

import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ProjectMarker from "./ProjectMarker";
import PunjabMask from "./PunjabMask";
import Legend from "./Legend";
import StatusFilterBar, { type StatusFilterValue } from "./StatusFilterBar";
import ProjectModal from "@/components/project/ProjectModal";
import type { ProjectSummary } from "@/types/project";
import styles from "./ProjectMap.module.css";

const PUNJAB_CENTER: [number, number] = [30.9, 72.35];
// Loose bounding box around Punjab, Pakistan — keeps panning focused on the
// region without hard-locking the view like a fixed embed.
const PUNJAB_BOUNDS: [[number, number], [number, number]] = [
  [26.5, 68.0],
  [35.0, 76.5],
];

export default function ProjectMap({
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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.error}>Couldn&apos;t load projects: {error}</p>}
      <StatusFilterBar value={statusFilter} onChange={onStatusFilterChange} />
      <div className={styles.mapArea}>
        <MapContainer
          center={PUNJAB_CENTER}
          zoom={7}
          minZoom={6}
          maxBounds={PUNJAB_BOUNDS}
          maxBoundsViscosity={0.8}
          zoomControl={false}
          attributionControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          className={styles.map}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <PunjabMask />
          {projects.map((project) => (
            <ProjectMarker key={project.id} project={project} onSelect={setSelectedProjectId} />
          ))}
        </MapContainer>
        <Legend />
      </div>
      {selectedProjectId && (
        <ProjectModal projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
      )}
    </div>
  );
}

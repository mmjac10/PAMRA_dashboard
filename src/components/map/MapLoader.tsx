"use client";

import dynamic from "next/dynamic";
import styles from "./ProjectMap.module.css";

const ProjectMap = dynamic(() => import("./ProjectMap"), {
  ssr: false,
  loading: () => <p className={styles.loading}>Loading map…</p>,
});

export default function MapLoader() {
  return <ProjectMap />;
}

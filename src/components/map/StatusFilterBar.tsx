"use client";

import type { ProjectHealth } from "@/types/project";
import { HEALTH_META } from "@/lib/health";
import styles from "./StatusFilterBar.module.css";

export type StatusFilterValue = ProjectHealth | "ALL";

const OPTIONS: { value: StatusFilterValue; label: string; color?: string }[] = [
  { value: "ALL", label: "All" },
  { value: "ON_TRACK", label: HEALTH_META.ON_TRACK.label, color: HEALTH_META.ON_TRACK.fill },
  { value: "AT_RISK", label: HEALTH_META.AT_RISK.label, color: HEALTH_META.AT_RISK.fill },
  { value: "DELAYED", label: HEALTH_META.DELAYED.label, color: HEALTH_META.DELAYED.fill },
];

export default function StatusFilterBar({
  value,
  onChange,
}: {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}) {
  return (
    <div className={styles.bar}>
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`${styles.option} ${active ? styles.active : ""}`}
            style={
              active && option.color
                ? { color: option.color, borderColor: option.color, boxShadow: `0 0 12px ${option.color}66` }
                : undefined
            }
            onClick={() => onChange(option.value)}
          >
            {option.color && <span className={styles.dot} style={{ background: option.color }} />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

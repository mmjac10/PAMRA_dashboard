import type { MilestoneDTO } from "@/types/project";
import { formatCurrency } from "@/lib/format";
import styles from "./MilestonesSection.module.css";

function MilestoneLine({ milestone }: { milestone: MilestoneDTO }) {
  const achieved = milestone.achievedDate !== null;
  const marker = achieved ? "✓" : "○";
  const value =
    milestone.type === "COST"
      ? milestone.achievedValue !== null
        ? formatCurrency(milestone.achievedValue)
        : "pending"
      : `${milestone.achievedValue ?? 0}%`;

  return (
    <div className={styles.milestoneItem}>
      {marker} {milestone.title} — {value}
    </div>
  );
}

export default function MilestonesSection({ milestones }: { milestones: MilestoneDTO[] }) {
  const physical = milestones.filter((m) => m.type === "PHYSICAL");
  const cost = milestones.filter((m) => m.type === "COST");

  return (
    <div className={styles.container}>
      <div className={`${styles.box} ${styles.physical}`}>
        <div className={styles.title}>Physical</div>
        {physical.length === 0 ? (
          <p className={styles.empty}>No milestones recorded.</p>
        ) : (
          physical.map((m) => <MilestoneLine key={m.id} milestone={m} />)
        )}
      </div>
      <div className={`${styles.box} ${styles.cost}`}>
        <div className={styles.title}>Cost</div>
        {cost.length === 0 ? (
          <p className={styles.empty}>No milestones recorded.</p>
        ) : (
          cost.map((m) => <MilestoneLine key={m.id} milestone={m} />)
        )}
      </div>
    </div>
  );
}

import { HEALTH_META } from "@/lib/health";
import styles from "./Legend.module.css";

const ORDER = ["ON_TRACK", "AT_RISK", "DELAYED"] as const;

export default function Legend() {
  return (
    <div className={styles.legend}>
      <p className={styles.title}>Project Status</p>
      {ORDER.map((key) => (
        <div key={key} className={styles.item}>
          <span className={styles.dot} style={{ background: HEALTH_META[key].fill }} />
          <span>{HEALTH_META[key].label}</span>
        </div>
      ))}
    </div>
  );
}

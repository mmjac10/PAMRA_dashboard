import type { BottleneckDTO } from "@/types/project";
import { formatDate } from "@/lib/format";
import styles from "./BottlenecksSection.module.css";

export default function BottlenecksSection({ bottlenecks }: { bottlenecks: BottleneckDTO[] }) {
  if (bottlenecks.length === 0) {
    return <p className={styles.empty}>No bottlenecks reported.</p>;
  }

  return (
    <div>
      {bottlenecks.map((bottleneck) => (
        <div key={bottleneck.id} className={styles.card}>
          <p className={styles.text}>{bottleneck.description}</p>
          <p className={styles.date}>Reported {formatDate(bottleneck.createdAt)}</p>
          {bottleneck.photoIds.length > 0 && (
            <div className={styles.photos}>
              {bottleneck.photoIds.map((photoId) => (
                <img
                  key={photoId}
                  src={`/api/photos/bottleneck/${photoId}`}
                  alt="Bottleneck site photo"
                  className={styles.photo}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

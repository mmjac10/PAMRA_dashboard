import type { SitePhotoDTO } from "@/types/project";
import { formatDate } from "@/lib/format";
import styles from "./PhotoGallery.module.css";

export default function PhotoGallery({ photos }: { photos: SitePhotoDTO[] }) {
  if (photos.length === 0) {
    return <p className={styles.empty}>No site photos uploaded yet.</p>;
  }

  return (
    <div className={styles.grid}>
      {photos.map((photo) => (
        <figure key={photo.id} className={styles.item}>
          <img
            src={`/api/photos/site/${photo.id}`}
            alt={`Site photo for week of ${formatDate(photo.weekOf)}`}
            className={styles.photo}
          />
        </figure>
      ))}
    </div>
  );
}

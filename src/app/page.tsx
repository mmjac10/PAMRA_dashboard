import Header from "@/components/dashboard/Header";
import StatsBar from "@/components/dashboard/StatsBar";
import MapLoader from "@/components/map/MapLoader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.mapArea}>
        <StatsBar />
        <MapLoader />
      </div>
    </main>
  );
}

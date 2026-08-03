import Image from "next/image";
import pamraLogo from "@/app/PAMRA_logo.png";
import punjabLogo from "@/app/punjab_logo.png";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Image src={pamraLogo} alt="PAMRA logo" className={styles.logo} priority />
      <h1 className={styles.title}>Punjab Agricultural Marketing Regulatory Authority</h1>
      <Image src={punjabLogo} alt="Government of Punjab logo" className={styles.logo} priority />
    </header>
  );
}

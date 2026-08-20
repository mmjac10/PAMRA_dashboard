"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import pamraLogo from "@/app/PAMRA_logo.png";
import styles from "./Header.module.css";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Image src={pamraLogo} alt="PAMRA logo" className={styles.logo} priority />
        <span className={styles.orgName}>Punjab Agricultural Marketing Regulatory Authority</span>
      </div>
      <h1 className={styles.title}>Infrastructure Monitoring Dashboard</h1>
      {session?.user && (
        <div className={styles.account} ref={menuRef}>
          <button
            type="button"
            className={styles.accountButton}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.accountName}>{session.user.name}</span>
            <span className={styles.chevron} data-open={menuOpen}>
              ▾
            </span>
          </button>
          {menuOpen && (
            <div className={styles.menu}>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

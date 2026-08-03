"use client";

import { signOut } from "next-auth/react";
import styles from "./SignOutButton.module.css";

export default function SignOutButton() {
  return (
    <button className={styles.button} onClick={() => signOut({ callbackUrl: "/login" })}>
      Sign out
    </button>
  );
}

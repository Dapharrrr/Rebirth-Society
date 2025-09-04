"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./navbar.module.scss";

const Navbar: React.FC = () => {
  type SessionUser = { id: string; email: string; name?: string; firstName?: string };
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    setUser(null);
    // reload to reflect logged-out state
    window.location.href = "/";
  }

  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <div className={styles.navLeft}>
        <Link href="/"><Image src="/images/logo.jpg" alt="Logo of the school" width={50} height={50} /></Link>
        <Link href="/"><h1 className={styles.title}>Rebirth Society</h1></Link>
      </div>

    <div className={styles.navCenter}>
      <Link className={styles.navLink} href="/courses">Courses</Link>
      <Link className={styles.navLink} href="/about">About</Link>
      <Link className={styles.navLink} href="/contact">Contact</Link>
    </div>

      {user ? (
        <button className={styles.login} onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link className={styles.login} href="/login">Login</Link>
      )}
    </nav>
  );
};

export { Navbar };
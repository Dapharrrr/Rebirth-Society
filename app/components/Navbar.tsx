"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./navbar.module.scss";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      setUser(null);
    }
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("user");
    } catch (e) {
      // ignore
    }
    setUser(null);
    // reload to reflect logged-out state
    window.location.href = "/";
  }

  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <div className={styles.navLeft}>
        <a href="/"><Image src="/images/logo.jpg" alt="Logo of the school" width={50} height={50} /></a>
        <a href="/"><h1 className={styles.title}>Rebirth Society</h1></a>
      </div>

    <div className={styles.navCenter}>
      <a className={styles.navLink} href="/courses">Courses</a>
      <a className={styles.navLink} href="/about">About</a>
      <a className={styles.navLink} href="/contact">Contact</a>
      <a className={styles.navLink} href="/admin">Admin</a>
    </div>

      {user ? (
        <button className={styles.login} onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <a className={styles.login} href="/login">Login</a>
      )}
    </nav>
  );
};

export { Navbar };
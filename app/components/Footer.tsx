"use client";
import React from "react";
import Image from "next/image";
import styles from "./footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <div className={styles.logoSection}>
            <Image src="/images/logo.jpg" alt="Logo of the school" width={40} height={40} />
            <h3 className={styles.footerTitle}>Rebirth Society</h3>
          </div>
          <p className={styles.description}>
            Urban Kiz School based in Paris, offering curated video packs to enhance your learning experience.
          </p>
        </div>

        <div className={styles.footerCenter}>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Contact Info</h4>
            <ul>
              <li>Email: contact@rebirthsociety.com</li>
              <li>Phone: +33 6 12 34 56 78</li>
              <li>Address: Oberkampf, Paris</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerRight}>
          <h4>Follow Us</h4>
          <div className={styles.socialLinks}>
            <a href="https://www.instagram.com/rebirthsocietypantin?utm_source=ig_web_button_share_sheet&igsh=MXhleHcyMmZ4ZTBlaA==" target="blank" aria-label="Instagram">📷</a>
            <a href="https://www.facebook.com/people/Rebirth-Society/61555683249148/" target="blank" aria-label="Facebook">📘</a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; 2025 Rebirth Society School. All rights reserved.</p>
      </div>
    </footer>
  );
};

export { Footer };

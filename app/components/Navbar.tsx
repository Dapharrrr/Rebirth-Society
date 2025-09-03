import Image from "next/image";
import styles from "./navbar.module.scss";

const Navbar: React.FC = () => (
  <nav className={styles.navigation} aria-label="Main navigation">
    <div className={styles.navLeft}>
      <a href="#"><Image src="/images/logo.jpg" alt="Logo of the school" width={50} height={50} /></a>
      <h1 className={styles.title}>Rebirth Society</h1>
    </div>

    <div className={styles.navCenter}>
      <a className={styles.navLink} href="#learn">Courses</a>
      <a className={styles.navLink} href="#examples">About</a>
      <a className={styles.navLink} href="#deploy">Contact</a>
    </div>

    <a className={styles.login} href="#login">Login</a>
  </nav>
);

export { Navbar };
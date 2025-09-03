import Image from 'next/image';
import styles from './navbar.module.scss';


const Navbar: React.FC = () => (
  <nav className={styles.navigation} aria-label="Main navigation">
    <Image src="/globe.svg" alt="Logo of the school" width={50} height={50} />
    <h1 className={styles.title}>Rebirth Society School</h1>

    <div className={styles.navContainer}>
      <div className={styles.navLinks}>
        <a className={styles.navLink} href="#learn">Courses</a>
        <a className={styles.navLink} href="#examples">About</a>
        <a className={styles.navLink} href="#deploy">Contact</a>
      </div>

      <a className={styles.login} href="#login">Login</a>
    </div>
  </nav>
);

export { Navbar };
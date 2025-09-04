import Image from "next/image";
import styles from "./page.module.css";
import CardGrid from "./components/CardGrid";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <header>
        <Navbar />
      </header>
      <main className={styles.main}>
        <div className={styles.presentation}>
          <h1 className={styles.title}>Welcome to Rebirth Society School</h1>
          <p className={styles.description}>
            Explore our curated video packs to enhance your learning experience. If you're beginer or advanced, we have the perfect course for you !
          </p>
        </div>
      </main>
        
        {/* Section Cards */}
        <section style={{ width: "100%", marginTop: 32 }}>
          <h2 style={{ textAlign: "center", marginBottom: 16 }}>
            Our Urban Kiz video packs
          </h2>
          <CardGrid />
        </section>
      <Footer />
    </div>
  );
}

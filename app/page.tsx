import Image from "next/image";
import styles from "./page.module.css";
import CardGrid from "./components/CardGrid";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* Section Cards */}
        <section style={{ width: "100%", marginTop: 32 }}>
          <h2 style={{ textAlign: "center", marginBottom: 16 }}>
            Our Urban Kiz video packs
          </h2>
          <CardGrid />
        </section>
      </main>
    </div>
  );
}

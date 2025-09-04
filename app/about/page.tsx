import CardGrid from "../components/CardGrid";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>

        {/* Section Cards */}
        <section style={{ width: "100%", marginTop: 32 }}>
          <h2 style={{ textAlign: "center", marginBottom: 16 }}>
            Our Urban Kiz video packs
          </h2>
          <CardGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}

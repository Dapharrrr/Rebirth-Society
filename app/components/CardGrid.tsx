"use client";

import Card from "./Card";
import styles from "./card-grid.module.scss";

type Pack = {
  title: string;
  price: number;
  description: string;
  image: string;
};

const packs: Pack[] = [
  {
    title: "Urban Kiz Essentials",
    price: 49.99,
    description: "Absolute Begginer Foundations",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Ballet Basics",
    price: 59.99,
    description:
      "Technique Drills",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Contemporary Flow",
    price: 45.99,
    description:
      "Core Figures",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Salsa Sensations",
    price: 55.99,
    description:
      "Musicality Essentials",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop",
  },
];

export function CardGrid() {
  return (
    <section className={styles.grid} aria-label="Nos packs de vidéos">
      {packs.map((p) => (
        <Card
          key={p.title}
          title={p.title}
          price={p.price}
          description={p.description}
          image={p.image}
          onPreview={() => alert(`Aperçu: ${p.title}`)}
        />
      ))}
    </section>
  );
}

export default CardGrid;

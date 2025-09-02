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
    title: "Hip Hop Essentials",
    price: 49.99,
    description: "Maîtrisez les fondamentaux du hip-hop avec ce pack complet.",
    image:
      "https://images.unsplash.com/photo-1514510351402-7a43b3031c52?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Ballet Basics",
    price: 59.99,
    description:
      "Apprenez la grâce et la technique du ballet en partant de zéro.",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Contemporary Flow",
    price: 45.99,
    description:
      "Exprimez-vous à travers les mouvements fluides de la danse contemporaine.",
    image:
      "https://images.unsplash.com/photo-1520975922284-6c0a1f83a1a5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Salsa Sensations",
    price: 55.99,
    description:
      "Pimentez vos talents de danseur avec les rythmes vibrants de la salsa.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
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

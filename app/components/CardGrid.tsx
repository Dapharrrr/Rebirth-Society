"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Card from "./Card";
import styles from "./card-grid.module.scss";

type Pack = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  _count: {
    videos: number;
  };
};

export function CardGrid() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await fetch('/api/packs');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des packs');
        }
        const data = await response.json();
        setPacks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  const handlePreview = (packId: string) => {
    router.push(`/packs/${packId}`);
  };

  if (loading) {
    return (
      <section className={styles.grid} aria-label="Chargement des packs">
        <div className={styles.loading}>Chargement des packs...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.grid} aria-label="Erreur">
        <div className={styles.error}>Erreur: {error}</div>
      </section>
    );
  }

  return (
    <section className={styles.grid} aria-label="Nos packs de vidéos">
      {packs.map((pack) => (
        <Card
          key={pack.id}
          title={pack.name}
          price={pack.price}
          description={pack.description}
          image={pack.image}
          videoCount={pack._count.videos}
          onPreview={() => handlePreview(pack.id)}
        />
      ))}
    </section>
  );
}

export default CardGrid;

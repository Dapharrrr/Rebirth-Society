"use client";

import { useEffect, useState } from "react";
import Card from "./Card";
import styles from "./card-grid.module.scss";
import type { Pack } from "@/types/pack";

export function CardGrid() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPacks() {
      try {
        setLoading(true);
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
    }

    fetchPacks();
  }, []);

  if (loading) {
    return (
      <section className={styles.grid} aria-label="Chargement des packs">
        <div className={styles.loading}>
          <p>Chargement des packs...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.grid} aria-label="Erreur de chargement">
        <div className={styles.error}>
          <p>Erreur: {error}</p>
          <button onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  if (packs.length === 0) {
    return (
      <section className={styles.grid} aria-label="Aucun pack disponible">
        <div className={styles.empty}>
          <p>Aucun pack disponible pour le moment.</p>
        </div>
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
          videoCount={pack._count?.videos}
          onPreview={() => alert(`Aperçu: ${pack.name}`)}
        />
      ))}
    </section>
  );
}

export default CardGrid;

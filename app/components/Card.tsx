"use client";

import Image from "next/image";
import styles from "./card.module.scss";

export type CardProps = {
  title: string;
  price: number | string;
  description: string;
  image: string;      
  imageAlt?: string;
  onPreview?: () => void;
  className?: string;
  videoCount?: number; 
};

export function Card({
  title,
  price,
  description,
  image,
  imageAlt,
  onPreview,
  className,
  videoCount,
}: CardProps) {
  const priceText =
    typeof price === "number" ? `$${price.toFixed(2)}` : String(price);

  return (
    <article
      className={[styles.card, className].filter(Boolean).join(" ")}
      role="article"
    >
      <div className={styles.media}>
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <div className={styles.body}>
        <header className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.price}>{priceText}</span>
        </header>

        <p className={styles.description}>{description}</p>
        
        {videoCount && (
          <p className={styles.videoCount}>
            {videoCount} vidéo{videoCount > 1 ? 's' : ''}
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            onClick={onPreview}
            aria-label={`Voir l'aperçu de ${title}`}
          >
            Voir l'aperçu
          </button>
        </div>
      </div>
    </article>
  );
}

export default Card;

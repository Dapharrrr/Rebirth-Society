"use client";
import React from 'react';
import styles from './buy-button.module.css';

type Props = {
  price: number;
  productName?: string;
  packId?: string;
};

export default function BuyButton({ price, productName = 'Pack', packId }: Props) {
  const handleBuy = async () => {
    try {
      // require local login (simple localStorage session used by this app)
      const userRaw = localStorage.getItem('user');
      if (!userRaw) {
        // redirect to login and come back to this pack after signing in
        const next = packId ? `/packs/${encodeURIComponent(packId)}` : '/packs';
        window.location.href = `/login?next=${encodeURIComponent(next)}`;
        return;
      }
      const user = JSON.parse(userRaw);
  // build success/cancel urls. Use Stripe's {CHECKOUT_SESSION_ID} placeholder so
  // Stripe will replace it with the real session id when redirecting.
  const origin = window.location.origin;
  const packSegment = packId ? `/packs/${encodeURIComponent(packId)}` : '/packs';
  const successUrl = `${origin}${packSegment}?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/packs`; // fallback

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          currency: 'eur',
          productName,
          successUrl,
          cancelUrl,
          packId,
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (data.url) {
        // prefer the provided URL (it already includes session id)
        window.location.href = data.url;
      } else if (data.id) {
  // fallback: redirect to the pack page with session_id so VideosList can verify
  const packSegment2 = packId ? `/packs/${encodeURIComponent(packId)}` : '/packs';
  const success = `${window.location.origin}${packSegment2}?session_id=${encodeURIComponent(data.id)}`;
        window.location.href = success;
      } else {
        console.error('No checkout url returned', data);
      }
    } catch (err) {
      console.error('Payment error', err);
    }
  };

  return (
    <button onClick={handleBuy} className={styles.buyButton}>
      Buy — {price}€
    </button>
  );
}

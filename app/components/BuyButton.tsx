"use client";
import React from 'react';

type Props = {
  price: number;
  productName?: string;
};

export default function BuyButton({ price, productName = 'Pack' }: Props) {
  const handleBuy = async () => {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          currency: 'eur',
          productName,
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/cancel',
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.id) {
        // fallback
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      } else {
        console.error('No checkout url returned', data);
      }
    } catch (err) {
      console.error('Payment error', err);
    }
  };

  return (
    <button onClick={handleBuy} className="btn">
      Acheter — {price}€
    </button>
  );
}

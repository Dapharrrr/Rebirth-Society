"use client";
import React from 'react';
import styles from './buy-button.module.css';

type Props = {
  price: number;
  productName?: string;
  packId?: string;
};

export default function BuyButton({ price, productName = 'Pack', packId }: Props) {
  const [purchasedModalOpen, setPurchasedModalOpen] = React.useState(false);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  };

  const modalStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 8,
    maxWidth: 480,
    width: '100%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    padding: '1.25rem',
  };

  const primaryBtn: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    background: '#1f2937',
    color: '#fff',
    marginRight: '0.5rem',
  };

  const secondaryBtn: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    borderRadius: 6,
    border: '1px solid #ddd',
    cursor: 'pointer',
    background: '#fff',
  };

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

      // prevent duplicate purchase on client side
      if (packId) {
        try {
          const hasRes = await fetch('/api/purchases/has', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, packId }),
          });
          const hasData = await hasRes.json();
          if (hasData?.has) {
            setPurchasedModalOpen(true);
            return;
          }
        } catch (e) {
          console.warn('Could not verify existing purchase before checkout', e);
        }
      }

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
      if (!res.ok) {
        if (data?.error === 'ALREADY_PURCHASED') {
          setPurchasedModalOpen(true);
          return;
        }
        console.error('Checkout error', data);
        return;
      }
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
  <>
    <button onClick={handleBuy} className={styles.buyButton}>
      Buy — {price}€
    </button>

    <button onClick={handleBuy} className="btn">
      Buy — {price}€
    </button>

    {purchasedModalOpen && (
      <div
        style={overlayStyle}
        role="dialog"
        aria-modal="true"
        onClick={() => setPurchasedModalOpen(false)}
      >
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: 0, color: '#000' }}>You already own this pack</h3>
          <p style={{ color: '#000' }}>
            You cannot purchase the same pack again with this account.
          </p>
          <div style={{ marginTop: 12 }}>
            <button style={primaryBtn} onClick={() => setPurchasedModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}

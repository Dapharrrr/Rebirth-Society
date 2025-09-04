"use client";
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) return;

    // ask server for session details (including metadata.packId)
    fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((data) => {
        const packId = data?.metadata?.packId;
        if (packId) {
          // redirect to pack page with session_id for VideosList to verify and unlock
          window.location.href = `/packs/${encodeURIComponent(packId)}?session_id=${encodeURIComponent(sessionId)}`;
        }
      })
      .catch((e) => console.error('verify error', e));
  }, []);

  return (
    <div style={{padding: 40}}>
      <h2>Merci — redirection en cours…</h2>
      <p>Si vous n&apos;êtes pas redirigé, vous pouvez fermer cette fenêtre et retourner au pack.</p>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from 'react';

type Video = {
  id: string;
  title: string;
  description: string;
  duration: number;
};

type ModalState =
  | { type: 'video'; video: Video }
  | { type: 'prompt'; video?: Video }
  | null;

export default function VideosList({ videos, packId, styles }: { videos: Video[]; packId: string; styles?: any }) {
  const [allowed, setAllowed] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      // verify session on server
      fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.payment_status === 'paid') {
            setAllowed(true);
            // clean the url (remove session_id)
            params.delete('session_id');
            const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
            window.history.replaceState({}, '', newUrl);
          }
        })
        .catch((e) => console.error('verify error', e));
    } else {
      // no session_id, check if local user already purchased the pack
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        fetch('/api/purchases/has', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, packId }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.has) setAllowed(true);
          })
          .catch((e) => console.error('purchases check error', e));
      }
    }

    // allow closing modal with Escape
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [packId]);

  const handleClick = (video: Video) => {
    if (!allowed) {
      setModal({ type: 'prompt', video });
      return;
    }
    setModal({ type: 'video', video });
  };

  const closeModal = () => setModal(null);

  // simple inline styles to avoid adding new css files while keeping layout untouched
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
    maxWidth: 800,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    padding: '1.25rem',
  };

  const promptButtonStyle: React.CSSProperties = {
    marginRight: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div>
      <div className={styles?.videosList ?? ''}>
        {videos.map((video, index) => (
          <div key={video.id} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick(video)} className={styles?.videoItem ?? ''} onClick={() => handleClick(video)}>
            <div className={styles?.videoNumber ?? ''}>
              {(index + 1).toString().padStart(2, '0')}
            </div>
            <div className={styles?.videoInfo ?? ''}>
              <h3 className={styles?.videoTitle ?? ''}>{video.title}</h3>
              <p className={styles?.videoDescription ?? ''}>{video.description}</p>
            </div>
            <div className={styles?.videoDuration ?? ''}>
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={overlayStyle} role="dialog" aria-modal="true" onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {modal.type === 'video' && (
              <div>
                <h3>{modal.video?.title}</h3>
                <p>{modal.video?.description}</p>
                {/* If you have a video URL, replace below with a video player (video tag or player component) */}
                <div style={{ marginTop: 12 }}>
                  <button onClick={closeModal} style={promptButtonStyle}>
                    Fermer
                  </button>
                </div>
              </div>
            )}

            {modal.type === 'prompt' && (
              <div>
                <h3>Accès restreint</h3>
                <p>
                  Vous devez acheter ce pack pour visionner les vidéos. Connectez-vous ou achetez le pack pour continuer.
                </p>
                <div style={{ marginTop: 12 }}>
                  <button
                    style={{ ...promptButtonStyle, background: '#1f2937', color: '#fff' }}
                    onClick={() => {
                      // redirect to login with return to current page
                      const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
                      window.location.href = `/login?next=${returnTo}`;
                    }}
                  >
                    Se connecter
                  </button>
                  <button
                    style={{ ...promptButtonStyle, background: '#fff', border: '1px solid #ddd' }}
                    onClick={() => {
                      // ask the user to click the Acheter button on the page; keep simple to avoid duplicating buy logic here
                      // focus the top of the page where the buy button usually is
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      closeModal();
                    }}
                  >
                    Acheter le pack
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

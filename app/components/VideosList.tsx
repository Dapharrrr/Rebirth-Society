"use client";
import React, { useEffect, useState } from 'react';
import BuyButton from './BuyButton';
import styles from './video-list.module.scss';

type Video = {
  id: string;
  title: string;
  description: string;
  duration: number;
  link: string;
};

type ModalState =
  | { type: 'video'; video: Video }
  | { type: 'prompt'; video?: Video }
  | null;

export default function VideosList({ videos, packId, price, productName }: { videos: Video[]; packId: string; price?: number; productName?: string }) {
  const [allowed, setAllowed] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        setIsLoggedIn(true);
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
      } else {
        setIsLoggedIn(false);
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
    setPlayError(null);
    setModal({ type: 'video', video });
  };

  const closeModal = () => {
    setPlayError(null);
    setModal(null);
  };

  const classifyLink = (url: string): { kind: 'youtube' | 'vimeo' | 'file'; embedUrl?: string } => {
    try {
      const u = new URL(url);
      const host = u.hostname.replace('www.', '');
      // YouTube
      if (host === 'youtube.com' || host === 'youtu.be') {
        // convert to embed URL
        let videoId = '';
        if (host === 'youtu.be') {
          videoId = u.pathname.slice(1);
        } else {
          videoId = u.searchParams.get('v') || '';
        }
        if (videoId) {
          return { kind: 'youtube', embedUrl: `https://www.youtube.com/embed/${videoId}` };
        }
      }
      // Vimeo
      if (host === 'vimeo.com' || host === 'player.vimeo.com') {
        const parts = u.pathname.split('/').filter(Boolean);
        const id = parts[0] || '';
        if (id) {
          return { kind: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}` };
        }
      }
      return { kind: 'file' };
    } catch {
      return { kind: 'file' };
    }
  };

  // simple inline styles to avoid adding new css files while keeping layout untouched
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(80, 80, 80, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  };

  const modalStyle: React.CSSProperties = {
    background: '#000000ff',
    borderRadius: 8,
    maxWidth: 800,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    padding: '1.25rem',
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
                <div style={{ marginTop: 12 }}>
                  {modal.video?.link ? (
                    (() => {
                      const cls = classifyLink(modal.video!.link);
                      if (cls.kind === 'youtube' && cls.embedUrl) {
                        return (
                          <iframe
                            src={cls.embedUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 8 }}
                            title={modal.video!.title}
                          />
                        );
                      }
                      if (cls.kind === 'vimeo' && cls.embedUrl) {
                        return (
                          <iframe
                            src={cls.embedUrl}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            style={{ width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 8 }}
                            title={modal.video!.title}
                          />
                        );
                      }
                      return (
                        <div>
                          <video
                            src={modal.video!.link}
                            onError={() => setPlayError('Impossible to watch this video. Please verify the link or format (ex: MP4).')}
                            controls
                            preload="metadata"
                            style={{ width: '100%', borderRadius: 8, background: '#000' }}
                          />
                        </div>
                      );
                    })()
                  ) : (
                    <div>No video source available.</div>
                  )}
                </div>
                {playError && (
                  <div style={{ marginTop: 8, color: '#b91c1c' }}>{playError}</div>
                )}
                <div style={{ marginTop: 12 }}>
                  <button onClick={closeModal} className={styles.button}>
                    Close
                  </button>
                </div>
              </div>
            )}

            {modal.type === 'prompt' && (
              <div className={styles?.promptContainer ?? ''}>
                <h3>Restricted access</h3>
                <p>
                  {!isLoggedIn
                    ? 'You must purchase this pack to watch the videos. Please log in to continue.'
                    : `You must purchase this pack to watch the videos.${typeof price === 'number' ? `` : ''}`}
                </p>
                <div style={{ marginTop: 12 }}>
                  {!isLoggedIn ? (
                    <button
                      className={styles.button}
                      onClick={() => {
                        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
                        window.location.href = `/login?next=${returnTo}`;
                      }}
                    >
                      Log in
                    </button>
                  ) : (
                    <span>
                      <BuyButton price={price ?? 0} productName={productName ?? 'Pack'} packId={packId} />
                    </span>
                  )}
                  <button
                    className={styles.button}
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Close
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

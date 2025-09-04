"use client"

import { useState } from 'react'
import styles from './admin.module.scss'

type Video = {
  id: string
  title: string
  description: string
  duration: number
  link: string
  createdAt: string
  packId?: string // Ajout du packId optionnel
  pack?: { // Rendre pack optionnel
    id: string
    name: string
  }
}

interface VideoListProps {
  videos: Video[]
  onEdit: (video: Video) => void
  onDelete: (videoId: string) => void
}

export default function VideoList({ videos, onEdit, onDelete }: VideoListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (videoId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      return
    }

    setDeletingId(videoId)
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      onDelete(videoId)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression de la vidéo')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (videos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Aucune vidéo trouvée</p>
      </div>
    )
  }

  return (
    <div className={styles.videoList}>
      {videos.map((video) => (
        <div key={video.id} className={styles.videoCard}>
          <div className={styles.videoInfo}>
            <h3 className={styles.videoTitle}>{video.title}</h3>
            <p className={styles.videoDescription}>{video.description}</p>
            <div className={styles.videoMeta}>
              <span className={styles.pack}>
                Pack: {video.pack?.name || 'Pack non trouvé'}
              </span>
              <span className={styles.duration}>
                Durée: {formatDuration(video.duration)}
              </span>
              <span className={styles.date}>
                Créé le: {formatDate(video.createdAt)}
              </span>
            </div>
            <a 
              href={video.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.videoLink}
            >
              Voir la vidéo ↗
            </a>
          </div>
          
          <div className={styles.videoActions}>
            <button
              onClick={() => onEdit(video)}
              className={styles.editButton}
            >
              Modifier
            </button>
            <button
              onClick={() => handleDelete(video.id)}
              className={styles.deleteButton}
              disabled={deletingId === video.id}
            >
              {deletingId === video.id ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

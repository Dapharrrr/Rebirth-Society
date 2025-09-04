// app/admin/components/PackList.tsx
"use client"

import { useState } from 'react'
import Image from 'next/image'
import styles from './admin.module.scss'

interface Pack {
  id: string
  name: string
  description: string
  price: number
  image: string
  videos?: Array<{
    id: string
    title: string
  }>
  _count?: {
    videos: number
    purchases: number
  }
}

interface PackListProps {
  packs: Pack[]
  onEdit: (pack: Pack) => void
  onDelete: (packId: string) => void
}

export default function PackList({ packs, onEdit, onDelete }: PackListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (pack: Pack) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le pack "${pack.name}" ?`)) {
      return
    }

    setDeletingId(pack.id)

    try {
      const response = await fetch(`/api/packs/${pack.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }

      onDelete(pack.id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (packs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Aucun pack créé pour le moment.</p>
        <p>Utilisez le formulaire ci-dessus pour créer votre premier pack.</p>
      </div>
    )
  }

  return (
    <div className={styles.packGrid}>
      {packs.map((pack) => (
        <div key={pack.id} className={styles.packCard}>
          <div className={styles.packImageContainer}>
            <Image
              src={pack.image}
              alt={pack.name}
              fill
              className={styles.packImage}
            />
          </div>
          
          <div className={styles.packContent}>
            <div className={styles.packHeader}>
              <h3 className={styles.packTitle}>{pack.name}</h3>
              <span className={styles.packPrice}>{formatPrice(pack.price)}</span>
            </div>
            
            <p className={styles.packDescription}>{pack.description}</p>
            
            <div className={styles.packStats}>
              <span className={styles.packStat}>
                📹 {pack._count?.videos || 0} vidéo{(pack._count?.videos || 0) > 1 ? 's' : ''}
              </span>
              <span className={styles.packStat}>
                🛒 {pack._count?.purchases || 0} achat{(pack._count?.purchases || 0) > 1 ? 's' : ''}
              </span>
            </div>

            {pack.videos && pack.videos.length > 0 && (
              <div className={styles.packVideos}>
                <h4>Vidéos incluses :</h4>
                <ul>
                  {pack.videos.slice(0, 3).map((video) => (
                    <li key={video.id}>{video.title}</li>
                  ))}
                  {pack.videos.length > 3 && (
                    <li>... et {pack.videos.length - 3} autre{pack.videos.length - 3 > 1 ? 's' : ''}</li>
                  )}
                </ul>
              </div>
            )}
            
            <div className={styles.packActions}>
              <button
                onClick={() => onEdit(pack)}
                className={styles.editButton}
                disabled={deletingId === pack.id}
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => handleDelete(pack)}
                className={styles.deleteButton}
                disabled={deletingId === pack.id}
              >
                {deletingId === pack.id ? '⏳' : '🗑️'} Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

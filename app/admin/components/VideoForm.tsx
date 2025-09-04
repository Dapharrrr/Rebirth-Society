"use client"

import { useState, useEffect } from 'react'
import styles from './admin.module.scss'

type Pack = {
  id: string
  name: string
}

type Video = {
  id: string
  title: string
  description: string
  duration: number
  link: string
  packId?: string // Ajout optionnel
  pack?: { // Rendre pack optionnel
    id: string
    name: string
  }
}

interface VideoFormProps {
  packs: Pack[]
  onVideoAdded: (video: Video) => void
  onVideoUpdated: (video: Video) => void
  editingVideo?: Video | null
  onCancel: () => void
}

export default function VideoForm({ 
  packs, 
  onVideoAdded, 
  onVideoUpdated, 
  editingVideo, 
  onCancel 
}: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    link: '',
    packId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editingVideo) {
      setFormData({
        title: editingVideo.title,
        description: editingVideo.description,
        duration: editingVideo.duration.toString(),
        link: editingVideo.link,
        packId: editingVideo.pack?.id || editingVideo.packId || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        duration: '',
        link: '',
        packId: ''
      })
    }
  }, [editingVideo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = editingVideo ? `/api/videos/${editingVideo.id}` : '/api/videos'
      const method = editingVideo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error during save')
      }

      const video = await response.json()
      
      if (editingVideo) {
        onVideoUpdated(video)
      } else {
        onVideoAdded(video)
        setFormData({
          title: '',
          description: '',
          duration: '',
          link: '',
          packId: ''
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occured')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatDurationForDisplay = (seconds: string) => {
    const num = parseInt(seconds)
    if (isNaN(num)) return ''
    const minutes = Math.floor(num / 60)
    const secs = num % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Titre de la vidéo *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
          required
          placeholder="Titre de la vidéo"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
          required
          placeholder="Description de la vidéo"
          rows={3}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="duration" className={styles.label}>
            Durée (en secondes) *
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={styles.input}
            required
            min="1"
            placeholder="300"
          />
          {formData.duration && (
            <small className={styles.helper}>
              ≈ {formatDurationForDisplay(formData.duration)}
            </small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="packId" className={styles.label}>
            Pack *
          </label>
          <select
            id="packId"
            name="packId"
            value={formData.packId}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Sélectionner un pack</option>
            {packs.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="link" className={styles.label}>
          Lien de la vidéo *
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          className={styles.input}
          required
          placeholder="https://example.com/video.mp4"
        />
      </div>

      <div className={styles.formActions}>
        {editingVideo && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Sauvegarde...' : editingVideo ? 'Mettre à jour' : 'Ajouter la vidéo'}
        </button>
      </div>
    </form>
  )
}

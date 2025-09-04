"use client"

import { useState, useEffect } from 'react'
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

interface PackFormProps {
  onPackAdded: (pack: Pack) => void
  onPackUpdated: (pack: Pack) => void
  editingPack?: Pack | null
  onCancel: () => void
}

export default function PackForm({ 
  onPackAdded, 
  onPackUpdated, 
  editingPack, 
  onCancel 
}: PackFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editingPack) {
      setFormData({
        name: editingPack.name,
        description: editingPack.description,
        price: editingPack.price.toString(),
        image: editingPack.image,
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
      })
    }
    setError(null)
  }, [editingPack])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = editingPack ? `/api/packs/${editingPack.id}` : '/api/packs'
      const method = editingPack ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Réponse du serveur invalide')
      }

      const responseText = await response.text()

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la sauvegarde'
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Erreur ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const pack = JSON.parse(responseText)
      
      if (editingPack) {
        onPackUpdated(pack)
      } else {
        onPackAdded(pack)
        setFormData({
          name: '',
          description: '',
          price: '',
          image: '',
        })
      }
    } catch (err) {
      console.error('Submit error:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
    })
    setError(null)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Nom du pack *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          required
          placeholder="Nom du pack"
          disabled={loading}
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
          placeholder="Description du pack"
          rows={4}
          disabled={loading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="price" className={styles.label}>
          Prix (€) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className={styles.input}
          required
          min="0"
          step="0.01"
          placeholder="99.99"
          disabled={loading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image" className={styles.label}>
          URL de l'image *
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className={styles.input}
          required
          placeholder="https://example.com/image.jpg"
          disabled={loading}
        />
      </div>

      {formData.image && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Aperçu de l'image</label>
          <div className={styles.imagePreview}>
            <img 
              src={formData.image} 
              alt="Aperçu" 
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        </div>
      )}

      <div className={styles.formActions}>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? 'Sauvegarde...' : (editingPack ? 'Modifier le pack' : 'Créer le pack')}
        </button>

        {editingPack && (
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

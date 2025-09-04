"use client"

import { useState, useEffect } from 'react'
import VideoForm from './VideoForm'
import VideoList from './VideoList'
import styles from './admin.module.scss'
import { Navbar } from '../../components/Navbar'

type Video = {
  id: string
  title: string
  description: string
  duration: number
  link: string
  createdAt?: string
  updatedAt?: string
  packId?: string // Ajout optionnel
  pack?: { // Rendre pack optionnel
    id: string
    name: string
  }
}

type Pack = {
  id: string
  name: string
}

export default function AdminDashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('Fetching data...') // Debug
      
      const [videosResponse, packsResponse] = await Promise.all([
        fetch('/api/videos'),
        fetch('/api/packs')
      ])

      console.log('Videos response status:', videosResponse.status) // Debug
      console.log('Packs response status:', packsResponse.status) // Debug

      if (!videosResponse.ok || !packsResponse.ok) {
        throw new Error('Error fetching data from server')
      }

      const [videosData, packsData] = await Promise.all([
        videosResponse.json(),
        packsResponse.json()
      ])

      console.log('Videos data:', videosData) // Debug
      console.log('Packs data:', packsData) // Debug

      setVideos(videosData)
      setPacks(packsData)
    } catch (err) {
      console.error('Fetch error:', err) // Debug
      setError(err instanceof Error ? err.message : 'An error occured')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoAdded = (newVideo: Video) => {
    setVideos(prev => [newVideo, ...prev])
  }

  const handleVideoUpdated = (updatedVideo: Video) => {
    setVideos(prev => prev.map(video => 
      video.id === updatedVideo.id ? updatedVideo : video
    ))
    setEditingVideo(null)
  }

  const handleVideoDeleted = (videoId: string) => {
    setVideos(prev => prev.filter(video => video.id !== videoId))
  }

  const handleEdit = (video: Video) => {
    setEditingVideo(video)
  }

  const handleCancelEdit = () => {
    setEditingVideo(null)
  }

  if (loading) {
    return <div className={styles.loading}>Chargement des données...</div>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={fetchData} className={styles.retryButton}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
        <Navbar />
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {editingVideo ? 'Modifier la vidéo' : 'Ajouter une nouvelle vidéo'}
        </h2>
        <VideoForm
          packs={packs}
          onVideoAdded={handleVideoAdded}
          onVideoUpdated={handleVideoUpdated}
          editingVideo={editingVideo}
          onCancel={handleCancelEdit}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Liste des vidéos ({videos.length})
        </h2>
        <VideoList
          videos={videos}
          onEdit={handleEdit}
          onDelete={handleVideoDeleted}
        />
      </div>
    </div>
  )
}

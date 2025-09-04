"use client"

import { useState, useEffect } from 'react'
import VideoForm from './VideoForm'
import VideoList from './VideoList'
import PackForm from './PackForm'
import PackList from './PackList'
import styles from './admin.module.scss'
import { Navbar } from '@/app/components/Navbar'

interface Video {
  id: string
  title: string
  description: string
  duration: number
  link: string
  pack?: {
  createdAt?: string
  updatedAt?: string
  packId?: string 
  pack?: {
    id: string
    name: string
  }
}
}

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

export default function AdminDashboard() {
  const [videos, setVideos] = useState<Video[]>([])
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [editingPack, setEditingPack] = useState<Pack | null>(null)
  const [activeTab, setActiveTab] = useState<'videos' | 'packs'>('packs')

  useEffect(() => {
    fetchData()
  }, [])

const fetchData = async () => {
  setLoading(true)
  setError(null)

  // Loading videos
  try {
    console.log('Fetching videos...')
    const videosResponse = await fetch('/api/videos')
    if (videosResponse.ok) {
      const videosData = await videosResponse.json()
      setVideos(videosData)
      console.log('Videos loaded successfully:', videosData.length)
    } else {
      console.error('Videos failed:', videosResponse.status)
    }
  } catch (err) {
    console.error('Error loading videos:', err)
  }

  // Charger les packs
  try {
    console.log('Fetching packs...')
    const packsResponse = await fetch('/api/packs')
    if (packsResponse.ok) {
      const packsData = await packsResponse.json()
      setPacks(packsData)
      console.log('Packs loaded successfully:', packsData.length)
    } else {
      console.error('Packs failed:', packsResponse.status)
      // If packs API is not found, continue
      if (packsResponse.status === 404) {
        console.log('Packs API not found, continuing without packs')
        setPacks([])
      }
    }
  } catch (err) {
    console.error('Error loading packs:', err)
    setPacks([]) // Continue without packs
  }

  setLoading(false)
}

  // Video manager
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

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video)
    setActiveTab('videos')
  }

  const handleCancelEditVideo = () => {
    setEditingVideo(null)
  }

  // Pack manager
  const handlePackAdded = (newPack: Pack) => {
    setPacks(prev => [newPack, ...prev])
  }

  const handlePackUpdated = (updatedPack: Pack) => {
    setPacks(prev => prev.map(pack => 
      pack.id === updatedPack.id ? updatedPack : pack
    ))
    setEditingPack(null)
  }

  const handlePackDeleted = (packId: string) => {
    setPacks(prev => prev.filter(pack => pack.id !== packId))
  }

  const handleEditPack = (pack: Pack) => {
    setEditingPack(pack)
    setActiveTab('packs')
  }

  const handleCancelEditPack = () => {
    setEditingPack(null)
  }

  if (loading) {
    return <div className={styles.loading}>Loading data...</div>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={fetchData} className={styles.retryButton}>
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <Navbar />
      <div className={styles.dashboardHeader}>
        <h1>Administration</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'packs' ? styles.active : ''}`}
            onClick={() => setActiveTab('packs')}
          >
            Packs Manager ({packs.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'videos' ? styles.active : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos Manager ({videos.length})
          </button>
        </div>
      </div>

      {activeTab === 'packs' && (
        <>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {editingPack ? 'Modify pack' : 'Create a new pack'}
            </h2>
            <PackForm
              onPackAdded={handlePackAdded}
              onPackUpdated={handlePackUpdated}
              editingPack={editingPack}
              onCancel={handleCancelEditPack}
            />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Liste des packs ({packs.length})
            </h2>
            <PackList
              packs={packs}
              onEdit={handleEditPack}
              onDelete={handlePackDeleted}
            />
          </div>
        </>
      )}

      {activeTab === 'videos' && (
        <>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {editingVideo ? 'Modify video' : 'Add a new video'}
            </h2>
            <VideoForm
              packs={packs.map(pack => ({ id: pack.id, name: pack.name }))}
              onVideoAdded={handleVideoAdded}
              onVideoUpdated={handleVideoUpdated}
              editingVideo={editingVideo}
              onCancel={handleCancelEditVideo}
            />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Liste des vidéos ({videos.length})
            </h2>
            <VideoList
              videos={videos}
              onEdit={handleEditVideo}
              onDelete={handleVideoDeleted}
            />
          </div>
        </>
      )}
    </div>
  )
}

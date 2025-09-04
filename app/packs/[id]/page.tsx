import { notFound } from 'next/navigation'
import { prisma } from '../../lib/prisma'
import Image from 'next/image'
import styles from './pack-detail.module.scss'
import { Navbar } from "../../components/Navbar";

interface PackPageProps {
  params: {
    id: string
  }
}
async function getPackById(id: string) {
  try {
    const pack = await prisma.pack.findUnique({
      where: { id },
      include: {
        videos: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            videos: true
          }
        }
      }
    })

    return pack
  } catch (error) {
    console.error('Erreur lors de la récupération du pack:', error)
    return null
  }
}

export default async function PackPage({ params }: PackPageProps) {
  const pack = await getPackById(params.id)

  if (!pack) {
    notFound()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const totalDuration = pack.videos.reduce((total, video) => total + video.duration, 0)

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.hero}>
        <div className={styles.imageContainer}>
          <Image
            src={pack.image}
            alt={pack.name}
            fill
            className={styles.heroImage}
            priority
          />
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{pack.name}</h1>
          <p className={styles.description}>{pack.description}</p>
          
          <div className={styles.meta}>
            <span className={styles.price}>${pack.price.toFixed(2)}</span>
            <span className={styles.videoCount}>
              {pack._count.videos} vidéo{pack._count.videos > 1 ? 's' : ''}
            </span>
            <span className={styles.duration}>
              {formatDuration(totalDuration)} au total
            </span>
          </div>

          <div className={styles.actions}>
            <button className={styles.buyButton}>
              Acheter ce pack
            </button>

          </div>
        </div>
      </div>

      <section className={styles.videosSection}>
        <h2 className={styles.sectionTitle}>Contenu du pack</h2>
        <div className={styles.videosList}>
          {pack.videos.map((video, index) => (
            <div key={video.id} className={styles.videoItem}>
              <div className={styles.videoNumber}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
                <p className={styles.videoDescription}>{video.description}</p>
              </div>
              <div className={styles.videoDuration}>
                {formatDuration(video.duration)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// Génération des métadonnées dynamiques
export async function generateMetadata({ params }: PackPageProps) {
  const pack = await getPackById(params.id)
  
  if (!pack) {
    return {
      title: 'Pack non trouvé'
    }
  }

  return {
    title: `${pack.name} - Packs de danse`,
    description: pack.description,
    openGraph: {
      title: pack.name,
      description: pack.description,
      images: [pack.image],
    },
  }
}

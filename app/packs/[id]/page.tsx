import { notFound } from 'next/navigation'
import { prisma } from '../../lib/prisma'
import Image from 'next/image'
import styles from './pack-detail.module.scss'
import { Navbar } from "../../components/Navbar";
import BuyButton from '../../components/BuyButton';
import VideosList from '../../components/VideosList';

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
            link: true,
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
    console.error('Error retrieving the pack:', error)
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
              {pack._count.videos} video{pack._count.videos > 1 ? 's' : ''}
            </span>
            <span className={styles.duration}>
              {formatDuration(totalDuration)} in total
            </span>
          </div>

          <div className={styles.actions}>
            <BuyButton price={pack.price} productName={pack.name} packId={pack.id} />
          </div>
        </div>
      </div>

      <section className={styles.videosSection}>
        <h2 className={styles.sectionTitle}>Pack&apos;s content</h2>
        <div className={styles.videosList}>
          {/* Use client-side VideosList which verifies payment on return */}

          <VideosList videos={pack.videos} packId={pack.id} price={pack.price} productName={pack.name} />
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

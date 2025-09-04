import Link from 'next/link'
import styles from './not-found.module.scss'

export default function PackNotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pack non trouvé</h1>
      <p className={styles.description}>
        Désolé, le pack que vous recherchez n&apos;existe pas ou a été supprimé.
      </p>
      <Link href="/" className={styles.homeLink}>
        Retourner à l&apos;accueil
      </Link>
    </div>
  )
}

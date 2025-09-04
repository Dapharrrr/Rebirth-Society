import Link from 'next/link'
import styles from './not-found.module.scss'

export default function PackNotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pack non trouvé</h1>
      <p className={styles.description}>
        Sorry, the pack you are looking for does not exist anymore.
      </p>
      <Link href="/" className={styles.homeLink}>
        Go back to home.
      </Link>
    </div>
  )
}

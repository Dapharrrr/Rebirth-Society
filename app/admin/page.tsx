import { Suspense } from 'react'
import AdminDashboard from './components/AdminDashboard'
import styles from './components/admin.module.scss'

export default function AdminPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
      </header>

      <Suspense fallback={<div className={styles.loading}>Chargement...</div>}>
        <AdminDashboard />
      </Suspense>
    </div>
  )
}

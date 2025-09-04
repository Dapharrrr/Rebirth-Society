"use client";

import { Suspense } from 'react';
import AdminDashboard from './components/AdminDashboard';
import AdminGuard from './components/AdminGuard';
import styles from './components/admin.module.scss';

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className={styles.container}>
        <header className={styles.header}>
        </header>

        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
          <AdminDashboard />
        </Suspense>
      </div>
    </AdminGuard>
  );
}

"use client";

import Link from 'next/link';
import { useIsAdmin } from '../admin/components/AdminGuard';

interface AdminLinkProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AdminLink({ className, children }: AdminLinkProps) {
  const { isAdmin, isLoading } = useIsAdmin();

  // Ne pas afficher le lien pendant le chargement ou si pas admin
  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link href="/admin" className={className}>
      {children || 'Admin'}
    </Link>
  );
} 
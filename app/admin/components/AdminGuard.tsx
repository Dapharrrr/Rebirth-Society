/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_EMAILS, isAdminEmail } from '../config/adminConfig';

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const userRaw = localStorage.getItem('user');
        if (!userRaw) {
          router.push('/login?next=/admin');
          return;
        }

        const user = JSON.parse(userRaw);
        const isAdmin = isAdminEmail(user.email);

        if (!isAdmin) {
          router.push('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/login?next=/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return fallback || <div>Vérification des droits d&apos;accès...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// Hook pour vérifier si l'utilisateur est admin
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        const user = JSON.parse(userRaw);
        setIsAdmin(isAdminEmail(user.email));
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isAdmin, isLoading };
} 
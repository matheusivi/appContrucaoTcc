'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        router.replace('/login');
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      router.replace('/login');
    }
  }, [router]);
}

'use client';
import { useEffect } from 'react';
import { clearBirthSession } from '@/lib/birthSession';

export default function ClearBirthSession() {
  useEffect(() => {
    clearBirthSession();
    const clearOnReturn = () => {
      if (window.location.pathname === '/') clearBirthSession();
    };
    window.addEventListener('pageshow', clearOnReturn);
    return () => window.removeEventListener('pageshow', clearOnReturn);
  }, []);
  return null;
}

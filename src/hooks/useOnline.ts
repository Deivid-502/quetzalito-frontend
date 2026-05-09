'use client';

import { useEffect, useState } from 'react';

/**
 * Detecta si el navegador tiene conexión.
 * Usa navigator.onLine + eventos online/offline. No 100% certero
 * (el navegador puede reportar online si hay wifi pero no internet),
 * pero es la heurística estándar y suficiente para nuestro UX.
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    function on() { setOnline(true); }
    function off() { setOnline(false); }
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return online;
}

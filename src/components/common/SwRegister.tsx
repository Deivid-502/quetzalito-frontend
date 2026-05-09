'use client';

import { useEffect } from 'react';

/**
 * Registra el service worker apenas carga la app.
 * En desarrollo también funciona — Next.js sirve /sw.js como estático.
 *
 * NO renderiza nada. Pensado para mountarse una vez en root layout.
 */
export function SwRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    // Sólo en producción para evitar problemas de hot-reload contra cache
    if (process.env.NODE_ENV !== 'production') return;

    const onLoad = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          // Si hay nueva versión esperando → activá inmediatamente
          if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          reg.addEventListener('updatefound', () => {
            const sw = reg.installing;
            if (!sw) return;
            sw.addEventListener('statechange', () => {
              if (sw.state === 'installed' && navigator.serviceWorker.controller) {
                sw.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          });
        })
        .catch((err) => {
          // Falla del SW no debe romper la app
          console.warn('[SW] registro falló:', err);
        });
    };

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return null;
}

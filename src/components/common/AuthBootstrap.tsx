'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Inicializa la sesión apenas carga la app (en CUALQUIER ruta, pública o privada).
 * Llama /auth/me usando las cookies HttpOnly. Si la cookie es válida, popula
 * el user en el store; si no, queda como null. AuthGuard usa este resultado
 * para decidir redirecciones; el landing público lo usa para mostrar el CTA
 * correcto ("Ir a mi dashboard" vs "Iniciar sesión").
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const initialized = useAuthStore((s) => s.initialized);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    if (!initialized) {
      void fetchMe();
    }
  }, [initialized, fetchMe]);

  return <>{children}</>;
}

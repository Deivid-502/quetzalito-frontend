'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Guarda rutas privadas. NO hace fetch — eso lo maneja AuthBootstrap globalmente.
 * Solo:
 *   - espera a que la app esté inicializada
 *   - si no hay user → redirige a /login conservando la URL para volver luego
 *   - mientras tanto, muestra spinner para evitar flash de contenido privado
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && !user) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    }
  }, [initialized, user, router, pathname]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return null; // redirección en curso
  }

  return <>{children}</>;
}

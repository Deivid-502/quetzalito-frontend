'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';
import type { User } from '@/types/user';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'qz_theme';

interface ThemeCtx {
  /** El modo actualmente "configurado" (puede ser 'system') */
  mode: ThemeMode;
  /** El modo realmente aplicado tras resolver 'system' (light o dark) */
  resolved: 'light' | 'dark';
  /**
   * Cambia el tema desde una pantalla pública (landing/login/registro).
   *  · Si hay sesión activa → persiste en la BD del usuario.
   *  · Si NO hay sesión     → persiste en localStorage.
   *
   * En ambos casos el tema se refleja inmediatamente en pantalla.
   */
  setPublicTheme: (mode: ThemeMode) => Promise<void> | void;
  /** Alternancia rápida light ⟷ dark (para el botón único en landing) */
  toggle: () => Promise<void> | void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function readStorageTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

function writeStorageTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, mode);
}

/**
 * Aplica el tema visual a <html>:
 *  · Si hay usuario autenticado → user.theme (preferencia guardada en BD)
 *  · Si NO hay usuario          → tema público (localStorage), default 'system'
 *
 * Funciona en TODA la app: landing pública, login, dashboard, etc.
 *
 * El cambio desde el ThemeToggle público funciona igual aunque haya sesión
 * activa — escribe a la BD para que persista y no aparezcan saltos visuales
 * al volver a una ruta privada.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore((s) => s.user?.id);
  const userTheme = useAuthStore((s) => s.user?.theme as ThemeMode | undefined);
  const patchUser = useAuthStore((s) => s.patchUser);

  const [publicTheme, setPublicThemeState] = useState<ThemeMode>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  // Leer localStorage al montar (solo cliente)
  useEffect(() => {
    setPublicThemeState(readStorageTheme());
  }, []);

  const effective: ThemeMode = userTheme ?? publicTheme;

  // Aplicar a <html> y suscribirse a cambios del SO si modo 'system'
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    function apply(mode: ThemeMode) {
      const dark = mode === 'dark' || (mode === 'system' && mql.matches);
      root.classList.toggle('dark', dark);
      setResolved(dark ? 'dark' : 'light');
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#0F172A' : '#10B981');
    }

    apply(effective);

    if (effective === 'system') {
      const handler = () => apply('system');
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [effective]);

  const setPublicTheme = useCallback(
    async (mode: ThemeMode) => {
      // Optimistic UI: aplicamos el cambio visual de inmediato
      writeStorageTheme(mode);
      setPublicThemeState(mode);

      // Si hay sesión, también persistimos en BD para coherencia entre pestañas/dispositivos
      if (userId) {
        try {
          await api.patch<{ theme: string }>('/users/me/preferences', { theme: mode });
          patchUser({ theme: mode as User['theme'] });
        } catch {
          // Si falla el backend, al menos quedó en localStorage. No mostramos toast
          // porque el cambio de tema es una acción de bajo riesgo y el usuario ya vio
          // el cambio visual; un toast sería ruidoso.
        }
      }
    },
    [userId, patchUser],
  );

  const toggle = useCallback(() => {
    // Alternancia light/dark saltando 'system' (para botón único en landing)
    return setPublicTheme(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setPublicTheme]);

  return (
    <Ctx.Provider value={{ mode: effective, resolved, setPublicTheme, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}

'use client';

import { useCallback, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@/types/user';

export interface PreferencesPayload {
  language?: 'es' | 'en';
  currencyCode?: string;
  theme?: 'light' | 'dark' | 'system';
}

export function usePreferences() {
  const patchUser = useAuthStore((s) => s.patchUser);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (changes: PreferencesPayload) => {
      setSaving(true);
      setError(null);
      try {
        const result = await api.patch<{
          language: string;
          currencyCode: string;
          theme: string;
        }>('/users/me/preferences', changes);
        // Aplicamos al store local para reflejo inmediato (tema/idioma cambian en UI al instante)
        patchUser({
          language: result.language as User['language'],
          currencyCode: result.currencyCode,
          theme: result.theme as User['theme'],
        });
        return result;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'No pudimos guardar tus preferencias.';
        setError(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [patchUser],
  );

  return { update, saving, error };
}

export interface ProfilePayload {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  phone?: string;
  /**
   * Avatar:
   *  · string → setea URL
   *  · null   → borra avatar (vuelve a iniciales)
   *  · undefined (omitido) → no cambia
   */
  avatarUrl?: string | null;
}

export function useProfile() {
  const patchUser = useAuthStore((s) => s.patchUser);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (changes: ProfilePayload) => {
      setSaving(true);
      setError(null);
      try {
        const result = await api.patch<{
          firstName: string;
          lastName: string;
          nickname: string;
          phone: string | null;
          avatarUrl: string | null;
        }>('/users/me', changes);
        patchUser(result);
        return result;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'No pudimos guardar tu perfil.';
        setError(msg);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [patchUser],
  );

  return { update, saving, error };
}

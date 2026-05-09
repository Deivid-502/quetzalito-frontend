'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import type { SubscriptionStatus } from '@/types/subscription';

export function useSubscription() {
  const patchUser = useAuthStore((s) => s.patchUser);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<SubscriptionStatus>('/subscriptions/me');
      setStatus(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar tu plan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const activate = useCallback(async () => {
    const res = await api.post<{ ok: true; subscription: { endsAt: string } }>(
      '/subscriptions/activate',
    );
    patchUser({ isPremium: true });
    await fetch();
    return res;
  }, [fetch, patchUser]);

  const cancel = useCallback(async () => {
    await api.post('/subscriptions/cancel');
    patchUser({ isPremium: false });
    await fetch();
  }, [fetch, patchUser]);

  return { status, loading, error, refresh: fetch, activate, cancel };
}

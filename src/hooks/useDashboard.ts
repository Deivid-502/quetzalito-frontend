'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { onChange, QZ_EVENTS } from '@/lib/events';
import type { DashboardResponse } from '@/types/dashboard';

export function useDashboard(year?: number, month?: number) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (year !== undefined) params.set('year', String(year));
      if (month !== undefined) params.set('month', String(month));
      const q = params.toString();
      const res = await api.get<DashboardResponse>(`/dashboard${q ? '?' + q : ''}`);
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar tu dashboard.');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  useEffect(() => {
    const off1 = onChange(QZ_EVENTS.TX_CHANGED, () => void fetch());
    const off2 = onChange(QZ_EVENTS.ENVELOPE_CHANGED, () => void fetch());
    return () => { off1(); off2(); };
  }, [fetch]);

  return { data, loading, error, refresh: fetch };
}

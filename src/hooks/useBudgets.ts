'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { emitChange, onChange, QZ_EVENTS } from '@/lib/events';
import type { BudgetPeriodResponse, UpsertBudgetPayload } from '@/types/budget';

export function useBudgets(year: number, month: number) {
  const [data, setData] = useState<BudgetPeriodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<BudgetPeriodResponse>(
        `/budgets?year=${year}&month=${month}`,
      );
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar tus presupuestos.');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  // Cambios de movimientos afectan el % gastado de cada presupuesto
  useEffect(() => {
    return onChange(QZ_EVENTS.TX_CHANGED, () => void fetch());
  }, [fetch]);

  const upsert = useCallback(
    async (payload: UpsertBudgetPayload) => {
      await api.post('/budgets', payload);
      // El propio fetch se dispara enseguida; no necesita evento global
      await fetch();
    },
    [fetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.delete(`/budgets/${id}`);
      await fetch();
    },
    [fetch],
  );

  return { data, loading, error, refresh: fetch, upsert, remove };
}

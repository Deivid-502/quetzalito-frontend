'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { emitChange, onChange, QZ_EVENTS } from '@/lib/events';
import type {
  Transaction,
  TransactionListResponse,
  CreateTransactionPayload,
  TransactionFilters,
} from '@/types/transaction';

function buildQuery(filters: TransactionFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  const q = params.toString();
  return q ? `?${q}` : '';
}

export function useTransactions(initial: TransactionFilters = {}) {
  const [filters, setFilters] = useState<TransactionFilters>(initial);
  const [data, setData] = useState<TransactionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<TransactionListResponse>(`/transactions${buildQuery(filters)}`);
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar los movimientos.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  useEffect(() => {
    return onChange(QZ_EVENTS.TX_CHANGED, () => void fetch());
  }, [fetch]);

  const create = useCallback(async (payload: CreateTransactionPayload) => {
    const tx = await api.post<Transaction>('/transactions', payload);
    emitChange(QZ_EVENTS.TX_CHANGED);
    return tx;
  }, []);

  const remove = useCallback(async (id: string) => {
    await api.delete(`/transactions/${id}`);
    emitChange(QZ_EVENTS.TX_CHANGED);
  }, []);

  const update = useCallback(
    async (id: string, payload: Partial<CreateTransactionPayload>) => {
      const tx = await api.patch<Transaction>(`/transactions/${id}`, payload);
      emitChange(QZ_EVENTS.TX_CHANGED);
      return tx;
    },
    [],
  );

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetch,
    create,
    update,
    remove,
  };
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { emitChange, onChange, QZ_EVENTS } from '@/lib/events';
import type {
  Envelope,
  EnvelopeListResponse,
  EnvelopeDetailResponse,
  CreateEnvelopePayload,
  UpdateEnvelopePayload,
  TransferPayload,
} from '@/types/envelope';

interface UseEnvelopesState {
  envelopes: Envelope[];
  totalBalance: number;
  loading: boolean;
  error: string | null;
}

export function useEnvelopes() {
  const [state, setState] = useState<UseEnvelopesState>({
    envelopes: [],
    totalBalance: 0,
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await api.get<EnvelopeListResponse>('/envelopes');
      setState({
        envelopes: data.envelopes,
        totalBalance: data.totalBalance,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof ApiError ? err.message : 'No pudimos cargar tus sobres.',
      }));
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  // Re-fetch en cualquier cambio que afecte saldos o el listado
  useEffect(() => {
    const off1 = onChange(QZ_EVENTS.TX_CHANGED, () => void fetch());
    const off2 = onChange(QZ_EVENTS.ENVELOPE_CHANGED, () => void fetch());
    return () => { off1(); off2(); };
  }, [fetch]);

  const create = useCallback(
    async (payload: CreateEnvelopePayload): Promise<Envelope> => {
      const created = await api.post<Envelope>('/envelopes', payload);
      emitChange(QZ_EVENTS.ENVELOPE_CHANGED);
      // Si tuvo saldo inicial, también afectó balances vía transferencia interna
      if (payload.initialAmount && payload.initialAmount > 0) {
        emitChange(QZ_EVENTS.TX_CHANGED);
      }
      return created;
    },
    [],
  );

  const update = useCallback(
    async (id: string, payload: UpdateEnvelopePayload): Promise<Envelope> => {
      const updated = await api.patch<Envelope>(`/envelopes/${id}`, payload);
      emitChange(QZ_EVENTS.ENVELOPE_CHANGED);
      return updated;
    },
    [],
  );

  const archive = useCallback(
    async (id: string): Promise<void> => {
      await api.post(`/envelopes/${id}/archive`);
      emitChange(QZ_EVENTS.ENVELOPE_CHANGED);
      // Archivar puede haber generado una transferencia interna
      emitChange(QZ_EVENTS.TX_CHANGED);
    },
    [],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await api.delete(`/envelopes/${id}`);
      emitChange(QZ_EVENTS.ENVELOPE_CHANGED);
    },
    [],
  );

  const transfer = useCallback(
    async (payload: TransferPayload) => {
      const result = await api.post('/envelopes/transfer', payload);
      emitChange(QZ_EVENTS.TX_CHANGED);
      return result;
    },
    [],
  );

  return { ...state, refresh: fetch, create, update, archive, remove, transfer };
}

export function useEnvelopeDetail(id: string | null) {
  const [data, setData] = useState<EnvelopeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const d = await api.get<EnvelopeDetailResponse>(`/envelopes/${id}`);
      setData(d);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar este sobre.');
    } finally {
      setLoading(false);
    }
  }, [id]);

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

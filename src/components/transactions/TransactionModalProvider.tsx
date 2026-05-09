'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { TransactionFormModal } from '@/components/transactions/TransactionFormModal';
import { useAuthStore } from '@/stores/auth.store';
import { api, ApiError } from '@/lib/api';
import { emitChange, QZ_EVENTS } from '@/lib/events';
import { enqueueTransaction } from '@/lib/offline/sync';
import { toast } from '@/components/ui/Toaster';
import type { CreateTransactionPayload, Transaction } from '@/types/transaction';

interface OpenOptions {
  defaultType?: 'income' | 'expense';
  defaultEnvelopeId?: string;
  onCreated?: (tx: Transaction) => void;
}

interface Ctx {
  open: (opts?: OpenOptions) => void;
}

const TransactionModalContext = createContext<Ctx | null>(null);

export function TransactionModalProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOptions>({});

  const open = useCallback((o?: OpenOptions) => {
    setOpts(o ?? {});
    setIsOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (payload: CreateTransactionPayload): Promise<Transaction> => {
      try {
        const tx = await api.post<Transaction>('/transactions', payload);
        opts.onCreated?.(tx);
        emitChange(QZ_EVENTS.TX_CHANGED);
        return tx;
      } catch (err) {
        // Si es error de red → encolar offline en lugar de fallar
        if (err instanceof ApiError && err.isNetworkError) {
          await enqueueTransaction(payload);
          window.dispatchEvent(new CustomEvent('quetzalito:queued'));
          toast.info('Sin conexión: guardado localmente. Se sincronizará al volver internet.');
          // Devolvemos un placeholder coherente con la firma esperada
          return {
            id: `pending-${Date.now()}`,
            type: payload.type,
            amount: payload.amount,
            description: payload.description ?? null,
            occurredAt: payload.occurredAt ?? new Date().toISOString(),
            envelope: { id: payload.envelopeId, name: '', icon: '', color: '' },
            category: null,
            relatedTransactionId: null,
            createdAt: new Date().toISOString(),
          } as unknown as Transaction;
        }
        throw err;
      }
    },
    [opts],
  );

  return (
    <TransactionModalContext.Provider value={{ open }}>
      {children}
      {isOpen && (
        <TransactionFormModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          defaultType={opts.defaultType ?? 'expense'}
          defaultEnvelopeId={opts.defaultEnvelopeId}
          currency={user?.currencyCode ?? 'GTQ'}
          onSubmit={handleSubmit}
        />
      )}
    </TransactionModalContext.Provider>
  );
}

export function useTransactionModal(): Ctx {
  const ctx = useContext(TransactionModalContext);
  if (!ctx) {
    throw new Error('useTransactionModal debe usarse dentro de TransactionModalProvider');
  }
  return ctx;
}

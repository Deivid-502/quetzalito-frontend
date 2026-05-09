'use client';

import { api, ApiError } from '@/lib/api';
import { emitChange, QZ_EVENTS } from '@/lib/events';
import { getDB, type PendingTransaction } from './db';
import type { CreateTransactionPayload } from '@/types/transaction';

const MAX_ATTEMPTS = 5;

/**
 * Encola un movimiento para sincronizar luego.
 * No emite TX_CHANGED porque la transacción todavía no existe en el backend;
 * los hooks que listan transacciones la verán recién después del sync.
 */
export async function enqueueTransaction(
  payload: CreateTransactionPayload,
): Promise<PendingTransaction> {
  const db = getDB();
  const entry: PendingTransaction = {
    payload,
    createdAt: Date.now(),
    status: 'pending',
    attempts: 0,
  };
  const id = await db.pendingTransactions.add(entry);
  return { ...entry, id };
}

/**
 * Cuenta entradas pendientes (estado 'pending' o 'failed' aún recuperables).
 */
export async function countPending(): Promise<number> {
  const db = getDB();
  return db.pendingTransactions
    .where('status')
    .anyOf(['pending', 'failed'])
    .count();
}

/**
 * Procesa la cola. Concurrencia 1 (secuencial) para preservar orden cronológico.
 *
 * Reglas:
 *   · Si la POST devuelve 2xx → eliminamos la entrada y emitimos TX_CHANGED.
 *   · Si devuelve 400 (validación), 401/403 (auth) → marcamos failed y NO reintentamos.
 *   · Si es error de red → la dejamos pending para próximo intento.
 *   · Tras MAX_ATTEMPTS → failed permanentemente; el usuario lo verá en UI.
 */
export async function syncQueue(): Promise<{
  synced: number;
  remaining: number;
  failed: number;
}> {
  const db = getDB();
  const candidates = await db.pendingTransactions
    .where('status')
    .anyOf(['pending', 'failed'])
    .toArray();

  let synced = 0;
  let failed = 0;

  for (const item of candidates) {
    if (!item.id) continue;
    if (item.status === 'failed' && item.attempts >= MAX_ATTEMPTS) {
      failed += 1;
      continue;
    }
    // Lock
    await db.pendingTransactions.update(item.id, { status: 'syncing' });
    try {
      await api.post('/transactions', item.payload);
      await db.pendingTransactions.delete(item.id);
      synced += 1;
    } catch (err) {
      const newAttempts = item.attempts + 1;
      const apiErr = err instanceof ApiError ? err : null;
      const isPermanent =
        apiErr && (apiErr.status === 400 || apiErr.status === 401 || apiErr.status === 403);
      const newStatus: PendingTransaction['status'] =
        isPermanent || newAttempts >= MAX_ATTEMPTS ? 'failed' : 'pending';

      await db.pendingTransactions.update(item.id, {
        status: newStatus,
        attempts: newAttempts,
        lastError: apiErr?.message ?? 'Error de red',
      });

      if (newStatus === 'failed') failed += 1;
      // Si no es permanente y aún quedan intentos, paramos el bucle
      // (probable que la red siga caída → no hace falta golpear más)
      if (!isPermanent) break;
    }
  }

  if (synced > 0) emitChange(QZ_EVENTS.TX_CHANGED);

  const remaining = await countPending();
  return { synced, remaining, failed };
}

/**
 * Elimina entradas marcadas como failed permanentemente.
 * Útil para que el usuario "limpie" su cola desde UI.
 */
export async function purgeFailed(): Promise<number> {
  const db = getDB();
  return db.pendingTransactions.where('status').equals('failed').delete();
}

import Dexie, { type Table } from 'dexie';
import type { CreateTransactionPayload } from '@/types/transaction';

/**
 * Estados posibles de un movimiento offline:
 *   pending    → en cola, pendiente de sincronizar
 *   syncing    → en proceso de POST al backend (lock para evitar duplicados)
 *   failed     → último intento falló con error no recuperable (ej. 400)
 *
 * Las entradas synced se eliminan apenas el backend confirma 200/201.
 */
export type PendingStatus = 'pending' | 'syncing' | 'failed';

export interface PendingTransaction {
  /** ID local autogenerado (NO es el id del backend) */
  id?: number;
  /** Payload tal como lo enviaríamos a POST /transactions */
  payload: CreateTransactionPayload;
  /** Cuándo lo creó el usuario localmente */
  createdAt: number;
  /** Estado actual */
  status: PendingStatus;
  /** Último error legible si status === 'failed' */
  lastError?: string;
  /** Cuántas veces se ha intentado sincronizar */
  attempts: number;
}

class QuetzalitoDB extends Dexie {
  pendingTransactions!: Table<PendingTransaction, number>;

  constructor() {
    super('quetzalito');
    this.version(1).stores({
      // ++id = autoincrement, índices secundarios por status y createdAt
      pendingTransactions: '++id, status, createdAt',
    });
  }
}

// Singleton — la conexión a IndexedDB persiste en window
let _db: QuetzalitoDB | null = null;

export function getDB(): QuetzalitoDB {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB sólo está disponible en el cliente.');
  }
  if (!_db) _db = new QuetzalitoDB();
  return _db;
}

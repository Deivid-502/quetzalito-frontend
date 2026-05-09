'use client';

import { useCallback, useEffect, useState } from 'react';
import { countPending, syncQueue, purgeFailed } from '@/lib/offline/sync';
import { useOnline } from './useOnline';

/**
 * Manejo unificado de la cola offline:
 *   - cuenta de pendientes (refresca tras cada intento)
 *   - flag de sincronización en curso
 *   - auto-sync cuando vuelve la conexión
 *   - acción manual purgeFailed()
 *
 * Pensado para montarse una sola vez (en SwRegister o similar) — pero los
 * componentes consumidores (header indicator) pueden invocarlo con costo casi nulo.
 */
export function useOfflineQueue() {
  const online = useOnline();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const refreshCount = useCallback(async () => {
    try {
      const c = await countPending();
      setPendingCount(c);
    } catch {
      /* IndexedDB puede no estar disponible (Safari privado, etc.) */
    }
  }, []);

  const sync = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await syncQueue();
    } finally {
      await refreshCount();
      setSyncing(false);
    }
  }, [syncing, refreshCount]);

  // Conteo inicial
  useEffect(() => { void refreshCount(); }, [refreshCount]);

  // Auto-sync cuando vuelve la conexión
  useEffect(() => {
    if (online && pendingCount > 0) {
      void sync();
    }
  }, [online, pendingCount, sync]);

  // Refresca el conteo cuando otra parte de la app encola algo
  useEffect(() => {
    function onQueued() { void refreshCount(); }
    window.addEventListener('quetzalito:queued', onQueued);
    return () => window.removeEventListener('quetzalito:queued', onQueued);
  }, [refreshCount]);

  return {
    online,
    pendingCount,
    syncing,
    sync,
    refresh: refreshCount,
    purgeFailed: async () => {
      await purgeFailed();
      await refreshCount();
    },
  };
}

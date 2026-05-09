'use client';

import { CloudOff, RefreshCw } from 'lucide-react';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { cn } from '@/lib/utils';

/**
 * Mini-chip que aparece en el header cuando:
 *   - el navegador está offline → "Sin conexión"
 *   - hay items en la cola → "Sincronizando" o "N pendiente(s)"
 *
 * Se OCULTA cuando estás online sin pendientes (no agrega ruido visual).
 */
export function OnlineIndicator() {
  const { online, pendingCount, syncing, sync } = useOfflineQueue();

  // Caso 1: todo bien — no mostramos nada
  if (online && pendingCount === 0 && !syncing) return null;

  // Caso 2: offline
  if (!online) {
    return (
      <span
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
          'border-amber-300 bg-amber-50 text-amber-800',
          'dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300',
        )}
        title="Estás sin conexión. Tus cambios se guardan localmente."
      >
        <CloudOff className="h-3 w-3" />
        Offline
        {pendingCount > 0 && <span className="opacity-80">· {pendingCount}</span>}
      </span>
    );
  }

  // Caso 3: online + sincronizando
  if (syncing) {
    return (
      <span
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
          'border-brand-300 bg-brand-50 text-brand-700',
          'dark:border-brand-700/50 dark:bg-brand-900/20 dark:text-brand-300',
        )}
      >
        <RefreshCw className="h-3 w-3 animate-spin" />
        Sincronizando…
      </span>
    );
  }

  // Caso 4: online + pendientes (auto-sync no logró completar todo)
  return (
    <button
      onClick={() => void sync()}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
        'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100',
        'dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300',
      )}
      title="Reintentar sincronización"
    >
      <RefreshCw className="h-3 w-3" />
      {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
    </button>
  );
}

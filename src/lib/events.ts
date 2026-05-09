/**
 * Eventos globales de cambios de datos.
 * Cualquier hook que cachee datos derivados (sobres, transacciones,
 * presupuestos) debe escuchar estos eventos y refrescar.
 */

export const QZ_EVENTS = {
  /** Algo cambió en transacciones (crear, editar, eliminar) → afecta saldos */
  TX_CHANGED: 'quetzalito:tx-changed',
  /** Cambió un sobre (CRUD) → afecta lista global */
  ENVELOPE_CHANGED: 'quetzalito:envelope-changed',
} as const;

export function emitChange(event: (typeof QZ_EVENTS)[keyof typeof QZ_EVENTS]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(event));
  }
}

export function onChange(
  event: (typeof QZ_EVENTS)[keyof typeof QZ_EVENTS],
  handler: () => void,
): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(event, handler);
  return () => window.removeEventListener(event, handler);
}

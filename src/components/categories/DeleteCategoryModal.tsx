'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/lib/icons';
import { ApiError, api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import type { Category } from '@/types/category';

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  allCategories: Category[];
  onDeleted: () => void;
}

export function DeleteCategoryModal({
  open,
  onClose,
  category,
  allCategories,
  onDeleted,
}: Props) {
  const [needsReassign, setNeedsReassign] = useState(false);
  const [count, setCount] = useState(0);
  const [reassignTo, setReassignTo] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sondear si la categoría tiene movimientos antes de mostrar opciones
  useEffect(() => {
    if (!open || !category) return;
    setError(null);
    setNeedsReassign(false);
    setCount(0);
    setReassignTo('');

    (async () => {
      try {
        await api.delete(`/categories/${category.id}`);
        // Si llegó aquí sin error, ya se borró (no tenía movimientos)
        toast.success('Categoría eliminada.');
        onDeleted();
        onClose();
      } catch (err) {
        if (err instanceof ApiError && err.status === 400) {
          // Tiene movimientos, requiere reasignación
          const m = err.message.match(/(\d+)/);
          setCount(m ? parseInt(m[1], 10) : 0);
          setNeedsReassign(true);
        } else {
          setError(err instanceof ApiError ? err.message : 'No pudimos eliminar la categoría.');
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category]);

  const compatibleTargets = (category && allCategories.filter((c) => {
    if (c.id === category.id) return false;
    if (category.type === 'both') return true;
    return c.type === 'both' || c.type === category.type;
  })) ?? [];

  async function handleConfirm() {
    if (!category) return;
    if (needsReassign && !reassignTo) {
      setError('Seleccioná la categoría a la que mover los movimientos.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const url = needsReassign
        ? `/categories/${category.id}?reassignTo=${reassignTo}`
        : `/categories/${category.id}`;
      await api.delete(url);
      toast.success(needsReassign ? 'Categoría eliminada y movimientos reasignados.' : 'Categoría eliminada.');
      onDeleted();
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'No pudimos eliminar la categoría.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!category) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">Eliminar “{category.name}”</h3>
        {needsReassign ? (
          <p className="mt-1.5 text-sm text-muted">
            Esta categoría tiene <strong>{count} movimientos</strong>. Elegí a qué categoría moverlos antes de eliminarla.
          </p>
        ) : (
          <p className="mt-1.5 text-sm text-muted">Verificando...</p>
        )}
      </div>

      {needsReassign && (
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium">Reasignar movimientos a</label>
          <div className="relative flex items-center rounded-xl border border-ink-200 dark:border-ink-700">
            <select
              value={reassignTo}
              onChange={(e) => setReassignTo(e.target.value)}
              className="w-full appearance-none bg-transparent px-3 py-2.5 pr-9 text-sm outline-none [&>option]:bg-white [&>option]:text-ink-700 dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100"
            >
              <option value="">— Seleccioná —</option>
              {compatibleTargets.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.isSystem ? '(sistema)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-ink-400" />
          </div>
          {reassignTo && (
            <div className="mt-3 rounded-xl bg-ink-50 p-3 text-sm dark:bg-ink-800">
              {(() => {
                const target = compatibleTargets.find((c) => c.id === reassignTo);
                if (!target) return null;
                return (
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: `${target.color}1A`, color: target.color }}
                    >
                      <CategoryIcon name={target.icon} className="h-4 w-4" />
                    </span>
                    <span>
                      Los <strong>{count} movimientos</strong> pasarán a <strong>{target.name}</strong>.
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-center gap-2">
        <Button variant="ghost" onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        {needsReassign && (
          <Button variant="danger" onClick={handleConfirm} loading={submitting}>
            Reasignar y eliminar
          </Button>
        )}
      </div>
    </Modal>
  );
}

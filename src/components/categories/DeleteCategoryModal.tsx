'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, type SelectOption } from '@/components/ui/Select';
import { CategoryIcon } from '@/lib/icons';
import { ApiError, api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useT } from '@/lib/i18n';
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
  const t = useT();
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
        toast.success(t('categories.deleted'));
        onDeleted();
        onClose();
      } catch (err) {
        if (err instanceof ApiError && err.status === 400) {
          const m = err.message.match(/(\d+)/);
          setCount(m ? parseInt(m[1], 10) : 0);
          setNeedsReassign(true);
        } else {
          setError(err instanceof ApiError ? err.message : t('common.error'));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category]);

  const compatibleTargets =
    (category &&
      allCategories.filter((c) => {
        if (c.id === category.id) return false;
        if (category.type === 'both') return true;
        return c.type === 'both' || c.type === category.type;
      })) ??
    [];

  const reassignOptions: SelectOption<string>[] = [
    { value: '', label: t('categories.deleteSelectTarget') },
    ...compatibleTargets.map((c) => ({
      value: c.id,
      label: `${c.name}${c.isSystem ? ` (${t('categories.system')})` : ''}`,
      leading: (
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
          style={{ background: `${c.color}1A`, color: c.color }}
        >
          <CategoryIcon name={c.icon} className="h-3.5 w-3.5" />
        </span>
      ),
    })),
  ];

  async function handleConfirm() {
    if (!category) return;
    if (needsReassign && !reassignTo) {
      setError(t('validation.requiredFields'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const url = needsReassign
        ? `/categories/${category.id}?reassignTo=${reassignTo}`
        : `/categories/${category.id}`;
      await api.delete(url);
      toast.success(t('categories.deleted'));
      onDeleted();
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('common.error');
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
        <h3 className="text-lg font-semibold">
          {t('categories.deleteConfirm', { name: category.name })}
        </h3>
        {needsReassign ? (
          <p className="mt-1.5 text-sm text-muted">
            {t('categories.deleteWith')} <strong>({count})</strong>
          </p>
        ) : (
          <p className="mt-1.5 text-sm text-muted">{t('common.loading')}</p>
        )}
      </div>

      {needsReassign && (
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium">
            {t('categories.deleteReassign')}
          </label>
          <Select
            options={reassignOptions}
            value={reassignTo}
            onChange={setReassignTo}
            ariaLabel={t('categories.deleteReassign')}
          />
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-center gap-2">
        <Button variant="ghost" onClick={onClose} disabled={submitting}>
          {t('common.cancel')}
        </Button>
        {needsReassign && (
          <Button variant="danger" onClick={handleConfirm} loading={submitting}>
            {t('common.delete')}
          </Button>
        )}
      </div>
    </Modal>
  );
}

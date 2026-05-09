'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CategoryIcon, CATEGORY_ICON_NAMES } from '@/lib/icons';
import { ENVELOPE_COLORS } from '@/types/envelope';
import { cn } from '@/lib/utils';
import { ApiError, api } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import type { Category } from '@/types/category';

type Mode = 'create' | 'edit';

interface Props {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  category?: Category | null;
  onSaved: () => void;
}

export function CategoryFormModal({ open, onClose, mode, category, onSaved }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(CATEGORY_ICON_NAMES[0]);
  const [color, setColor] = useState<string>(ENVELOPE_COLORS[0]);
  const [type, setType] = useState<'income' | 'expense' | 'both'>('expense');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setType(category.type);
    } else {
      setName('');
      setIcon(CATEGORY_ICON_NAMES[0]);
      setColor(ENVELOPE_COLORS[0]);
      setType('expense');
    }
    setError(null);
  }, [open, mode, category]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'create') {
        await api.post('/categories', { name: name.trim(), icon, color, type });
        toast.success('Categoría creada.');
      } else if (category) {
        await api.patch(`/categories/${category.id}`, {
          name: name.trim(),
          icon,
          color,
          type,
        });
        toast.success('Categoría actualizada.');
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'No pudimos guardar la categoría.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
      description="Las categorías te ayudan a clasificar tus movimientos."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Café, Suscripciones..."
          maxLength={50}
          required
        />

        {/* Tipo */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Aplica a
          </label>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
            {(['expense', 'income', 'both'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  'rounded-lg py-2 text-sm font-semibold transition-all',
                  type === t
                    ? 'bg-white shadow-soft dark:bg-ink-700'
                    : 'text-muted hover:text-ink-700 dark:hover:text-ink-200',
                )}
              >
                {t === 'expense' ? 'Gastos' : t === 'income' ? 'Ingresos' : 'Ambos'}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de ícono */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Ícono
          </label>
          <div className="grid grid-cols-8 gap-1.5 rounded-xl border border-ink-200 p-2 dark:border-ink-700 max-h-48 overflow-y-auto">
            {CATEGORY_ICON_NAMES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setIcon(n)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                  icon === n
                    ? 'bg-brand-500/20 ring-2 ring-brand-500'
                    : 'hover:bg-ink-100 dark:hover:bg-ink-700/40',
                )}
                aria-label={n}
              >
                <CategoryIcon name={n} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {ENVELOPE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ background: c }}
                className={cn(
                  'h-8 w-8 rounded-full transition-all',
                  color === c ? 'ring-2 ring-offset-2 ring-ink-900 dark:ring-white scale-110' : 'opacity-80 hover:opacity-100',
                )}
              />
            ))}
          </div>
        </div>

        {/* Vista previa */}
        <div className="rounded-xl border border-ink-200 p-4 dark:border-ink-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Vista previa
          </p>
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: `${color}1A`, color }}
            >
              <CategoryIcon name={icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{name || 'Nombre de la categoría'}</p>
              <p className="text-xs text-muted">
                {type === 'expense' ? 'Gastos' : type === 'income' ? 'Ingresos' : 'Ingresos y gastos'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={submitting}>
            {mode === 'create' ? 'Crear' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

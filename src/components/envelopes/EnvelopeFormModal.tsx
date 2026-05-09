'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { CategoryIcon } from '@/lib/icons';
import {
  ENVELOPE_COLORS,
  ENVELOPE_ICONS,
  type Envelope,
  type CreateEnvelopePayload,
  type UpdateEnvelopePayload,
} from '@/types/envelope';

type Mode = 'create' | 'edit';

interface Props {
  open: boolean;
  onClose: () => void;
  mode: Mode;
  envelope?: Envelope | null;
  mainEnvelopeBalance?: number;
  currency: string;
  onSubmit: (payload: CreateEnvelopePayload | UpdateEnvelopePayload) => Promise<void>;
}

export function EnvelopeFormModal({
  open,
  onClose,
  mode,
  envelope,
  mainEnvelopeBalance,
  currency,
  onSubmit,
}: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<string>(ENVELOPE_ICONS[0]);
  const [color, setColor] = useState<string>(ENVELOPE_COLORS[0]);
  const [target, setTarget] = useState<string>('');
  const [initial, setInitial] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al abrir
  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && envelope) {
      setName(envelope.name);
      setDescription(envelope.description ?? '');
      setIcon(envelope.icon);
      setColor(envelope.color);
      setTarget(envelope.targetAmount ? String(envelope.targetAmount) : '');
      setInitial('');
    } else {
      setName('');
      setDescription('');
      setIcon(ENVELOPE_ICONS[0]);
      setColor(ENVELOPE_COLORS[0]);
      setTarget('');
      setInitial('');
    }
    setError(null);
  }, [open, mode, envelope]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }

    const targetNum = target ? parseFloat(target) : undefined;
    const initialNum = initial ? parseFloat(initial) : undefined;

    if (targetNum !== undefined && (Number.isNaN(targetNum) || targetNum < 0)) {
      setError('La meta debe ser un número válido.');
      return;
    }
    if (initialNum !== undefined && (Number.isNaN(initialNum) || initialNum < 0)) {
      setError('El saldo inicial debe ser un número válido.');
      return;
    }
    if (
      mode === 'create' &&
      initialNum !== undefined &&
      mainEnvelopeBalance !== undefined &&
      initialNum > mainEnvelopeBalance
    ) {
      setError('No tenés suficiente saldo en la cuenta principal.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'create') {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          icon,
          color,
          targetAmount: targetNum,
          initialAmount: initialNum,
        } satisfies CreateEnvelopePayload);
        toast.success('Sobre creado correctamente.');
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          icon,
          color,
          targetAmount: target === '' ? null : targetNum,
        } satisfies UpdateEnvelopePayload);
        toast.success('Sobre actualizado.');
      }
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'No pudimos guardar el sobre.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Nuevo sobre' : 'Editar sobre'}
      description={
        mode === 'create'
          ? 'Creá un compartimento para organizar tu dinero por propósito.'
          : 'Modificá el nombre, ícono, color o meta.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nombre"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Comida, Ahorro viaje..."
          maxLength={50}
          required
        />

        <Input
          label="Descripción (opcional)"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Para qué es este sobre?"
        />

        {/* Selector de ícono */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            Ícono
          </label>
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-ink-200 p-2 dark:border-ink-700">
            {ENVELOPE_ICONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors',
                  icon === emoji
                    ? 'bg-brand-500/20 ring-2 ring-brand-500'
                    : 'hover:bg-ink-100 dark:hover:bg-ink-700/40',
                )}
                aria-label={`Icono ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de color */}
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
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>

        <Input
          label="Meta de ahorro (opcional)"
          name="target"
          type="number"
          step="0.01"
          min="0"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="0.00"
          hint={`Cuánto querés juntar en este sobre. En ${currency}.`}
        />

        {mode === 'create' && (
          <Input
            label="Saldo inicial desde tu cuenta principal (opcional)"
            name="initial"
            type="number"
            step="0.01"
            min="0"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            placeholder="0.00"
            hint={
              mainEnvelopeBalance !== undefined
                ? `Disponible: ${mainEnvelopeBalance.toFixed(2)} ${currency}`
                : 'Se mueve desde tu cuenta principal.'
            }
          />
        )}

        {/* Preview */}
        <div className="rounded-xl border border-ink-200 p-4 dark:border-ink-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Vista previa</p>
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
              style={{ background: `${color}1A`, color }}
            >
              <CategoryIcon name={icon} className="h-5 w-5" />
            </span>
            <p className="font-semibold">{name || 'Nombre del sobre'}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            {mode === 'create' ? 'Crear sobre' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

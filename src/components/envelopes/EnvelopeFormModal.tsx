'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { CategoryIcon } from '@/lib/icons';
import { useT } from '@/lib/i18n';
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
  const t = useT();
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
      setError(t('envelopes.errorNameRequired'));
      return;
    }

    const targetNum = target ? parseFloat(target) : undefined;
    const initialNum = initial ? parseFloat(initial) : undefined;

    if (targetNum !== undefined && (Number.isNaN(targetNum) || targetNum < 0)) {
      setError(t('envelopes.errorTargetInvalid'));
      return;
    }
    if (initialNum !== undefined && (Number.isNaN(initialNum) || initialNum < 0)) {
      setError(t('envelopes.errorInitialInvalid'));
      return;
    }
    if (
      mode === 'create' &&
      initialNum !== undefined &&
      mainEnvelopeBalance !== undefined &&
      initialNum > mainEnvelopeBalance
    ) {
      setError(t('envelopes.errorInsufficientMain'));
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
        toast.success(t('envelopes.createdToast'));
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim() || undefined,
          icon,
          color,
          targetAmount: target === '' ? null : targetNum,
        } satisfies UpdateEnvelopePayload);
        toast.success(t('envelopes.updatedToast'));
      }
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('envelopes.errorSave');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? t('envelopes.createEnvelope') : t('envelopes.editEnvelope')}
      description={mode === 'create' ? t('envelopes.createDesc') : t('envelopes.editDesc')}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('envelopes.nameLabel')}
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('envelopes.namePlaceholder')}
          maxLength={50}
          required
        />

        <Input
          label={t('envelopes.descriptionLabel')}
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('envelopes.descriptionPlaceholder')}
        />

        {/* Selector de ícono */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            {t('envelopes.iconLabel')}
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
                aria-label={t('envelopes.iconAria', { emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de color */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
            {t('envelopes.color')}
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
                aria-label={t('envelopes.colorAria', { color: c })}
              />
            ))}
          </div>
        </div>

        <Input
          label={t('envelopes.targetLabel')}
          name="target"
          type="number"
          step="0.01"
          min="0"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="0.00"
          hint={t('envelopes.targetHint', { currency })}
        />

        {mode === 'create' && (
          <Input
            label={t('envelopes.initialLabel')}
            name="initial"
            type="number"
            step="0.01"
            min="0"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            placeholder="0.00"
            hint={
              mainEnvelopeBalance !== undefined
                ? t('envelopes.initialAvailable', {
                    amount: mainEnvelopeBalance.toFixed(2),
                    currency,
                  })
                : t('envelopes.initialFromMain')
            }
          />
        )}

        {/* Preview */}
        <div className="rounded-xl border border-ink-200 p-4 dark:border-ink-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {t('envelopes.preview')}
          </p>
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
              style={{ background: `${color}1A`, color }}
            >
              <CategoryIcon name={icon} className="h-5 w-5" />
            </span>
            <p className="font-semibold">{name || t('envelopes.namePlaceholderPreview')}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={submitting}>
            {mode === 'create' ? t('envelopes.createEnvelope') : t('common.saveChanges')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

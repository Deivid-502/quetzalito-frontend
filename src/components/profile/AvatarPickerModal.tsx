'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

/**
 * Generamos avatares ilustrados desde DiceBear (sin SDK, sólo URL).
 * Cada seed produce un avatar único y consistente.
 */
const PRESET_SEEDS = [
  'Quetzal', 'Maya', 'Sol', 'Tigre', 'Río', 'Volcán',
  'Cenote', 'Nube', 'Café', 'Cacao',
];

const STYLES = ['fun-emoji', 'thumbs', 'lorelei', 'avataaars'] as const;
type Style = (typeof STYLES)[number];

function urlFor(style: Style, seed: string): string {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ECFDF7,D1FAE9,FEF3C7,DBEAFE`;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** El avatar persistido en BD (lo que se ve si no hay cambios pendientes). */
  currentAvatar?: string | null;
  initials: string;
  /**
   * Notifica al padre que el usuario eligió un avatar (URL o `null` para iniciales).
   * El padre debe almacenar esto en estado local — la persistencia ocurre cuando
   * el usuario presione "Guardar cambios" en el formulario de perfil.
   */
  onPick: (url: string | null) => void;
}

/**
 * Picker de avatar. NO persiste cambios — sólo emite la selección al padre y cierra.
 *
 * Decisión: el cambio se aplica únicamente cuando el usuario confirma el formulario
 * principal del perfil. Esto evita que un click accidental en un avatar cambie tu
 * foto sin posibilidad de revertir antes de guardar.
 */
export function AvatarPickerModal({ open, onClose, currentAvatar, initials, onPick }: Props) {
  const t = useT();
  const [style, setStyle] = useState<Style>('fun-emoji');
  const [customUrl, setCustomUrl] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Reset cada vez que abre el modal
  useEffect(() => {
    if (open) {
      setStyle('fun-emoji');
      setCustomUrl('');
      setShowCustom(false);
    }
  }, [open]);

  function handlePick(url: string | null) {
    onPick(url);
    onClose();
  }

  function handleCustom() {
    if (!customUrl.trim()) return;
    handlePick(customUrl.trim());
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('profile.avatarPicker')}
      size="lg"
    >
      <div className="space-y-5">
        {/* Tabs de estilo */}
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                style === s
                  ? 'bg-white shadow-soft dark:bg-ink-700'
                  : 'text-muted hover:text-ink-700 dark:hover:text-ink-200',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grilla de avatares */}
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {/* Opción "iniciales" — siempre disponible para revertir a la inicial */}
          <button
            type="button"
            onClick={() => handlePick(null)}
            className={cn(
              'aspect-square rounded-xl border flex items-center justify-center font-bold text-2xl text-white bg-brand-500 transition-all',
              !currentAvatar
                ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-ink-900'
                : 'border-ink-200 dark:border-ink-700',
            )}
            title={t('profile.avatarInitials')}
          >
            {initials}
          </button>
          {PRESET_SEEDS.map((seed) => {
            const url = urlFor(style, seed);
            const selected = currentAvatar === url;
            return (
              <button
                key={seed}
                type="button"
                onClick={() => handlePick(url)}
                className={cn(
                  'aspect-square rounded-xl border bg-ink-50 dark:bg-ink-800 transition-all overflow-hidden',
                  selected
                    ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-ink-900'
                    : 'border-ink-200 dark:border-ink-700 hover:border-brand-400',
                )}
                title={seed}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={seed} className="h-full w-full" loading="lazy" />
              </button>
            );
          })}
        </div>

        {/* Acción explícita para borrar avatar (alternativa al botón "iniciales") */}
        {currentAvatar && (
          <button
            type="button"
            onClick={() => handlePick(null)}
            className="flex items-center gap-1.5 text-sm text-danger hover:underline"
          >
            <Trash2 className="h-4 w-4" />
            {t('profile.avatarRemove')}
          </button>
        )}

        {/* URL personalizada */}
        <div>
          <button
            type="button"
            onClick={() => setShowCustom((v) => !v)}
            className="text-sm text-brand-600 hover:underline"
          >
            {showCustom ? `— ${t('profile.hideUrl')}` : '+ ' + t('profile.useUrl')}
          </button>
          {showCustom && (
            <div className="mt-3 flex gap-2">
              <Input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://…"
                type="url"
              />
              <Button onClick={handleCustom} disabled={!customUrl.trim()}>
                {t('common.save')}
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

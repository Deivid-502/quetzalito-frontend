'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, Languages } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { usePreferences } from '@/hooks/usePreferences';
import {
  SUPPORTED_LANGUAGES,
  useT,
  useLanguage,
  writePublicLang,
  translate,
  type Language,
} from '@/lib/i18n';
import { toast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

/**
 * Toggle de idioma universal.
 *
 * Funciona en:
 *   · Páginas públicas (anónimo) → escribe en localStorage `qz_lang`.
 *   · Páginas privadas (logueado) → escribe a la BD vía PATCH /users/me/preferences.
 *
 * El toast de confirmación sale en el idioma DESTINO (no en el viejo capturado en este render),
 * usando `translate(targetLang, key)` directamente.
 */
export function LanguageToggle() {
  const t = useT();
  const { language, isAuthed } = useLanguage();
  const userId = useAuthStore((s) => s.user?.id);
  const { update } = usePreferences();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar con click afuera (consistente con AvatarMenu)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function selectLanguage(lang: Language) {
    setOpen(false);
    if (lang === language) return;

    if (userId && isAuthed) {
      // Logueado: persistimos en BD (también dispara re-render por cambio en authStore)
      try {
        await update({ language: lang });
        toast.success(translate(lang, 'settings.preferencesSaved'));
      } catch {
        // Hook ya muestra error si lo hay
      }
    } else {
      // Anónimo: persistimos en localStorage; el evento custom dispara re-render del useT
      writePublicLang(lang);
      toast.success(translate(lang, 'settings.preferencesSaved'));
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-xl px-2 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
        aria-label={t('settings.language')}
      >
        <Languages className="h-4 w-4 text-muted" />
        <span className="text-xs font-semibold uppercase">{language}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border surface shadow-lg border-ink-200 dark:border-ink-700 z-50"
        >
          {SUPPORTED_LANGUAGES.map((l) => {
            const active = language === l.code;
            return (
              <button
                key={l.code}
                type="button"
                role="menuitem"
                onClick={() => selectLanguage(l.code)}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-ink-50 dark:hover:bg-ink-800',
                  active && 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300',
                )}
              >
                <span>{t(l.labelKey)}</span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

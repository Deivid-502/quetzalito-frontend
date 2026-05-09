'use client';

export type { TranslationKey } from './es';
export type { TranslationKey } from './en';
import { es, type TranslationKey } from './es';
import { en } from './en';
import { useAuthStore } from '@/stores/auth.store';

export type Language = 'es' | 'en';

const dictionaries: Record<Language, Record<TranslationKey, string>> = { es, en };

/**
 * Lista de idiomas soportados.
 *
 * IMPORTANTE: el `label` que se muestra al usuario NO se almacena acá —
 * se obtiene vía `t('languages.es')` / `t('languages.en')` para que respete
 * el idioma activo (en español: "Español"/"Inglés"; en inglés: "Spanish"/"English").
 */
export const SUPPORTED_LANGUAGES: { code: Language; labelKey: TranslationKey }[] = [
  { code: 'es', labelKey: 'languages.es' },
  { code: 'en', labelKey: 'languages.en' },
];

/**
 * Reemplaza placeholders {nombre} en una cadena.
 *   interpolate("Hola, {name}", { name: "David" }) → "Hola, David"
 */
function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/**
 * Hook principal de i18n.
 * Usa el idioma del usuario autenticado (o 'es' por defecto).
 *
 *   const t = useT();
 *   t('dashboard.totalBalance');
 *   t('auth.greeting', { name: user.nickname });
 */
export function useT() {
  const language = (useAuthStore((s) => s.user?.language) as Language | undefined) ?? 'es';
  const dict = dictionaries[language] ?? es;
  return (key: TranslationKey, vars?: Record<string, string | number>) =>
    interpolate(dict[key] ?? key, vars);
}

/**
 * Versión sin hook para usos fuera de componentes React, o cuando necesitás
 * traducir en un idioma EXPLÍCITO (típico: después de cambiar el idioma del
 * usuario, querés que el toast confirmatorio salga en el idioma DESTINO,
 * no en el viejo que aún tiene capturado el render actual).
 *
 *   await update({ language: 'en' });
 *   toast.success(translate('en', 'settings.preferencesSaved'));
 */
export function translate(language: Language, key: TranslationKey, vars?: Record<string, string | number>) {
  const dict = dictionaries[language] ?? es;
  return interpolate(dict[key] ?? key, vars);
}

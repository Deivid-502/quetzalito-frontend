'use client';

import { useEffect, useState, useCallback } from 'react';
import { es, type TranslationKey } from './es';
import { en } from './en';
import { useAuthStore } from '@/stores/auth.store';

export type Language = 'es' | 'en';
export type { TranslationKey };

const dictionaries: Record<Language, Record<TranslationKey, string>> = { es, en };

/**
 * Lista de idiomas soportados.
 *
 * IMPORTANTE: el `label` que se muestra al usuario NO está hardcodeado —
 * se obtiene vía `t('languages.es')` / `t('languages.en')` para que respete
 * el idioma activo (en español: "Español"/"Inglés"; en inglés: "Spanish"/"English").
 *
 * Para agregar un idioma nuevo:
 *   1. Crear `src/lib/i18n/<code>.ts` con el mismo Record<TranslationKey, string>
 *   2. Importarlo aquí en `dictionaries`
 *   3. Agregar entrada en `SUPPORTED_LANGUAGES`
 *   4. Agregar key en es/en para `'languages.<code>'`
 *   5. Validar que el backend acepte el código en el enum de la BD si persiste preferencia
 */
export const SUPPORTED_LANGUAGES: { code: Language; labelKey: TranslationKey }[] = [
  { code: 'es', labelKey: 'languages.es' },
  { code: 'en', labelKey: 'languages.en' },
];

const PUBLIC_LANG_KEY = 'qz_lang';
const DEFAULT_LANG: Language = 'es';

/**
 * Reemplaza placeholders {nombre} en una cadena.
 *   interpolate("Hola, {name}", { name: "David" }) → "Hola, David"
 */
function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

function isLang(v: unknown): v is Language {
  return v === 'es' || v === 'en';
}

/**
 * Lee el idioma público (anónimo) de localStorage. Para usuarios sin sesión.
 */
export function readPublicLang(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const v = window.localStorage.getItem(PUBLIC_LANG_KEY);
  return isLang(v) ? v : DEFAULT_LANG;
}

export function writePublicLang(lang: Language) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PUBLIC_LANG_KEY, lang);
  // Notificamos a los hooks suscritos para que re-rendericen
  window.dispatchEvent(new CustomEvent('qz:public-lang-changed', { detail: lang }));
}

/**
 * Devuelve el idioma activo en este momento, leyendo del store si hay user
 * autenticado, o de localStorage si no. Útil fuera de componentes React
 * (ej: en handlers globales como I18nBootstrap, en utilidades, etc).
 */
export function getActiveLanguage(): Language {
  const userLang = useAuthStore.getState().user?.language;
  if (isLang(userLang)) return userLang;
  return readPublicLang();
}

/**
 * Hook principal de i18n.
 *
 * Resolución del idioma activo:
 *   1. Si hay usuario autenticado → user.language
 *   2. Si no → localStorage `qz_lang`
 *   3. Default → 'es'
 *
 * Se re-renderiza cuando:
 *   · Cambia user.language en el store (React Subscription)
 *   · Cambia localStorage qz_lang en otra pestaña (storage event)
 *   · Cambia localStorage qz_lang en esta pestaña (custom event qz:public-lang-changed)
 *
 *   const t = useT();
 *   t('dashboard.totalBalance');
 *   t('auth.greeting', { name: user.nickname });
 */
export function useT() {
  const userLang = useAuthStore((s) => s.user?.language as Language | undefined);
  const [publicLang, setPublicLang] = useState<Language>(DEFAULT_LANG);

  // Sincroniza el publicLang del estado local con localStorage
  useEffect(() => {
    setPublicLang(readPublicLang());

    const onCustom = (e: Event) => {
      const lang = (e as CustomEvent<Language>).detail;
      if (isLang(lang)) setPublicLang(lang);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === PUBLIC_LANG_KEY && isLang(e.newValue)) {
        setPublicLang(e.newValue);
      }
    };

    window.addEventListener('qz:public-lang-changed', onCustom);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('qz:public-lang-changed', onCustom);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const language: Language = userLang ?? publicLang;
  const dict = dictionaries[language] ?? es;

  return useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      interpolate(dict[key] ?? key, vars),
    [dict],
  );
}

/**
 * Hook que expone el idioma actual y un setter universal.
 * El setter persiste en BD si hay user, o en localStorage si no.
 *
 *   const { language, setLanguage } = useLanguage();
 *   setLanguage('en');
 */
export function useLanguage() {
  const userLang = useAuthStore((s) => s.user?.language as Language | undefined);
  const [publicLang, setPublicLang] = useState<Language>(DEFAULT_LANG);

  useEffect(() => {
    setPublicLang(readPublicLang());
    const onCustom = (e: Event) => {
      const lang = (e as CustomEvent<Language>).detail;
      if (isLang(lang)) setPublicLang(lang);
    };
    window.addEventListener('qz:public-lang-changed', onCustom);
    return () => window.removeEventListener('qz:public-lang-changed', onCustom);
  }, []);

  const language: Language = userLang ?? publicLang;

  return { language, isAuthed: !!userLang };
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

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { translate, type Language } from '@/lib/i18n';

/**
 * Sincroniza:
 *   1. `<html lang>` con el idioma del usuario (afecta a screen readers, hyphenation, etc).
 *   2. Los mensajes de validación nativa del browser ("Please fill out this field" → "Completá este campo").
 *
 * El browser muestra los mensajes nativos en su propio idioma del SO, ignorando `<html lang>`.
 * Para forzarlos a respetar nuestro idioma usamos un listener global de `invalid` que
 * intercepta el evento y reescribe `validationMessage` con `setCustomValidity`.
 *
 * El listener se registra en captura para correr antes que cualquier handler de form,
 * y se limpia al cambiar el idioma.
 */
export function I18nBootstrap() {
  const language = (useAuthStore((s) => s.user?.language) as Language | undefined) ?? 'es';

  // 1. Sincroniza <html lang>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
  }, [language]);

  // 2. Traduce mensajes nativos de validación
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handler = (event: Event) => {
      const el = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (!el || !('validity' in el)) return;
      const v = el.validity;

      // Reseteamos cualquier customValidity previo antes de evaluar
      el.setCustomValidity('');

      let msg = '';
      if (v.valueMissing) {
        msg = translate(language, 'validation.valueMissing');
      } else if (v.typeMismatch) {
        if (el.getAttribute('type') === 'email') {
          msg = translate(language, 'validation.typeMismatch.email');
        } else if (el.getAttribute('type') === 'url') {
          msg = translate(language, 'validation.typeMismatch.url');
        } else {
          msg = translate(language, 'validation.badInput');
        }
      } else if (v.tooShort) {
        msg = translate(language, 'validation.tooShort', {
          n: (el as HTMLInputElement).minLength,
        });
      } else if (v.tooLong) {
        msg = translate(language, 'validation.tooLong', {
          n: (el as HTMLInputElement).maxLength,
        });
      } else if (v.rangeUnderflow) {
        msg = translate(language, 'validation.rangeUnderflow', {
          n: (el as HTMLInputElement).min,
        });
      } else if (v.rangeOverflow) {
        msg = translate(language, 'validation.rangeOverflow', {
          n: (el as HTMLInputElement).max,
        });
      } else if (v.stepMismatch) {
        msg = translate(language, 'validation.stepMismatch');
      } else if (v.patternMismatch) {
        msg = translate(language, 'validation.patternMismatch');
      } else if (v.badInput) {
        msg = translate(language, 'validation.badInput');
      }

      if (msg) el.setCustomValidity(msg);
    };

    // Limpia el customValidity cuando el campo vuelve a ser editado, así se
    // re-evaluan las constraints en el siguiente intento.
    const inputHandler = (event: Event) => {
      const el = event.target as HTMLInputElement;
      if (el && 'setCustomValidity' in el) el.setCustomValidity('');
    };

    document.addEventListener('invalid', handler, true);
    document.addEventListener('input', inputHandler, true);
    return () => {
      document.removeEventListener('invalid', handler, true);
      document.removeEventListener('input', inputHandler, true);
    };
  }, [language]);

  return null;
}

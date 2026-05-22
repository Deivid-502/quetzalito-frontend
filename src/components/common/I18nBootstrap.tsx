'use client';

import { useEffect } from 'react';
import { translate, useLanguage } from '@/lib/i18n';

/**
 * Sincroniza el idioma de:
 *  1. `<html lang>` (afecta screen readers, hyphenation, etc).
 *  2. Mensajes de validación nativa del browser (HTML `required`, `pattern`,
 *     `min`, `max`, etc).
 *
 * ## Por qué interceptamos `submit` y no solo `invalid`
 * El listener de `invalid` tiene un bug conocido: el browser cachea el
 * `validationMessage` ANTES de disparar el evento, así que `setCustomValidity`
 * desde un handler de `invalid` recién aplica al SEGUNDO intento del usuario.
 *
 * La fix correcta es interceptar el `submit` con `capture: true`, iterar todos
 * los campos del form, y pre-setear `setCustomValidity` con el mensaje
 * traducido ANTES de que el browser corra su propia validación. Cuando el
 * browser dispare luego el `invalid`, ya encuentra el `validationMessage`
 * traducido y lo muestra en el tooltip nativo.
 *
 * También dejamos un listener de `invalid` como red de seguridad para casos
 * donde se llama `form.checkValidity()` o `el.reportValidity()` por código.
 */
export function I18nBootstrap() {
  const { language } = useLanguage();

  // 1) <html lang> sincronizado
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
  }, [language]);

  // 2) Validation messages traducidos
  useEffect(() => {
    if (typeof document === 'undefined') return;

    /**
     * Lee el ValidityState del elemento y devuelve el mensaje traducido
     * que corresponde, o '' si el campo es válido.
     */
    function buildMessage(
      el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    ): string {
      // Reseteamos primero para que el browser re-evalúe contra las constraints
      // reales y no contra un customValidity cacheado de un submit anterior.
      el.setCustomValidity('');
      const v = el.validity;
      if (v.valid) return '';

      if (v.valueMissing) {
        return translate(language, 'validation.valueMissing');
      }
      if (v.typeMismatch) {
        const type = (el as HTMLInputElement).type;
        if (type === 'email') return translate(language, 'validation.typeMismatch.email');
        if (type === 'url') return translate(language, 'validation.typeMismatch.url');
        return translate(language, 'validation.badInput');
      }
      if (v.tooShort) {
        return translate(language, 'validation.tooShort', {
          n: (el as HTMLInputElement).minLength,
        });
      }
      if (v.tooLong) {
        return translate(language, 'validation.tooLong', {
          n: (el as HTMLInputElement).maxLength,
        });
      }
      if (v.rangeUnderflow) {
        return translate(language, 'validation.rangeUnderflow', {
          n: (el as HTMLInputElement).min,
        });
      }
      if (v.rangeOverflow) {
        return translate(language, 'validation.rangeOverflow', {
          n: (el as HTMLInputElement).max,
        });
      }
      if (v.stepMismatch) return translate(language, 'validation.stepMismatch');
      if (v.patternMismatch) return translate(language, 'validation.patternMismatch');
      if (v.badInput) return translate(language, 'validation.badInput');
      return '';
    }

    /**
     * Pre-setea customValidity en TODOS los campos del form, antes de que el
     * browser corra su check. Capture: true se asegura de correr antes que
     * cualquier handler propio del form.
     */
    const submitHandler = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const elements = Array.from(form.elements) as Array<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >;
      for (const el of elements) {
        if (
          !(el instanceof HTMLInputElement) &&
          !(el instanceof HTMLSelectElement) &&
          !(el instanceof HTMLTextAreaElement)
        ) {
          continue;
        }
        const msg = buildMessage(el);
        if (msg) el.setCustomValidity(msg);
      }
    };

    /** Red de seguridad para `el.reportValidity()` programático. */
    const invalidHandler = (event: Event) => {
      const el = event.target;
      if (
        !(el instanceof HTMLInputElement) &&
        !(el instanceof HTMLSelectElement) &&
        !(el instanceof HTMLTextAreaElement)
      ) {
        return;
      }
      const msg = buildMessage(el);
      if (msg) el.setCustomValidity(msg);
    };

    /** Resetea customValidity al editar para que la próxima check vuelva a evaluar. */
    const inputHandler = (event: Event) => {
      const el = event.target;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement
      ) {
        el.setCustomValidity('');
      }
    };

    document.addEventListener('submit', submitHandler, true);
    document.addEventListener('invalid', invalidHandler, true);
    document.addEventListener('input', inputHandler, true);
    return () => {
      document.removeEventListener('submit', submitHandler, true);
      document.removeEventListener('invalid', invalidHandler, true);
      document.removeEventListener('input', inputHandler, true);
    };
  }, [language]);

  return null;
}

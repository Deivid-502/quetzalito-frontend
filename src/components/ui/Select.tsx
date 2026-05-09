'use client';

import { forwardRef, ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  /** Visual de tamaño. 'sm' es para filtros, 'md' es default. */
  uiSize?: 'sm' | 'md';
  /** Si true, no envuelve en un wrapper con label/borde — usalo cuando ya tenés un contenedor decorado afuera. */
  bare?: boolean;
}

/**
 * Select unificado con:
 *  · `appearance-none` para esconder el dropdown nativo del SO (que en dark se ve blanco con flecha rara)
 *  · Flecha custom (Lucide ChevronDown) que respeta el color del texto
 *  · Options con bg/color coherentes en dark mode (limitado por el browser, pero al menos no salen blancos)
 *  · Bordes y focus ring iguales al `<Input>`
 *
 * Soporta uso "bare" para casos donde el contenedor exterior ya pinta borde y label
 * (ej: TransferModal, donde la tarjeta del sobre tiene su propio chrome).
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      uiSize = 'md',
      bare = false,
      className,
      children,
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? props.name;

    const selectEl = (
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'w-full appearance-none bg-transparent pr-7 text-sm font-medium outline-none',
          // El bg explícito sobre el `<select>` mismo NO afecta options en la mayoría
          // de browsers, pero las options heredan parcialmente. Forzamos un color base
          // para que en Chromium/WebKit el dropdown abra con fondo coherente con el tema.
          '[&>option]:bg-white [&>option]:text-ink-700',
          'dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100',
          // Disabled / placeholder option
          '[&>option:disabled]:text-ink-400',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );

    if (bare) {
      // Sin chrome propio — solo el select y la flecha
      return (
        <div className="relative inline-flex w-full items-center">
          {selectEl}
          <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-ink-400" />
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center gap-2 rounded-xl border surface px-3',
            'focus-within:ring-2 focus-within:ring-brand-300',
            uiSize === 'sm' ? 'h-9' : 'h-11',
            error
              ? 'border-danger focus-within:ring-red-200'
              : 'border-ink-200 dark:border-ink-700',
          )}
        >
          {leftIcon && <span className="text-ink-400">{leftIcon}</span>}
          {selectEl}
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-ink-400" />
        </div>
        {(error || hint) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-danger' : 'text-muted')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';

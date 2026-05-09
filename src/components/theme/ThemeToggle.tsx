'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

/**
 * Botón sol/luna para alternar tema en páginas públicas.
 * Para usuarios autenticados se debe usar /ajustes (donde la preferencia
 * se guarda en la BD).
 */
export function ThemeToggle({ className }: Props) {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
        'border-ink-200 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800',
        className,
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

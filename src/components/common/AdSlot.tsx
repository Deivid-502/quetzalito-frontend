'use client';

import Link from 'next/link';
import { Crown, Megaphone } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

type Variant = 'banner' | 'card' | 'inline';

interface Props {
  variant?: Variant;
  /** Identificador semántico del slot (útil para futura integración con AdServer) */
  slotId?: string;
  className?: string;
}

/**
 * Slot publicitario no intrusivo.
 * - Solo se muestra para usuarios FREE (oculto si user.isPremium).
 * - Ofrece CTA discreto para upgrade a Premium.
 * - Cumple §23 de la spec: nunca interrumpe formularios ni acciones críticas.
 *
 * Por ahora muestra placeholder. La integración real con un ad-server
 * (AdSense, Carbon, etc.) se hace acá sin tocar el resto de la app.
 */
export function AdSlot({ variant = 'banner', slotId, className }: Props) {
  const user = useAuthStore((s) => s.user);

  // Premium o sin sesión → no mostramos slot
  if (!user || user.isPremium) return null;

  const base =
    'flex items-center gap-3 rounded-2xl border-2 border-dashed text-xs text-muted ' +
    'border-ink-200 bg-ink-50/50 dark:border-ink-700 dark:bg-ink-800/30';

  const variants: Record<Variant, string> = {
    banner: 'p-4',
    card: 'p-5 flex-col text-center',
    inline: 'p-3 text-[11px]',
  };

  return (
    <aside
      data-ad-slot={slotId}
      aria-label="Espacio publicitario · no intrusivo"
      className={cn(base, variants[variant], className)}
    >
      <Megaphone className={cn('shrink-0', variant === 'card' ? 'h-5 w-5' : 'h-4 w-4')} />
      <div className={cn('flex-1', variant === 'card' && 'space-y-1')}>
        <p>Espacio publicitario</p>
        <p className="text-[10px] opacity-70">
          Quitalo activando Premium por solo Q19/mes
        </p>
      </div>
      <Link
        href="/premium"
        className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-2.5 py-1 text-[11px] font-semibold text-gold-700 hover:bg-gold-500/25 dark:text-gold-400"
      >
        <Crown className="h-3 w-3" /> Premium
      </Link>
    </aside>
  );
}

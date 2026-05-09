'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, Wallet, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransactionModal } from '@/components/transactions/TransactionModalProvider';
import { useT, type TranslationKey } from '@/lib/i18n';

const items: { href: string; labelKey: TranslationKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: '/dashboard', labelKey: 'nav.home',      icon: Home },
  { href: '/historial', labelKey: 'nav.history',   icon: History },
  { href: '/sobres',    labelKey: 'nav.envelopes', icon: Wallet },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const t = useT();
  const { open } = useTransactionModal();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t surface lg:hidden',
        'border-ink-200 dark:border-ink-700',
      )}
    >
      {items.map((it) => {
        const active = pathname === it.href || pathname.startsWith(it.href + '/');
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px]',
              active ? 'text-brand-600 dark:text-brand-400' : 'text-ink-500',
            )}
          >
            <Icon className="h-5 w-5" />
            {t(it.labelKey)}
          </Link>
        );
      })}
      <button
        onClick={() => open()}
        className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] text-brand-600"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white shadow-soft">
          <Plus className="h-5 w-5" />
        </span>
        {t('nav.add')}
      </button>
    </nav>
  );
}

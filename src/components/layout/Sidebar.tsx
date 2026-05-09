'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  History,
  Wallet,
  Target,
  LogOut,
  Crown,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useT, type TranslationKey } from '@/lib/i18n';

interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
}

const items: NavItem[] = [
  { href: '/dashboard',    labelKey: 'nav.home',       icon: Home },
  { href: '/historial',    labelKey: 'nav.history',    icon: History },
  { href: '/sobres',       labelKey: 'nav.envelopes',  icon: Wallet },
  { href: '/presupuestos', labelKey: 'nav.budgets',    icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <aside
      className={cn(
        'sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col justify-between',
        'border-r surface px-4 py-6 lg:flex',
        'border-ink-200 dark:border-ink-700',
      )}
    >
      {/* Navegación principal */}
      <nav className="space-y-1">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-700/40',
              )}
            >
              <Icon className={cn('h-5 w-5', active && 'text-brand-500')} />
              {t(it.labelKey)}
            </Link>
          );
        })}

        {/* Premium CTA si es free */}
        {user && !user.isPremium && (
          <Link
            href="/premium"
            className={cn(
              'mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
              'bg-gradient-to-r from-gold-500/15 to-brand-500/15 text-gold-700 dark:text-gold-400',
              'hover:from-gold-500/25 hover:to-brand-500/25 transition-colors',
            )}
          >
            <Crown className="h-5 w-5" />
            {t('nav.premium')}
          </Link>
        )}
      </nav>

      {/* Zona inferior: redes + logout */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <SocialLink href="https://facebook.com" icon={<Facebook className="h-4 w-4" />} label="Facebook" />
          <SocialLink href="https://instagram.com" icon={<Instagram className="h-4 w-4" />} label="Instagram" />
          <SocialLink href="https://twitter.com" icon={<Twitter className="h-4 w-4" />} label="Twitter" />
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium',
            'text-danger hover:bg-red-50 dark:hover:bg-red-900/20',
            'border-ink-200 dark:border-ink-700',
          )}
        >
          <LogOut className="h-4 w-4" />
          {t('settings.logout')}
        </button>
      </div>
    </aside>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border text-ink-500',
        'hover:bg-ink-50 hover:text-ink-700 dark:hover:bg-ink-700/40 dark:hover:text-ink-200',
        'border-ink-200 dark:border-ink-700',
      )}
    >
      {icon}
    </a>
  );
}

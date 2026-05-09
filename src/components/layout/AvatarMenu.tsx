'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, User as UserIcon, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useT } from '@/lib/i18n';

export function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Cerrar al hacer clic fuera (requerido por la spec §13)
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onClickOutside);
      document.addEventListener('keydown', onEscape);
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-full border surface p-1 pr-3 transition-colors',
          'hover:bg-ink-50 dark:hover:bg-ink-700/40',
          'border-ink-200 dark:border-ink-700',
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white text-sm font-semibold">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <span className="hidden text-sm font-medium sm:inline">{user?.nickname ?? '...'}</span>
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 mt-2 w-60 rounded-2xl border surface shadow-card overflow-hidden z-50',
            'border-ink-200 dark:border-ink-700',
          )}
        >
          <div className="px-4 py-3 border-b border-ink-200 dark:border-ink-700">
            <p className="text-sm font-semibold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
            {user?.isPremium && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-500/15 text-gold-600 px-2 py-0.5 text-[10px] font-semibold">
                <Crown className="h-3 w-3" /> PREMIUM
              </span>
            )}
          </div>
          <nav className="py-1">
            <MenuItem href="/perfil" icon={<UserIcon className="h-4 w-4" />} onClick={() => setOpen(false)}>
              {t('nav.account')}
            </MenuItem>
            <MenuItem href="/ajustes" icon={<Settings className="h-4 w-4" />} onClick={() => setOpen(false)}>
              {t('nav.settings')}
            </MenuItem>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" /> {t('nav.logout')}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-ink-50 dark:hover:bg-ink-700/40"
    >
      {icon}
      {children}
    </Link>
  );
}

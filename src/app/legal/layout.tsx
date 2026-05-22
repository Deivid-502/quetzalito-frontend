'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageToggle } from '@/components/i18n/LanguageToggle';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { useT } from '@/lib/i18n';

const FOOTER_LINKS = {
  es: [
    { label: 'Privacidad', href: '/legal/privacidad' },
    { label: 'Términos', href: '/legal/terminos' },
    { label: 'Cookies', href: '/legal/cookies' },
    { label: 'Reembolso', href: '/legal/reembolso' },
    { label: 'Contacto', href: '/legal/contacto' },
  ],
  en: [
    { label: 'Privacy', href: '/legal/privacidad' },
    { label: 'Terms', href: '/legal/terminos' },
    { label: 'Cookies', href: '/legal/cookies' },
    { label: 'Refund', href: '/legal/reembolso' },
    { label: 'Contact', href: '/legal/contacto' },
  ],
} as const;

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const isAuthed = initialized && !!user;

  // Detectar idioma actual (simplificado)
  const footerLinksList = FOOTER_LINKS.es;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b surface border-ink-200 dark:border-ink-700">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" />
          <nav className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            {isAuthed ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">{t('nav.myDashboard')}</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">{t('auth.signIn')}</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> {t('common.backHome')}
        </Link>
        <div className="rounded-2xl border surface p-6 sm:p-10 border-ink-200 dark:border-ink-700 shadow-soft">
          <article className="legal-doc">
            {children}
          </article>
        </div>
      </main>

      <footer className="mt-auto border-t border-ink-200 dark:border-ink-700">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Quetzalito · {t('common.academicProject')}
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {footerLinksList.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-brand-600">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

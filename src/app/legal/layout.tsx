'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const isAuthed = initialized && !!user;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b surface border-ink-200 dark:border-ink-700">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" />
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthed ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Mi dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">Iniciar sesión</Button>
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
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
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
            © {new Date().getFullYear()} Quetzalito · Proyecto académico
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <Link href="/legal/privacidad" className="hover:text-brand-600">Privacidad</Link>
            <Link href="/legal/terminos" className="hover:text-brand-600">Términos</Link>
            <Link href="/legal/cookies" className="hover:text-brand-600">Cookies</Link>
            <Link href="/legal/reembolso" className="hover:text-brand-600">Reembolso</Link>
            <Link href="/legal/contacto" className="hover:text-brand-600">Contacto</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

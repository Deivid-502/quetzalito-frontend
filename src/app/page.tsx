'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  Wallet,
  Smartphone,
  PieChart,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/stores/auth.store';

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const isAuthed = initialized && !!user;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ===== Nav pública ===== */}
      <header className="sticky top-0 z-30 border-b surface border-ink-200 dark:border-ink-700">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo href="/" />
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthed ? (
              // Usuario ya autenticado → CTA directo al dashboard
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Ir a mi dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Iniciar sesión</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Crear cuenta</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Hecho en Guatemala 🇬🇹
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Tu dinero,{' '}
              <span className="text-brand-500">bajo control</span>.
            </h1>
            <p className="max-w-xl text-lg text-muted">
              Quetzalito te ayuda a registrar tus gastos, organizar tu dinero en alcancías
              y alcanzar tus metas. Pensado para estudiantes y jóvenes que quieren
              entender a dónde se va su quetzal.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {isAuthed ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="primary">
                    Continuar a mi cuenta <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" variant="primary">
                      Empezar gratis <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="secondary">Ya tengo cuenta</Button>
                  </Link>
                </>
              )}
            </div>
            <p className="text-xs text-muted">
              Gratis para siempre · Sin tarjeta de crédito · Premium opcional
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-brand-500/20 via-gold-500/20 to-transparent blur-2xl" />
            <div className="relative">
              <Image
                src="/logo.webp"
                alt="Quetzalito"
                width={520}
                height={520}
                priority
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="border-t border-ink-200 dark:border-ink-700">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Todo lo que necesitás para tomar el control
            </h2>
            <p className="mt-4 text-muted">
              Pensado para que registrar un gasto te tome menos de 5 segundos y entender
              tus finanzas, menos de 5 minutos.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Wallet className="h-6 w-6 text-brand-500" />}
              title="Alcancías inteligentes"
              text="Organizá tu dinero en sobres con propósito: comida, ahorro, viaje. Cada quetzal con destino claro."
            />
            <Feature
              icon={<TrendingUp className="h-6 w-6 text-brand-500" />}
              title="Límite diario"
              text="Sabé cuánto podés gastar hoy según tu saldo y los días que faltan del mes."
            />
            <Feature
              icon={<PieChart className="h-6 w-6 text-brand-500" />}
              title="Estadísticas claras"
              text="Gráficas por categoría que te muestran a dónde se va realmente tu dinero."
            />
            <Feature
              icon={<PiggyBank className="h-6 w-6 text-brand-500" />}
              title="Metas de ahorro"
              text="Definí cuánto querés juntar y mirá tu progreso semana a semana."
            />
            <Feature
              icon={<Smartphone className="h-6 w-6 text-brand-500" />}
              title="Listo para móvil"
              text="Funciona en tu celular como una app instalable. Llévalo en el bolsillo."
            />
            <Feature
              icon={<ShieldCheck className="h-6 w-6 text-brand-500" />}
              title="Seguro por diseño"
              text="Tus datos viajan cifrados y solo vos los ves. Sesiones aisladas y protegidas."
            />
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section className="border-t border-ink-200 dark:border-ink-700 bg-ink-50/40 dark:bg-ink-900/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Precio justo, valor real</h2>
            <p className="mt-4 text-muted">
              Empezá gratis. Cuando sintás que necesitás más, da el paso.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            <PricingCard
              title="Free"
              price="Q0"
              tagline="Para empezar a tomar el control"
              isAuthed={isAuthed}
              isPremium={!!user?.isPremium}
              tier="free"
              features={[
                'Registro ilimitado de movimientos',
                'Hasta 5 alcancías',
                'Historial completo',
                'Estadísticas básicas',
                'Anuncios discretos',
              ]}
            />
            <PricingCard
              title="Premium"
              price="Q19"
              priceSuffix="/ mes"
              tagline="Para quienes quieren más"
              highlighted
              isAuthed={isAuthed}
              isPremium={!!user?.isPremium}
              tier="premium"
              features={[
                'Alcancías ilimitadas',
                'Estadísticas avanzadas',
                'Sin anuncios',
                'Categorías personalizadas',
                'Exportar a PDF / Excel',
                'Soporte prioritario',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="mt-auto border-t border-ink-200 dark:border-ink-700">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-3 text-xs text-muted max-w-xs">
                Plataforma de finanzas personales pensada para jóvenes guatemaltecos.
                Tu dinero bajo control.
              </p>
            </div>
            <FooterCol title="Producto">
              <FooterLink href="/login">Iniciar sesión</FooterLink>
              <FooterLink href="/register">Crear cuenta</FooterLink>
              {isAuthed && <FooterLink href="/dashboard">Mi dashboard</FooterLink>}
            </FooterCol>
            <FooterCol title="Legal">
              <FooterLink href="/legal/privacidad">Privacidad</FooterLink>
              <FooterLink href="/legal/terminos">Términos y condiciones</FooterLink>
              <FooterLink href="/legal/cookies">Política de cookies</FooterLink>
              <FooterLink href="/legal/reembolso">Política de reembolso</FooterLink>
            </FooterCol>
            <FooterCol title="Soporte">
              <FooterLink href="/legal/contacto">Contacto</FooterLink>
            </FooterCol>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ink-200 pt-6 dark:border-ink-700 sm:flex-row">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Quetzalito · Hecho con 💚 en Guatemala
            </p>
            <p className="text-xs text-muted">
              Proyecto académico · No comercial
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border surface p-6 shadow-soft border-ink-200 dark:border-ink-700">
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{text}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  priceSuffix,
  tagline,
  features,
  highlighted,
  isAuthed,
  isPremium,
  tier,
}: {
  title: string;
  price: string;
  priceSuffix?: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  isAuthed: boolean;
  isPremium: boolean;
  tier: 'free' | 'premium';
}) {
  // Decide a dónde llevar al usuario según su estado y el tier:
  //   · Sin sesión             → /register (cualquier tier)
  //   · Logueado en Free       → si tier=free: /dashboard ; si tier=premium: /premium
  //   · Logueado en Premium    → /dashboard (free) o /premium (gestión, ya tiene activo)
  let href = '/register';
  let label = 'Comenzar';

  if (isAuthed) {
    if (tier === 'premium') {
      href = '/premium';
      label = isPremium ? 'Mi plan' : 'Activar Premium';
    } else {
      href = '/dashboard';
      label = 'Ir a mi dashboard';
    }
  }

  return (
    <div
      className={`rounded-2xl border p-6 ${
        highlighted
          ? 'border-brand-500 bg-gradient-to-b from-brand-50 to-white dark:from-brand-500/10 dark:to-ink-800'
          : 'surface border-ink-200 dark:border-ink-700'
      } shadow-soft`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        {highlighted && (
          <span className="rounded-full bg-gold-500/20 px-2.5 py-1 text-xs font-semibold text-gold-600">
            Recomendado
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">{tagline}</p>
      <p className="mt-4">
        <span className="text-4xl font-bold">{price}</span>
        {priceSuffix && <span className="text-sm text-muted">{priceSuffix}</span>}
      </p>
      <ul className="mt-5 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-6 block">
        <Button fullWidth variant={highlighted ? 'gold' : 'secondary'}>
          {label}
        </Button>
      </Link>
    </div>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </p>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-ink-700 hover:text-brand-600 dark:text-ink-200 dark:hover:text-brand-400">
        {children}
      </Link>
    </li>
  );
}

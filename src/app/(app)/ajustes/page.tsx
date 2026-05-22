'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  DollarSign,
  Moon,
  Sun,
  Laptop,
  Lock,
  LogOut,
  Tag,
  Target,
  ChevronRight,
  Mail,
  Crown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChangePasswordModal } from '@/components/security/ChangePasswordModal';
import { useAuthStore } from '@/stores/auth.store';
import { usePreferences } from '@/hooks/usePreferences';
import { useT, SUPPORTED_LANGUAGES, translate, type Language } from '@/lib/i18n';
import { toast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

const SUPPORTED_CURRENCIES = [
  { code: 'GTQ', symbol: 'Q',  label: 'Quetzal guatemalteco' },
  { code: 'USD', symbol: '$',  label: 'Dólar estadounidense' },
  { code: 'EUR', symbol: '€',  label: 'Euro' },
  { code: 'MXN', symbol: '$',  label: 'Peso mexicano' },
];

export default function AjustesPage() {
  const router = useRouter();
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { update } = usePreferences();
  const [pwdOpen, setPwdOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  /**
   * Bug fix: el toast de confirmación tiene que salir en el idioma DESTINO,
   * no en el idioma actual. El `t` que está capturado en este render usa el
   * dict del idioma actual; por eso usamos `translate(targetLang, key)` que
   * resuelve directamente contra el dict pedido.
   */
  async function changeLanguage(language: Language) {
    if (user?.language === language) return;
    try {
      await update({ language });
      toast.success(translate(language, 'settings.preferencesSaved'));
    } catch {
      /* el hook ya guarda el error */
    }
  }

  async function changeCurrency(currencyCode: string) {
    if (user?.currencyCode === currencyCode) return;
    try {
      await update({ currencyCode });
      toast.success(t('settings.preferencesSaved'));
    } catch {
      /* noop */
    }
  }

  async function changeTheme(theme: 'light' | 'dark' | 'system') {
    if (user?.theme === theme) return;
    try {
      await update({ theme });
    } catch {
      /* noop */
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted">{t('settings.subtitle')}</p>
      </div>

      {/* Atajos a gestión */}
      <Card>
        <CardContent>
          <h3 className="mb-2 font-semibold">{t('settings.management')}</h3>
          <NavRow
            href="/ajustes/categorias"
            icon={<Tag className="h-4 w-4" />}
            title={t('settings.categories')}
            description={t('settings.categoriesDesc')}
          />
          <NavRow
            href="/presupuestos"
            icon={<Target className="h-4 w-4" />}
            title={t('nav.budgets')}
            description={t('settings.budgetsDesc')}
          />
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardContent>
          <h3 className="mb-4 font-semibold">{t('settings.preferences')}</h3>

          {/* Idioma */}
          <div className="border-b border-ink-200 py-3 dark:border-ink-700">
            <div className="mb-2 flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted" />
              <span className="text-sm font-medium">{t('settings.language')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((l) => (
                <ChoiceButton
                  key={l.code}
                  active={user?.language === l.code}
                  onClick={() => changeLanguage(l.code)}
                >
                  {/* Bug fix: el label SE TRADUCE al idioma activo, así que
                      "Español" pasa a "Spanish" cuando estás en inglés. */}
                  {t(l.labelKey)}
                </ChoiceButton>
              ))}
            </div>
          </div>

          {/* Moneda */}
          <div className="border-b border-ink-200 py-3 dark:border-ink-700">
            <div className="mb-2 flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted" />
              <span className="text-sm font-medium">{t('settings.currency')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SUPPORTED_CURRENCIES.map((c) => (
                <ChoiceButton
                  key={c.code}
                  active={user?.currencyCode === c.code}
                  onClick={() => changeCurrency(c.code)}
                >
                  <span className="font-bold mr-1">{c.symbol}</span>
                  {c.code}
                </ChoiceButton>
              ))}
            </div>
          </div>

          {/* Tema */}
          <div className="py-3">
            <div className="mb-2 flex items-center gap-3">
              {user?.theme === 'dark' ? <Moon className="h-4 w-4 text-muted" /> :
               user?.theme === 'system' ? <Laptop className="h-4 w-4 text-muted" /> :
               <Sun className="h-4 w-4 text-muted" />}
              <span className="text-sm font-medium">{t('settings.theme')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <ChoiceButton active={user?.theme === 'light'} onClick={() => changeTheme('light')}>
                <Sun className="h-4 w-4" /> {t('settings.theme.light')}
              </ChoiceButton>
              <ChoiceButton active={user?.theme === 'dark'} onClick={() => changeTheme('dark')}>
                <Moon className="h-4 w-4" /> {t('settings.theme.dark')}
              </ChoiceButton>
              <ChoiceButton active={user?.theme === 'system'} onClick={() => changeTheme('system')}>
                <Laptop className="h-4 w-4" /> {t('settings.theme.system')}
              </ChoiceButton>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardContent>
          <h3 className="mb-4 font-semibold">{t('settings.security')}</h3>
          <SecurityRow
            icon={<Lock className="h-4 w-4 text-muted" />}
            label={t('settings.changePassword')}
            onClick={() => setPwdOpen(true)}
          />
          <SecurityRow
            icon={<Mail className="h-4 w-4 text-muted" />}
            label={t('settings.changeEmail')}
            onClick={() => toast.info(t('security.changeEmailSoon'))}
          />
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardContent>
          <h3 className="mb-4 font-semibold">{t('settings.plan')}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {user?.isPremium ? t('settings.planPremium') : t('settings.planFree')}
              </p>
              <p className="text-xs text-muted">
                {user?.isPremium ? t('settings.planPremiumDesc') : t('settings.planFreeDesc')}
              </p>
            </div>
            {!user?.isPremium && (
              <Link href="/premium">
                <Button variant="gold" size="sm">{t('settings.upgrade')}</Button>
              </Link>
            )}
          </div>

          {/* Acceso visible para administrar / cancelar plan.
              Antes la cancelación estaba enterrada en /premium y el usuario no
              la encontraba; ahora hay un acceso explícito desde Ajustes. */}
          <div className="mt-3 border-t border-ink-200 pt-3 dark:border-ink-700">
            <NavRow
              href="/premium"
              icon={user?.isPremium ? <Crown className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
              title={user?.isPremium ? t('settings.cancelSubscription') : t('settings.managePlan')}
              description={
                user?.isPremium
                  ? t('settings.cancelSubscriptionDesc')
                  : t('settings.managePlanDesc')
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button variant="danger" onClick={handleLogout} fullWidth>
        <LogOut className="h-4 w-4" /> {t('settings.logout')}
      </Button>

      <ChangePasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all',
        active
          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
          : 'border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600',
      )}
    >
      {children}
    </button>
  );
}

function NavRow({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-ink-400" />
    </Link>
  );
}

function SecurityRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ink-50 dark:hover:bg-ink-800"
    >
      <span className="flex items-center gap-3 text-sm font-medium">
        {icon}
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-ink-400" />
    </button>
  );
}

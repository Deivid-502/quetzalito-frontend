'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, AtSign, Phone, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth.store';
import { ApiError } from '@/lib/api';
import { useT } from '@/lib/i18n';

export default function RegisterPage() {
  const t = useT();
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validación rápida en frontend (también está en backend)
    if (form.password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      setError(t('auth.passwordMissingChars'));
      return;
    }

    setLoading(true);
    try {
      await register({
        ...form,
        phone: form.phone || undefined,
      });
      router.replace('/dashboard');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('auth.registerError');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">{t('auth.createYourAccount')}</h1>
          <p className="mt-1 text-sm text-muted">{t('auth.registerHero')}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('auth.firstName')}
              name="firstName"
              required
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />
            <Input
              label={t('auth.lastName')}
              name="lastName"
              required
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />
          </div>

          <Input
            label={t('auth.nickname')}
            hint={t('auth.nicknameHintShort')}
            name="nickname"
            required
            value={form.nickname}
            onChange={(e) => update('nickname', e.target.value)}
            leftIcon={<AtSign className="h-4 w-4" />}
          />

          <Input
            label={t('auth.emailFull')}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <Input
            label={t('auth.phoneOptional')}
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            leftIcon={<Phone className="h-4 w-4" />}
            placeholder={t('auth.phonePlaceholder')}
          />

          <Input
            label={t('auth.password')}
            name="password"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            hint={t('auth.passwordHintFull')}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-ink-400 hover:text-ink-600"
                aria-label={showPwd ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {error && (
            <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg">
            {t('auth.registerBtn')}
          </Button>

          <p className="text-center text-[11px] text-muted">{t('auth.termsAccept2')}</p>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {t('auth.hasAccount')}{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            {t('auth.signInLink')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

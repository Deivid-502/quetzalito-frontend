'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useT } from '@/lib/i18n';
import { useAuthStore } from '@/stores/auth.store';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: Props) {
  const t = useT();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setCurrent('');
    setNext('');
    setConfirm('');
    setError(null);
  }, [open]);

  const validNew = next.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(next);
  const matches = next === confirm;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validNew) {
      setError(t('security.passwordHint'));
      return;
    }
    if (!matches) {
      setError(t('security.passwordMismatch'));
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/users/me/change-password', {
        currentPassword: current,
        newPassword: next,
      });
      toast.success(t('security.passwordChanged'));
      // El backend invalidó la sesión: forzamos logout local y redirigimos
      setUser(null);
      onClose();
      router.replace('/login');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'No pudimos cambiar la contraseña.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('security.changePassword.title')}
      description={t('security.changePassword.desc')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 flex gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{t('security.changePassword.desc')}</p>
        </div>

        <Input
          label={t('security.currentPassword')}
          type={showCurrent ? 'text' : 'password'}
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          leftIcon={<Lock className="h-4 w-4" />}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="text-ink-400 hover:text-ink-600"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Input
          label={t('security.newPassword')}
          type={showNext ? 'text' : 'password'}
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          leftIcon={<Lock className="h-4 w-4" />}
          hint={t('security.passwordHint')}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowNext((v) => !v)}
              className="text-ink-400 hover:text-ink-600"
            >
              {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Input
          label={t('security.confirmPassword')}
          type={showNext ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          leftIcon={<Lock className="h-4 w-4" />}
          error={confirm && !matches ? t('security.passwordMismatch') : undefined}
        />

        {error && (
          <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={submitting} disabled={!validNew || !matches || !current}>
            {t('settings.changePassword')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

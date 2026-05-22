'use client';

import { useCallback } from 'react';
import { Clock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { api } from '@/lib/api';
import { useT } from '@/lib/i18n';

export function IdleTimeoutModal() {
  const t = useT();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleIdle = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch { /* ignorar */ }
    logout();
    router.replace('/login?reason=idle');
  }, [logout, router]);

  const { isWarning, secondsLeft, reset } = useIdleTimeout({
    timeoutMinutes: 30,
    warnMinutes: 25,
    onIdle: handleIdle,
  });

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const countdown = mins > 0
    ? `${mins}:${String(secs).padStart(2, '0')}`
    : `${secs}s`;

  return (
    <Modal
      open={isWarning}
      onClose={reset}
      title={t('idle.title')}
    >
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3 py-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30">
            <Clock className="h-7 w-7" />
          </span>
          <p className="text-center text-sm text-ink-600 dark:text-ink-400">
            {t('idle.body')}
          </p>
          <div className="text-4xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
            {countdown}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 gap-2" onClick={handleIdle}>
            <LogOut className="h-4 w-4" />
            {t('idle.logoutNow')}
          </Button>
          <Button className="flex-1" onClick={reset}>
            {t('idle.stayConnected')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

'use client';

import { useState } from 'react';
import { MailCheck, X, Loader2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useT } from '@/lib/i18n';

interface Props {
  onVerified?: () => void;
}

export function EmailVerificationBanner({ onVerified }: Props) {
  const t = useT();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (dismissed) return null;

  async function handleResend() {
    setSending(true);
    try {
      await api.post('/auth/verify-email/send');
      setSent(true);
      toast.success(t('emailVerify.sent'));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.error'));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-900/20">
      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400">
          <MailCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {t('emailVerify.bannerTitle')}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            {sent ? t('emailVerify.sentDesc') : t('emailVerify.bannerDesc')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {!sent && (
          <button
            onClick={handleResend}
            disabled={sending}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100 disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {t('emailVerify.resend')}
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-500 hover:text-amber-700 dark:text-amber-400"
          aria-label={t('common.dismiss')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

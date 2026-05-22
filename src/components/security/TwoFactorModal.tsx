'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldCheck, Loader2, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useT } from '@/lib/i18n';

export type SensitivePurpose = 'change_password' | 'change_email';

interface Props {
  open: boolean;
  purpose: SensitivePurpose;
  onClose: () => void;
  /** Se llama después de verificar exitosamente el código */
  onVerified: () => void;
}

const PURPOSE_COOLDOWN = 60; // seg entre reenvíos

export function TwoFactorModal({ open, purpose, onClose, onVerified }: Props) {
  const t = useT();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Al abrir, solicitar el código automáticamente
  useEffect(() => {
    if (open) {
      setDigits(['', '', '', '', '', '']);
      setCodeSent(false);
      void requestCode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Limpiar cooldown al cerrar
  useEffect(() => {
    if (!open && cooldownRef.current) {
      clearInterval(cooldownRef.current);
      setCooldown(0);
    }
  }, [open]);

  function startCooldown() {
    setCooldown(PURPOSE_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  const requestCode = useCallback(async () => {
    setSending(true);
    try {
      await api.post('/auth/sensitive/request', { purpose });
      setCodeSent(true);
      startCooldown();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.error'));
    } finally {
      setSending(false);
    }
  }, [purpose, t]);

  function handleDigit(idx: number, val: string) {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = clean;
    setDigits(next);
    if (clean && idx < 5) inputRefs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length > 0) {
      const next = [...digits];
      text.split('').forEach((d, i) => { if (i < 6) next[i] = d; });
      setDigits(next);
      inputRefs.current[Math.min(text.length, 5)]?.focus();
      e.preventDefault();
    }
  }

  async function handleVerify() {
    const code = digits.join('');
    if (code.length < 6) return;

    setVerifying(true);
    try {
      await api.post('/auth/sensitive/verify', { code, purpose });
      toast.success(t('twoFactor.verified'));
      onVerified();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.error'));
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  }

  const purposeKey = purpose === 'change_password' ? 'twoFactor.purposePassword' : 'twoFactor.purposeEmail';
  const code = digits.join('');

  return (
    <Modal open={open} onClose={onClose} title={t('twoFactor.title')}>
      <div className="space-y-6">
        {/* Ícono + descripción */}
        <div className="flex flex-col items-center gap-3 pt-1">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <p className="text-center text-sm text-muted">
            {sending
              ? t('twoFactor.sending')
              : codeSent
              ? t('twoFactor.body', { purpose: t(purposeKey) })
              : t('twoFactor.preparing')}
          </p>
        </div>

        {/* Input de 6 dígitos */}
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              disabled={!codeSent || verifying}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`
                h-12 w-10 rounded-xl border text-center text-xl font-bold tabular-nums
                transition-all outline-none
                border-ink-300 dark:border-ink-600
                bg-surface
                focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30
                disabled:opacity-50
                ${d ? 'border-brand-400' : ''}
              `}
            />
          ))}
        </div>

        {/* Botón verificar */}
        <Button
          className="w-full"
          disabled={code.length < 6 || verifying || !codeSent}
          onClick={handleVerify}
        >
          {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {t('twoFactor.verify')}
        </Button>

        {/* Reenviar código */}
        <div className="text-center">
          <button
            onClick={requestCode}
            disabled={cooldown > 0 || sending}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {cooldown > 0
              ? t('twoFactor.resendIn', { secs: String(cooldown) })
              : t('twoFactor.resend')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

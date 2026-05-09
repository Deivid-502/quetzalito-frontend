'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Crown,
  Check,
  Sparkles,
  Loader2,
  Calendar,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/components/ui/Toaster';
import { ApiError } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const PREMIUM_FEATURES = [
  'Sobres ilimitados (sin límite de 5)',
  'Sin anuncios',
  'Categorías personalizadas avanzadas',
  'Estadísticas extendidas con comparativas mes a mes',
  'Exportación a PDF y Excel',
  'Tips financieros personalizados',
  'Soporte prioritario',
];

export default function PremiumPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { status, loading, error, activate, cancel } = useSubscription();
  const [activateOpen, setActivateOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading && !status) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error || !status) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-danger">{error ?? 'No pudimos cargar tu plan.'}</p>
        </CardContent>
      </Card>
    );
  }

  const isPremium = status.isPremium;

  async function handleActivate() {
    setSubmitting(true);
    try {
      const res = await activate();
      const endsAt = res.subscription.endsAt
        ? new Date(res.subscription.endsAt).toLocaleDateString('es-GT')
        : '';
      toast.success(`Premium activado hasta el ${endsAt}. ¡Disfrutalo!`);
      setActivateOpen(false);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No pudimos activar Premium.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    setSubmitting(true);
    try {
      await cancel();
      toast.success('Suscripción cancelada. Volvés al plan Free.');
      setCancelOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'No pudimos cancelar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-600">
          <Crown className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quetzalito Premium</h1>
          <p className="text-muted">
            {isPremium
              ? 'Estás disfrutando todas las funciones avanzadas.'
              : 'Llevá tu control financiero al siguiente nivel.'}
          </p>
        </div>
      </div>

      {/* Estado actual */}
      {isPremium && status.activeSubscription && (
        <Card className="border-gold-500/40 bg-gradient-to-br from-gold-500/10 to-brand-500/10">
          <CardContent>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 shrink-0 text-gold-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-gold-700 dark:text-gold-400">
                  Premium activo
                </p>
                <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Activo desde:{' '}
                      <strong className="text-ink-700 dark:text-ink-100">
                        {new Date(status.activeSubscription.startsAt).toLocaleDateString('es-GT')}
                      </strong>
                    </span>
                  </div>
                  {status.activeSubscription.endsAt && (
                    <div className="flex items-center gap-2 text-muted">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Próxima renovación:{' '}
                        <strong className="text-ink-700 dark:text-ink-100">
                          {new Date(status.activeSubscription.endsAt).toLocaleDateString('es-GT')}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card>
        <CardContent>
          <h3 className="mb-4 font-semibold">¿Qué incluye Premium?</h3>
          <ul className="space-y-3">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Check className="h-3 w-3" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Pricing + acción */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-gold-500 to-brand-500 p-6 text-white">
          <p className="text-sm/6 opacity-80">{isPremium ? 'Tu plan actual' : 'Premium mensual'}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-5xl font-bold tracking-tight">
              {formatCurrency(status.pricing.amount, status.pricing.currency)}
            </span>
            <span className="text-sm opacity-80">/ {status.pricing.intervalDays} días</span>
          </div>
          <p className="mt-2 text-xs opacity-80">
            Sin permanencia · Cancelá cuando quieras
          </p>
        </div>
        <CardContent>
          {isPremium ? (
            <div className="space-y-3">
              <Button
                fullWidth
                variant="ghost"
                onClick={() => setCancelOpen(true)}
              >
                Cancelar suscripción
              </Button>
              <p className="text-center text-xs text-muted">
                Si cancelás, tu plan se desactiva inmediatamente.
              </p>
            </div>
          ) : (
            <Button
              fullWidth
              variant="gold"
              size="lg"
              onClick={() => setActivateOpen(true)}
            >
              <CreditCard className="h-4 w-4" /> Activar Premium
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modal: confirmar activación */}
      <Modal
        open={activateOpen}
        onClose={() => !submitting && setActivateOpen(false)}
        title="Activar Premium"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-gold-500/10 p-4 text-sm">
            <p className="font-semibold text-gold-700 dark:text-gold-400">
              Total a pagar: {formatCurrency(status.pricing.amount, status.pricing.currency)}
            </p>
            <p className="mt-1 text-xs text-muted">
              Acceso por {status.pricing.intervalDays} días.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
            <p className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Modo demo:</strong> esta es una simulación de pago. En producción
                acá iría la pasarela real (Stripe, PayU, etc.). Sin cobro real.
              </span>
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setActivateOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button variant="gold" onClick={handleActivate} loading={submitting}>
              Confirmar y activar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: confirmar cancelación */}
      <Modal
        open={cancelOpen}
        onClose={() => !submitting && setCancelOpen(false)}
        title="Cancelar Premium"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm dark:border-red-700/50 dark:bg-red-900/20">
            <p className="flex items-start gap-2 text-red-800 dark:text-red-300">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Vas a perder acceso inmediatamente a:
              </span>
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1 text-xs text-red-700 dark:text-red-400">
              <li>Sobres ilimitados (volvés al límite de 5)</li>
              <li>Funciones premium</li>
              <li>Sin anuncios (volverán a aparecer)</li>
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-ink-200 pt-3 dark:border-ink-700">
            <a
              href="/legal/reembolso"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 hover:underline"
            >
              Ver política de reembolso
            </a>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setCancelOpen(false)}
                disabled={submitting}
              >
                Mantener Premium
              </Button>
              <Button variant="danger" onClick={handleCancel} loading={submitting}>
                Sí, cancelar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

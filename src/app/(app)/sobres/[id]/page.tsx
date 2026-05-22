'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowLeftRight,
  Pencil,
  Archive,
  TrendingDown,
  TrendingUp,
  Loader2,
  Target,
  Calendar,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EnvelopeFormModal } from '@/components/envelopes/EnvelopeFormModal';
import { TransferModal } from '@/components/envelopes/TransferModal';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { CategoryIcon } from '@/lib/icons';
import { useEnvelopes, useEnvelopeDetail } from '@/hooks/useEnvelopes';
import { useTransactionModal } from '@/components/transactions/TransactionModalProvider';
import { useAuthStore } from '@/stores/auth.store';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { useT } from '@/lib/i18n';

interface PageProps {
  params: { id: string };
}

export default function EnvelopeDetailPage({ params }: PageProps) {
  const t = useT();
  const { id } = params;
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const currency = user?.currencyCode ?? 'GTQ';

  const { data, loading, error, refresh } = useEnvelopeDetail(id);
  const { envelopes, update, archive, transfer } = useEnvelopes();
  const { open: openTxModal } = useTransactionModal();

  const [editOpen, setEditOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link href="/sobres" className="inline-flex items-center gap-1 text-sm text-muted hover:underline">
          <ArrowLeft className="h-4 w-4" /> {t('envelopes.backToList')}
        </Link>
        <Card>
          <CardContent>
            <p className="text-sm text-danger">{error ?? t('envelopes.notFound')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { envelope, stats, recentTransactions } = data;

  return (
    <div className="space-y-6">
      <Link href="/sobres" className="inline-flex items-center gap-1 text-sm text-muted hover:underline">
        <ArrowLeft className="h-4 w-4" /> {t('envelopes.backToList')}
      </Link>

      {/* Header con identidad del sobre */}
      <Card className="overflow-hidden">
        <div
          className="px-6 py-8 text-white"
          style={{
            background: `linear-gradient(135deg, ${envelope.color}EE, ${envelope.color}99)`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
                <CategoryIcon name={envelope.icon} className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold truncate">{envelope.name}</h1>
                {envelope.description && (
                  <p className="text-sm opacity-80 truncate">{envelope.description}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openTxModal({ defaultEnvelopeId: envelope.id })}
                className="!bg-white !text-ink-900 hover:!bg-white/90"
              >
                <Plus className="h-4 w-4" /> {t('transactions.movement')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setTransferOpen(true)}
                className="!bg-white/20 !text-white !border-white/30 hover:!bg-white/30"
              >
                <ArrowLeftRight className="h-4 w-4" /> {t('envelopes.transfer')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="!bg-white/20 !text-white !border-white/30 hover:!bg-white/30"
              >
                <Pencil className="h-4 w-4" /> {t('common.edit')}
              </Button>
              {!envelope.isMain && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmArchive(true)}
                  className="!bg-white/20 !text-white !border-white/30 hover:!bg-white/30"
                >
                  <Archive className="h-4 w-4" /> {t('envelopes.archive')}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm opacity-80">{t('envelopes.currentBalance')}</p>
            <p className="mt-1 text-4xl font-bold sm:text-5xl">
              {formatCurrency(envelope.currentBalance, currency)}
            </p>
          </div>

          {envelope.targetAmount && stats.progress !== null && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 opacity-90">
                  <Target className="h-4 w-4" /> {t('envelopes.target')}:{' '}
                  {formatCurrency(envelope.targetAmount, currency)}
                </span>
                <span className="font-semibold">{Math.round(stats.progress)}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Stats del mes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{t('dashboard.monthIncome')}</p>
                <p className="mt-1 text-2xl font-bold text-brand-600">
                  +{formatCurrency(stats.monthIncome, currency)}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
                <TrendingUp className="h-5 w-5" />
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{t('dashboard.monthExpense')}</p>
                <p className="mt-1 text-2xl font-bold text-danger">
                  −{formatCurrency(stats.monthExpense, currency)}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-danger dark:bg-red-900/20">
                <TrendingDown className="h-5 w-5" />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Movimientos */}
      <Card>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{t('envelopes.recentMovements')}</h3>
            <span className="text-xs text-muted">{t('envelopes.lastN', { n: 20 })}</span>
          </div>
          {recentTransactions.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-7 w-7" />}
              title={t('envelopes.noMovementsTitle')}
              description={t('envelopes.noMovementsDesc')}
              action={
                <Button onClick={() => openTxModal({ defaultEnvelopeId: envelope.id })}>
                  <Plus className="h-4 w-4" /> {t('transactions.newMovement')}
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-ink-200 dark:divide-ink-700">
              {recentTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} currency={currency} showEnvelope={false} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <EnvelopeFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        envelope={envelope}
        currency={currency}
        onSubmit={async (payload) => {
          await update(envelope.id, payload as Parameters<typeof update>[1]);
          await refresh();
        }}
      />

      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        envelopes={envelopes}
        defaultSourceId={envelope.id}
        currency={currency}
        onSubmit={async (payload) => {
          await transfer(payload);
          await refresh();
        }}
      />

      <ConfirmDialog
        open={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        title={t('envelopes.archiveConfirmTitle')}
        description={
          envelope.currentBalance > 0
            ? t('envelopes.archiveWithBalance', {
                amount: formatCurrency(envelope.currentBalance, currency),
              })
            : t('envelopes.archiveNoBalance')
        }
        confirmLabel={t('envelopes.archive')}
        onConfirm={async () => {
          await archive(envelope.id);
          toast.success(t('envelopes.archivedToast'));
          router.replace('/sobres');
        }}
      />
    </div>
  );
}

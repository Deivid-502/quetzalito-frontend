'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowLeftRight, Wallet, Loader2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AdSlot } from '@/components/common/AdSlot';
import { EnvelopeCard } from '@/components/envelopes/EnvelopeCard';
import { EnvelopeFormModal } from '@/components/envelopes/EnvelopeFormModal';
import { TransferModal } from '@/components/envelopes/TransferModal';
import { useEnvelopes } from '@/hooks/useEnvelopes';
import { useAuthStore } from '@/stores/auth.store';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { useT } from '@/lib/i18n';
import type { Envelope } from '@/types/envelope';

const FREE_ENVELOPE_LIMIT = 5;

export default function SobresPage() {
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const currency = user?.currencyCode ?? 'GTQ';

  const { envelopes, totalBalance, loading, error, create, update, archive, remove, transfer } =
    useEnvelopes();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<Envelope | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState<Envelope | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Envelope | null>(null);

  const main = envelopes.find((e) => e.isMain);
  const others = envelopes.filter((e) => !e.isMain);

  function openCreate() {
    setFormMode('create');
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(env: Envelope) {
    setFormMode('edit');
    setEditing(env);
    setFormOpen(true);
  }

  async function handleSubmit(payload: Parameters<typeof create>[0] | Parameters<typeof update>[1]) {
    if (formMode === 'create') {
      await create(payload as Parameters<typeof create>[0]);
    } else if (editing) {
      await update(editing.id, payload as Parameters<typeof update>[1]);
    }
  }

  // Solo cuentan los sobres NO archivados (la lista ya viene filtrada del BE)
  // El límite Free es 5 incluyendo la cuenta principal.
  const isPremium = user?.isPremium ?? false;
  const reachedLimit = !isPremium && envelopes.length >= FREE_ENVELOPE_LIMIT;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('envelopes.title')}</h1>
          <p className="text-muted">{t('envelopes.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setTransferOpen(true)} disabled={envelopes.length < 2}>
            <ArrowLeftRight className="h-4 w-4" /> {t('envelopes.transfer')}
          </Button>
          <Button onClick={openCreate} disabled={reachedLimit}>
            <Plus className="h-4 w-4" /> {t('envelopes.create')}
          </Button>
        </div>
      </div>

      {/* Contador para usuarios Free */}
      {!isPremium && envelopes.length > 0 && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm',
            reachedLimit
              ? 'border-gold-500/40 bg-gold-500/10 text-gold-700 dark:text-gold-400'
              : 'border-ink-200 bg-ink-50/50 text-ink-700 dark:border-ink-700 dark:bg-ink-800/30 dark:text-ink-200',
          )}
        >
          <div>
            <p className="font-medium">
              {t('envelopes.usedOf', { used: envelopes.length, total: FREE_ENVELOPE_LIMIT })}
            </p>
            {reachedLimit && (
              <p className="text-xs opacity-90 mt-0.5">{t('envelopes.limitReachedShort')}</p>
            )}
          </div>
          {reachedLimit && (
            <Link href="/premium">
              <Button variant="gold" size="sm">
                <Crown className="h-4 w-4" /> {t('envelopes.upgradeNow')}
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Total */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
              <Wallet className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-muted">{t('envelopes.totalBalance')}</p>
              <p className="text-3xl font-bold">{formatCurrency(totalBalance, currency)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading / error */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      )}
      {error && !loading && (
        <Card>
          <CardContent>
            <p className="text-sm text-danger">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      {!loading && !error && (
        <>
          {/* Cuenta principal destacada */}
          {main && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                {t('envelopes.mainAccount')}
              </h2>
              <EnvelopeCard
                envelope={main}
                currency={currency}
                href={`/sobres/${main.id}`}
                onEdit={() => openEdit(main)}
              />
            </div>
          )}

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              {t('envelopes.yourEnvelopesCount', { n: others.length })}
            </h2>
            {others.length === 0 ? (
              <EmptyState
                icon={<Wallet className="h-7 w-7" />}
                title={t('envelopes.firstEnvelopeTitle')}
                description={t('envelopes.firstEnvelopeDesc')}
                action={
                  <Button onClick={openCreate}>
                    <Plus className="h-4 w-4" /> {t('envelopes.createEnvelope')}
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((env) => (
                  <EnvelopeCard
                    key={env.id}
                    envelope={env}
                    currency={currency}
                    href={`/sobres/${env.id}`}
                    onEdit={() => openEdit(env)}
                    onArchive={() => setConfirmArchive(env)}
                    onDelete={() => setConfirmDelete(env)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modales */}
      <EnvelopeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        envelope={editing}
        mainEnvelopeBalance={main?.currentBalance}
        currency={currency}
        onSubmit={handleSubmit}
      />

      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        envelopes={envelopes}
        currency={currency}
        onSubmit={transfer}
      />

      <ConfirmDialog
        open={!!confirmArchive}
        onClose={() => setConfirmArchive(null)}
        title={t('envelopes.archiveConfirmTitle')}
        description={
          confirmArchive && confirmArchive.currentBalance > 0
            ? t('envelopes.archiveWithBalance', {
                amount: formatCurrency(confirmArchive.currentBalance, currency),
              })
            : t('envelopes.archiveNoBalance')
        }
        confirmLabel={t('envelopes.archive')}
        onConfirm={async () => {
          if (!confirmArchive) return;
          await archive(confirmArchive.id);
          toast.success(t('envelopes.archivedToast'));
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={t('envelopes.deleteConfirm')}
        description={t('envelopes.deleteConfirmDesc')}
        confirmLabel={t('envelopes.delete')}
        destructive
        onConfirm={async () => {
          if (!confirmDelete) return;
          await remove(confirmDelete.id);
          toast.success(t('envelopes.deleted'));
        }}
      />

      {/* Slot publicitario discreto al pie (solo Free) */}
      <AdSlot variant="banner" slotId="sobres-bottom" />
    </div>
  );
}

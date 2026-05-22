'use client';

import { useMemo, useState } from 'react';
import { Calendar, Filter, History, Loader2, TrendingDown, TrendingUp, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, type SelectOption } from '@/components/ui/Select';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AdSlot } from '@/components/common/AdSlot';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { useTransactions } from '@/hooks/useTransactions';
import { useEnvelopes } from '@/hooks/useEnvelopes';
import { useCategories } from '@/hooks/useCategories';
import { useAuthStore } from '@/stores/auth.store';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { useT, useLanguage } from '@/lib/i18n';
import type { Transaction, TransactionType } from '@/types/transaction';

function ymd(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function HistorialPage() {
  const t = useT();
  const { language } = useLanguage();
  const user = useAuthStore((s) => s.user);
  const currency = user?.currencyCode ?? 'GTQ';

  // Locale BCP-47 derivado del idioma activo (afecta formato de meses, días, etc).
  const locale = language === 'en' ? 'en-US' : 'es-GT';

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [type, setType] = useState<TransactionType | ''>('');
  const [envelopeId, setEnvelopeId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  const filters = useMemo(() => {
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      type: type || undefined,
      envelopeId: envelopeId || undefined,
      categoryId: categoryId || undefined,
      limit: 100,
    };
  }, [year, month, type, envelopeId, categoryId]);

  const { data, loading, error, remove } = useTransactions(filters);
  const { envelopes } = useEnvelopes();
  const { categories } = useCategories();

  const [confirmDelete, setConfirmDelete] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Agrupar por día
  const grouped = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, Transaction[]>();
    for (const tx of data.items) {
      const day = ymd(new Date(tx.occurredAt));
      const arr = map.get(day) ?? [];
      arr.push(tx);
      map.set(day, arr);
    }
    return [...map.entries()]
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([day, items]) => ({ day, items }));
  }, [data]);

  const monthLabel = new Date(year, month).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  // Opciones de Listbox
  const monthOptions: SelectOption<number>[] = Array.from({ length: 12 }).map((_, i) => ({
    value: i,
    label: capitalize(new Date(2024, i).toLocaleDateString(locale, { month: 'long' })),
  }));
  const yearOptions: SelectOption<number>[] = [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map((y) => ({
    value: y,
    label: String(y),
  }));
  const typeOptions: SelectOption<TransactionType | ''>[] = [
    { value: '', label: t('common.all') },
    { value: 'income', label: t('transactions.income') },
    { value: 'expense', label: t('transactions.expense') },
    { value: 'transfer_in', label: t('transactions.transferIn') },
    { value: 'transfer_out', label: t('transactions.transferOut') },
  ];
  const envelopeOptions: SelectOption<string>[] = [
    { value: '', label: t('common.all') },
    ...envelopes.map((e) => ({ value: e.id, label: e.name })),
  ];
  const categoryOptions: SelectOption<string>[] = [
    { value: '', label: t('common.all') },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const hasFilters = !!type || !!envelopeId || !!categoryId;

  function clearFilters() {
    setType('');
    setEnvelopeId('');
    setCategoryId('');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('history.title')}</h1>
          <p className="text-muted">{t('history.subtitle')}</p>
        </div>
      </div>

      {/* Selector de mes */}
      <Card>
        <CardContent className="!py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted" />
              <div className="w-40">
                <Select
                  options={monthOptions}
                  value={month}
                  onChange={setMonth}
                  uiSize="sm"
                  ariaLabel={t('history.month')}
                />
              </div>
              <div className="w-24">
                <Select
                  options={yearOptions}
                  value={year}
                  onChange={setYear}
                  uiSize="sm"
                  ariaLabel={t('history.year')}
                />
              </div>
            </div>
            <Button
              variant={showFilters || hasFilters ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="h-4 w-4" /> {t('history.filters')}
              {hasFilters && (
                <span className="rounded-full bg-white/20 px-1.5 text-[10px]">●</span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">{t('common.type')}</label>
                <Select
                  options={typeOptions}
                  value={type}
                  onChange={(v) => setType(v as TransactionType | '')}
                  uiSize="sm"
                  ariaLabel={t('common.type')}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">{t('common.envelope')}</label>
                <Select
                  options={envelopeOptions}
                  value={envelopeId}
                  onChange={setEnvelopeId}
                  uiSize="sm"
                  ariaLabel={t('common.envelope')}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">{t('common.category')}</label>
                <Select
                  options={categoryOptions}
                  value={categoryId}
                  onChange={setCategoryId}
                  uiSize="sm"
                  ariaLabel={t('common.category')}
                />
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="sm:col-span-3 inline-flex items-center justify-center gap-1 text-xs text-muted hover:text-ink-700"
                >
                  <X className="h-3 w-3" /> {t('history.clearFilters')}
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Totales del periodo */}
      {data && (
        <div className="grid gap-3 sm:grid-cols-3">
          <TotalCard
            label={t('dashboard.monthIncome')}
            value={data.totals.income}
            currency={currency}
            icon={<TrendingUp className="h-4 w-4" />}
            color="brand"
          />
          <TotalCard
            label={t('dashboard.monthExpense')}
            value={data.totals.expense}
            currency={currency}
            icon={<TrendingDown className="h-4 w-4" />}
            color="danger"
          />
          <TotalCard
            label={t('common.balance')}
            value={data.totals.net}
            currency={currency}
            icon={data.totals.net >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            color={data.totals.net >= 0 ? 'brand' : 'danger'}
          />
        </div>
      )}

      {/* Lista */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : error ? (
            <p className="text-sm text-danger">{error}</p>
          ) : grouped.length === 0 ? (
            <EmptyState
              icon={<History className="h-7 w-7" />}
              title={t('transactions.noResults')}
              description={`${monthLabel}`}
            />
          ) : (
            <div className="divide-y divide-ink-200 dark:divide-ink-700">
              {grouped.map(({ day, items }) => {
                const dayTotal = items.reduce((sum, tx) => {
                  const sign = tx.type === 'income' || tx.type === 'transfer_in' ? 1 : -1;
                  return sum + sign * tx.amount;
                }, 0);
                return (
                  <div key={day} className="py-3 first:pt-0 last:pb-0">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {formatDayLabel(day, locale, t)}
                      </p>
                      <p
                        className={cn(
                          'text-xs font-semibold',
                          dayTotal >= 0 ? 'text-brand-600' : 'text-danger',
                        )}
                      >
                        {dayTotal >= 0 ? '+' : '−'}
                        {formatCurrency(Math.abs(dayTotal), currency)}
                      </p>
                    </div>
                    <div className="divide-y divide-ink-100 dark:divide-ink-800">
                      {items.map((tx) => (
                        <TransactionRow
                          key={tx.id}
                          tx={tx}
                          currency={currency}
                          onDelete={() => setConfirmDelete(tx)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={t('transactions.deleteConfirm')}
        description={t('transactions.deleteWarning')}
        confirmLabel={t('common.delete')}
        destructive
        onConfirm={async () => {
          if (!confirmDelete) return;
          await remove(confirmDelete.id);
          toast.success(t('transactions.deleted'));
        }}
      />

      <AdSlot variant="banner" slotId="historial-bottom" />
    </div>
  );
}

function TotalCard({
  label,
  value,
  currency,
  icon,
  color,
}: {
  label: string;
  value: number;
  currency: string;
  icon: React.ReactNode;
  color: 'brand' | 'danger';
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">{label}</p>
            <p
              className={cn(
                'mt-1 text-2xl font-bold',
                color === 'brand' ? 'text-brand-600' : 'text-danger',
              )}
            >
              {formatCurrency(value, currency)}
            </p>
          </div>
          <span
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl',
              color === 'brand'
                ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/15'
                : 'bg-red-50 text-danger dark:bg-red-900/20',
            )}
          >
            {icon}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDayLabel(ymdStr: string, locale: string, t: ReturnType<typeof useT>): string {
  const [y, m, d] = ymdStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (ymd(date) === ymd(today)) return locale.startsWith('en') ? 'Today' : 'Hoy';
  if (ymd(date) === ymd(yesterday)) return locale.startsWith('en') ? 'Yesterday' : 'Ayer';
  return capitalize(date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' }));
}

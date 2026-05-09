'use client';

import { useMemo, useState } from 'react';
import { Calendar, ChevronDown, Filter, History, Loader2, TrendingDown, TrendingUp, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
import { resolveIcon } from '@/lib/icons';
import type { Transaction, TransactionType } from '@/types/transaction';

/** Para usar dentro de <option>: muestra emoji o cadena vacía si es nombre Lucide */
function emojiOrEmpty(icon: string): string {
  const r = resolveIcon(icon);
  return typeof r === 'string' ? r : '';
}

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function ymd(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function HistorialPage() {
  const user = useAuthStore((s) => s.user);
  const currency = user?.currencyCode ?? 'GTQ';

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

  const monthLabel = new Date(year, month).toLocaleDateString('es-GT', {
    month: 'long',
    year: 'numeric',
  });

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
          <h1 className="text-3xl font-bold tracking-tight">Historial</h1>
          <p className="text-muted">Todos tus movimientos en un solo lugar.</p>
        </div>
      </div>

      {/* Selector de mes */}
      <Card>
        <CardContent className="!py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted" />
              <div className="relative inline-flex items-center">
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                  className="appearance-none rounded-lg border border-ink-200 bg-transparent px-2 py-1.5 pr-7 text-sm font-medium dark:border-ink-700 [&>option]:bg-white [&>option]:text-ink-700 dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i}>
                      {new Date(2024, i).toLocaleDateString('es-GT', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-ink-400" />
              </div>
              <div className="relative inline-flex items-center">
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10))}
                  className="appearance-none rounded-lg border border-ink-200 bg-transparent px-2 py-1.5 pr-7 text-sm font-medium dark:border-ink-700 [&>option]:bg-white [&>option]:text-ink-700 dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100"
                >
                  {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map(
                    (y) => (
                      <option key={y} value={y}>{y}</option>
                    ),
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-ink-400" />
              </div>
            </div>
            <Button
              variant={showFilters || hasFilters ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter className="h-4 w-4" /> Filtros
              {hasFilters && (
                <span className="rounded-full bg-white/20 px-1.5 text-[10px]">●</span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Tipo</label>
                <div className="relative flex items-center">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType | '')}
                    className="w-full appearance-none rounded-lg border border-ink-200 bg-transparent px-2 py-2 pr-8 text-sm dark:border-ink-700 [&>option]:bg-white [&>option]:text-ink-700 dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100"
                  >
                    <option value="">Todos</option>
                    <option value="income">Ingresos</option>
                    <option value="expense">Gastos</option>
                    <option value="transfer_in">Transferencias recibidas</option>
                    <option value="transfer_out">Transferencias enviadas</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-ink-400" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Sobre</label>
                <div className="relative flex items-center">
                  <select
                    value={envelopeId}
                    onChange={(e) => setEnvelopeId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-ink-200 bg-transparent px-2 py-2 pr-8 text-sm dark:border-ink-700 [&>option]:bg-white [&>option]:text-ink-700 dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100"
                  >
                    <option value="">Todos</option>
                    {envelopes.map((e) => (
                      <option key={e.id} value={e.id}>
                        {emojiOrEmpty(e.icon)} {e.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-ink-400" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Categoría</label>
                <div className="relative flex items-center">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-ink-200 bg-transparent px-2 py-2 pr-8 text-sm dark:border-ink-700 [&>option]:bg-white [&>option]:text-ink-700 dark:[&>option]:bg-ink-800 dark:[&>option]:text-ink-100"
                  >
                    <option value="">Todas</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-ink-400" />
                </div>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="sm:col-span-3 inline-flex items-center justify-center gap-1 text-xs text-muted hover:text-ink-700"
                >
                  <X className="h-3 w-3" /> Limpiar filtros
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
            label="Ingresos"
            value={data.totals.income}
            currency={currency}
            icon={<TrendingUp className="h-4 w-4" />}
            color="brand"
          />
          <TotalCard
            label="Gastos"
            value={data.totals.expense}
            currency={currency}
            icon={<TrendingDown className="h-4 w-4" />}
            color="danger"
          />
          <TotalCard
            label="Balance del mes"
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
              title="Sin movimientos en este periodo"
              description={`No encontramos movimientos para ${monthLabel}. Probá cambiar de mes o ajustar los filtros.`}
            />
          ) : (
            <div className="divide-y divide-ink-200 dark:divide-ink-700">
              {grouped.map(({ day, items }) => {
                const dayTotal = items.reduce((sum, t) => {
                  const sign = t.type === 'income' || t.type === 'transfer_in' ? 1 : -1;
                  return sum + sign * t.amount;
                }, 0);
                return (
                  <div key={day} className="py-3 first:pt-0 last:pb-0">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {formatDayLabel(day)}
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
        title="¿Eliminar este movimiento?"
        description={
          confirmDelete?.type === 'transfer_in' || confirmDelete?.type === 'transfer_out'
            ? 'Al eliminar una transferencia se borran ambos lados y se revierten los saldos.'
            : 'Se restaurará el saldo del sobre afectado.'
        }
        confirmLabel="Eliminar"
        destructive
        onConfirm={async () => {
          if (!confirmDelete) return;
          await remove(confirmDelete.id);
          toast.success('Movimiento eliminado.');
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

function formatDayLabel(ymdStr: string): string {
  const [y, m, d] = ymdStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (ymd(date) === ymd(today)) return 'Hoy';
  if (ymd(date) === ymd(yesterday)) return 'Ayer';
  return date.toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' });
}

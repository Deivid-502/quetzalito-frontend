'use client';

import Link from 'next/link';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Wallet,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Loader2,
  Info,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { AdSlot } from '@/components/common/AdSlot';
import { useAuthStore } from '@/stores/auth.store';
import { useDashboard } from '@/hooks/useDashboard';
import { useTransactionModal } from '@/components/transactions/TransactionModalProvider';
import { CategoryIcon, InlineIcon } from '@/lib/icons';
import { cn, formatCurrency } from '@/lib/utils';
import type {
  DashboardResponse,
  DashboardAlert,
  DashboardCategoryBreakdown,
  DashboardEnvelope,
  DashboardTransaction,
} from '@/types/dashboard';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, loading, error } = useDashboard();
  const { open: openTxModal } = useTransactionModal();

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-danger">{error ?? 'No pudimos cargar tu dashboard.'}</p>
        </CardContent>
      </Card>
    );
  }

  const currency = data.user.currencyCode || user?.currencyCode || 'GTQ';
  const todayLabel = new Date().toLocaleDateString('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-6">
      {/* ============= Saludo + CTA principal ============= */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hola, <span className="text-brand-500">{data.user.nickname}</span> 👋
          </h1>
          <p className="text-muted">Esto es lo que pasa con tu dinero hoy, {todayLabel}.</p>
        </div>
        <Button size="lg" variant="primary" onClick={() => openTxModal()}>
          <Plus className="h-5 w-5" /> Agregar gasto
        </Button>
      </div>

      {/* ============= Saldo principal + límite diario ============= */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Tarjeta de saldo grande */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white">
            <p className="text-sm/6 opacity-80">Saldo total disponible</p>
            <p className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
              {formatCurrency(data.balance.total, currency)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/15 p-1.5">
                  <ArrowDownRight className="h-4 w-4" />
                </span>
                <div>
                  <p className="opacity-80">Ingresos del mes</p>
                  <p className="font-semibold">{formatCurrency(data.balance.monthIncome, currency)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/15 p-1.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <div>
                  <p className="opacity-80">Gastos del mes</p>
                  <p className="font-semibold">{formatCurrency(data.balance.monthExpense, currency)}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Límite diario */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Target className="h-4 w-4" /> Podés gastar hoy
            </div>
            <p className="mt-2 text-3xl font-bold text-brand-500">
              {formatCurrency(data.dailyLimit.value, currency)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {data.dailyLimit.isCurrentMonth ? (
                <>Para llegar al fin de mes con tu saldo actual ({data.dailyLimit.daysLeft}{' '}
                  {data.dailyLimit.daysLeft === 1 ? 'día' : 'días'} restantes).</>
              ) : (
                <>Promedio diario para el mes seleccionado.</>
              )}
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-ink-100 dark:bg-ink-700">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  data.dailyLimit.percentSpent >= 100
                    ? 'bg-danger'
                    : data.dailyLimit.percentSpent >= 80
                    ? 'bg-amber-500'
                    : 'bg-brand-500',
                )}
                style={{ width: `${data.dailyLimit.percentSpent}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted">
              {Math.round(data.dailyLimit.percentSpent)}% de tus ingresos gastados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ============= Alertas inteligentes ============= */}
      {data.alerts.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((alert, i) => (
            <AlertBanner key={i} alert={alert} />
          ))}
        </div>
      )}

      {/* ============= Gráfica + tip ============= */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Gastos por categoría</h3>
              <span className="text-xs text-muted capitalize">
                {new Date(data.period.year, data.period.month - 1).toLocaleDateString('es-GT', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            {data.categoryBreakdown.length === 0 ? (
              <EmptyState
                icon={<TrendingDown className="h-7 w-7" />}
                title="Sin gastos este mes"
                description="Cuando registres gastos, vas a ver acá la distribución por categoría."
              />
            ) : (
              <CategoryBreakdownView
                items={data.categoryBreakdown}
                total={data.categoryBreakdownTotal}
                currency={currency}
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gold-500/10 to-brand-500/10 border-gold-500/20">
          <CardContent>
            <div className="flex items-center gap-2 text-gold-600">
              <Lightbulb className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Tip</span>
            </div>
            <h3 className="mt-2 font-semibold">{data.tip.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{data.tip.text}</p>
          </CardContent>
        </Card>
      </div>

      {/* ============= Sobres + actividad reciente ============= */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sobres */}
        <Card className="lg:col-span-2">
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Tus sobres</h3>
              <Link href="/sobres" className="text-xs font-semibold text-brand-600 hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {data.topEnvelopes.map((e) => (
                <EnvelopeTile key={e.id} envelope={e} currency={currency} />
              ))}
              <Link
                href="/sobres"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 p-4 text-sm font-medium text-muted transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-ink-700"
              >
                <Plus className="h-4 w-4" /> Nuevo sobre
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Actividad reciente</h3>
              <Link href="/historial" className="text-xs font-semibold text-brand-600 hover:underline">
                Ver historial
              </Link>
            </div>
            {data.recentTransactions.length === 0 ? (
              <p className="rounded-xl border-2 border-dashed border-ink-200 py-6 text-center text-xs text-muted dark:border-ink-700">
                Aún no hay movimientos este mes.
              </p>
            ) : (
              <ul className="divide-y divide-ink-200 dark:divide-ink-700">
                {data.recentTransactions.map((tx) => (
                  <RecentTxRow key={tx.id} tx={tx} currency={currency} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ============= Presupuestos en alerta (si los hay) ============= */}
      {data.budgetAlerts.length > 0 && (
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Presupuestos en alerta</h3>
              <Link href="/presupuestos" className="text-xs font-semibold text-brand-600 hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {data.budgetAlerts.map((b) => {
                const exceeded = b.status === 'exceeded';
                return (
                  <div
                    key={b.category.id}
                    className={cn(
                      'rounded-xl border p-3',
                      exceeded
                        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                        : 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ background: `${b.category.color}1A`, color: b.category.color }}
                      >
                        <CategoryIcon name={b.category.icon} className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{b.category.name}</p>
                        <p className={cn('text-xs', exceeded ? 'text-danger' : 'text-amber-700 dark:text-amber-300')}>
                          {formatCurrency(b.spent, currency)} de {formatCurrency(b.limit, currency)}
                          {' · '}
                          {exceeded ? 'Excedido' : 'Cerca del límite'}
                        </p>
                      </div>
                      <p className={cn('text-sm font-bold', exceeded ? 'text-danger' : 'text-amber-700 dark:text-amber-300')}>
                        {Math.round(b.percent)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slot de anuncio (Free tier) */}
      <AdSlot variant="banner" slotId="dashboard-bottom" />
    </div>
  );
}

// ============================================================
//  Sub-componentes
// ============================================================

function AlertBanner({ alert }: { alert: DashboardAlert }) {
  const styles: Record<DashboardAlert['severity'], { wrap: string; icon: React.ReactNode }> = {
    info: {
      wrap: 'border-ink-200 bg-ink-50 text-ink-800 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100',
      icon: <Info className="h-5 w-5" />,
    },
    warning: {
      wrap: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    danger: {
      wrap: 'border-red-200 bg-red-50 text-red-800 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  };
  const s = styles[alert.severity];
  return (
    <div className={cn('flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm', s.wrap)}>
      <span className="shrink-0">{s.icon}</span>
      <p className="flex-1">{alert.message}</p>
    </div>
  );
}

function CategoryBreakdownView({
  items,
  total,
  currency,
}: {
  items: DashboardCategoryBreakdown[];
  total: number;
  currency: string;
}) {
  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      <DonutChart items={items} total={total} currency={currency} />
      <ul className="space-y-2.5">
        {items.map((c) => (
          <li key={c.id} className="flex items-center justify-between text-sm gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${c.color}1A`, color: c.color }}
              >
                <CategoryIcon name={c.icon} className="h-4 w-4" />
              </span>
              <span className="font-medium truncate">{c.name}</span>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold">{formatCurrency(c.value, currency)}</p>
              <p className="text-[11px] text-muted">{Math.round(c.percent)}%</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DonutChart({
  items,
  total,
  currency,
}: {
  items: DashboardCategoryBreakdown[];
  total: number;
  currency: string;
}) {
  const RADIUS = 70;
  const STROKE = 22;
  const C = 2 * Math.PI * RADIUS;
  let offset = 0;

  return (
    <div className="relative mx-auto h-48 w-48">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="rgb(226 232 240)"
          strokeWidth={STROKE}
          className="dark:stroke-ink-700"
        />
        {items.map((d) => {
          const len = total > 0 ? (d.value / total) * C : 0;
          const seg = (
            <circle
              key={d.id}
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={d.color}
              strokeWidth={STROKE}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[11px] uppercase tracking-wide text-muted">Total</p>
        <p className="text-xl font-bold">{formatCurrency(total, currency)}</p>
      </div>
    </div>
  );
}

function EnvelopeTile({
  envelope,
  currency,
}: {
  envelope: DashboardEnvelope;
  currency: string;
}) {
  return (
    <Link
      href={`/sobres/${envelope.id}`}
      className="rounded-xl border surface p-4 transition-colors hover:bg-ink-50 dark:hover:bg-ink-700/30 border-ink-200 dark:border-ink-700"
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
          style={{ background: `${envelope.color}20` }}
        >
          <CategoryIcon name={envelope.icon} className="h-5 w-5" />
        </span>
        <p className="text-sm font-semibold truncate flex items-center gap-1">
          {envelope.name}
          {envelope.isMain && <Star className="h-3 w-3 fill-gold-500 text-gold-500" />}
        </p>
      </div>
      <p className="mt-3 text-xl font-bold">{formatCurrency(envelope.currentBalance, currency)}</p>
      {envelope.progress !== null && envelope.targetAmount && (
        <>
          <div className="mt-2 h-1.5 w-full rounded-full bg-ink-100 dark:bg-ink-700">
            <div
              className="h-full rounded-full"
              style={{ width: `${envelope.progress}%`, background: envelope.color }}
            />
          </div>
          <p className="mt-1 text-[11px] text-muted">
            Meta: {formatCurrency(envelope.targetAmount, currency)} · {Math.round(envelope.progress)}%
          </p>
        </>
      )}
    </Link>
  );
}

function RecentTxRow({
  tx,
  currency,
}: {
  tx: DashboardTransaction;
  currency: string;
}) {
  const isIncome = tx.type === 'income' || tx.type === 'transfer_in';
  const sign = isIncome ? '+' : '−';
  const color = tx.category?.color ?? (isIncome ? '#10B981' : '#EF4444');

  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${color}1A`, color }}
      >
        {tx.category ? (
          <CategoryIcon name={tx.category.icon} className="h-4 w-4" />
        ) : isIncome ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">
          {tx.description ?? tx.category?.name ?? (isIncome ? 'Ingreso' : 'Gasto')}
        </p>
        <p className="text-[11px] text-muted truncate">
          <InlineIcon icon={tx.envelope.icon} /> {tx.envelope.name}
        </p>
      </div>
      <p className={cn('text-sm font-semibold', isIncome ? 'text-brand-600' : 'text-danger')}>
        {sign}
        {formatCurrency(tx.amount, currency)}
      </p>
    </li>
  );
}

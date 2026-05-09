'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Target, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { BudgetFormModal } from '@/components/budgets/BudgetFormModal';
import { useBudgets } from '@/hooks/useBudgets';
import { useAuthStore } from '@/stores/auth.store';
import { cn, formatCurrency } from '@/lib/utils';
import type { BudgetItem } from '@/types/budget';

export default function PresupuestosPage() {
  const user = useAuthStore((s) => s.user);
  const currency = user?.currencyCode ?? 'GTQ';

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-indexed

  const { data, loading, upsert, remove } = useBudgets(year, month);
  const [editing, setEditing] = useState<BudgetItem | null>(null);

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m > 12) { m = 1; y++; }
    if (m < 1)  { m = 12; y--; }
    setMonth(m);
    setYear(y);
  }

  const monthLabel = new Date(year, month - 1).toLocaleDateString('es-GT', {
    month: 'long',
    year: 'numeric',
  });

  // Separar items en activos (con presupuesto) y sin definir
  const withBudget = data?.items.filter((i) => i.limit > 0) ?? [];
  const withoutBudget = data?.items.filter((i) => i.limit === 0) ?? [];

  const totals = data?.totals;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Presupuestos</h1>
          <p className="text-muted">Decidí cuánto querés gastar al mes en cada categoría.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-2 py-1 dark:border-ink-700">
          <button
            onClick={() => shiftMonth(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700/40"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold capitalize px-1 min-w-[120px] text-center">
            {monthLabel}
          </span>
          <button
            onClick={() => shiftMonth(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700/40"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading || !data ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      ) : (
        <>
          {/* Resumen mensual */}
          <Card className="overflow-hidden">
            <div className={cn(
              'p-6',
              totals && totals.percent >= 100
                ? 'bg-gradient-to-br from-red-500 to-red-700 text-white'
                : totals && totals.percent >= 80
                ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white'
                : 'bg-gradient-to-br from-brand-500 to-brand-700 text-white',
            )}>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Target className="h-4 w-4" /> Presupuesto total del mes
              </div>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold sm:text-4xl">
                    {formatCurrency(totals?.spent ?? 0, currency)}
                  </p>
                  <p className="opacity-80 text-sm">
                    de {formatCurrency(totals?.budgeted ?? 0, currency)} presupuestados
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{Math.round(totals?.percent ?? 0)}%</p>
                  <p className="opacity-80 text-xs">usado</p>
                </div>
              </div>
              {totals && totals.budgeted > 0 && (
                <div className="mt-4 h-2 w-full rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${Math.min(100, totals.percent)}%` }}
                  />
                </div>
              )}
            </div>
            {totals && totals.percent >= 100 && (
              <div className="flex items-center gap-3 border-t border-red-200 bg-red-50 px-6 py-3 text-sm text-red-800 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>Excediste el presupuesto total del mes en {formatCurrency(totals.spent - totals.budgeted, currency)}.</p>
              </div>
            )}
          </Card>

          {/* Con presupuesto */}
          {withBudget.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Con presupuesto definido ({withBudget.length})
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {withBudget.map((item) => (
                  <BudgetCard
                    key={item.category.id}
                    item={item}
                    currency={currency}
                    onClick={() => setEditing(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sin presupuesto */}
          {withoutBudget.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Sin presupuesto ({withoutBudget.length})
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {withoutBudget.map((item) => (
                  <BudgetCard
                    key={item.category.id}
                    item={item}
                    currency={currency}
                    onClick={() => setEditing(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <BudgetFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        item={editing}
        year={year}
        month={month}
        currency={currency}
        onSubmit={upsert}
        onRemove={remove}
      />
    </div>
  );
}

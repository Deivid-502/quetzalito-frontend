'use client';

import { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { CategoryIcon, InlineIcon } from '@/lib/icons';
import { cn, formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/types/transaction';

interface Props {
  tx: Transaction | (Omit<Transaction, 'envelope'> & { envelope?: Transaction['envelope'] });
  currency: string;
  showEnvelope?: boolean;
  onDelete?: () => void;
}

export function TransactionRow({ tx, currency, showEnvelope = true, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const isIncome = tx.type === 'income' || tx.type === 'transfer_in';
  const isTransfer = tx.type === 'transfer_in' || tx.type === 'transfer_out';
  const sign = isIncome ? '+' : '−';

  const time = new Date(tx.occurredAt).toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const iconBg = tx.category?.color ?? (isTransfer ? '#6B7280' : isIncome ? '#10B981' : '#EF4444');

  return (
    <div className="group flex items-center gap-3 py-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${iconBg}1A`, color: iconBg }}
      >
        {isTransfer ? (
          <ArrowLeftRight className="h-4 w-4" />
        ) : tx.category ? (
          <CategoryIcon name={tx.category.icon} className="h-5 w-5" />
        ) : isIncome ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">
          {tx.description ?? tx.category?.name ?? defaultLabel(tx.type)}
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          {tx.category && <span>{tx.category.name}</span>}
          {showEnvelope && tx.category && <span>·</span>}
          {showEnvelope && tx.envelope && (
            <span className="truncate">
              <InlineIcon icon={tx.envelope.icon} /> {tx.envelope.name}
            </span>
          )}
          {showEnvelope && tx.envelope && <span>·</span>}
          <span>{time}</span>
        </div>
      </div>

      <p
        className={cn(
          'text-sm font-semibold shrink-0',
          isIncome ? 'text-brand-600' : 'text-danger',
        )}
      >
        {sign}
        {formatCurrency(tx.amount, currency)}
      </p>

      {onDelete && (
        <div ref={ref} className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted opacity-0 hover:bg-ink-100 group-hover:opacity-100 dark:hover:bg-ink-700/40"
            aria-label="Opciones"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div
              className={cn(
                'absolute right-0 top-8 z-10 w-40 rounded-xl border surface shadow-card',
                'border-ink-200 dark:border-ink-700',
              )}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" /> Eliminar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function defaultLabel(type: Transaction['type']): string {
  switch (type) {
    case 'income': return 'Ingreso';
    case 'expense': return 'Gasto';
    case 'transfer_in': return 'Transferencia recibida';
    case 'transfer_out': return 'Transferencia enviada';
  }
}

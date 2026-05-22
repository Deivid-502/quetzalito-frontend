'use client';

import Link from 'next/link';
import { Pencil, Archive, Trash2, MoreVertical, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { CategoryIcon } from '@/lib/icons';
import { cn, formatCurrency } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import type { Envelope } from '@/types/envelope';

interface Props {
  envelope: Envelope;
  currency: string;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  href?: string;
}

export function EnvelopeCard({ envelope, currency, onEdit, onArchive, onDelete, href }: Props) {
  const t = useT();
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

  const progress =
    envelope.targetAmount && envelope.targetAmount > 0
      ? Math.min(100, (envelope.currentBalance / envelope.targetAmount) * 100)
      : null;

  const Wrapper: React.ElementType = href ? Link : 'div';
  const wrapperProps = href ? { href } : {};

  return (
    <div className="relative">
      <Wrapper
        {...wrapperProps}
        className={cn(
          'block rounded-2xl border surface p-4 transition-all',
          href && 'hover:shadow-card hover:-translate-y-0.5',
          'border-ink-200 dark:border-ink-700',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
              style={{ background: `${envelope.color}1A`, color: envelope.color }}
            >
              <CategoryIcon name={envelope.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold truncate flex items-center gap-1.5">
                {envelope.name}
                {envelope.isMain && (
                  <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" aria-label={t('envelopes.mainAccount')} />
                )}
              </p>
              {envelope.description && (
                <p className="text-xs text-muted truncate">{envelope.description}</p>
              )}
            </div>
          </div>

          {(onEdit || onArchive || onDelete) && !envelope.isMain && (
            <div ref={ref} className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-ink-100 dark:hover:bg-ink-700/40"
                aria-label={t('common.options')}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div
                  className={cn(
                    'absolute right-0 top-9 w-44 rounded-xl border surface shadow-card z-10',
                    'border-ink-200 dark:border-ink-700',
                  )}
                  onClick={(e) => e.preventDefault()}
                >
                  {onEdit && (
                    <MenuBtn icon={<Pencil className="h-4 w-4" />} onClick={() => { setMenuOpen(false); onEdit(); }}>
                      {t('common.edit')}
                    </MenuBtn>
                  )}
                  {onArchive && (
                    <MenuBtn icon={<Archive className="h-4 w-4" />} onClick={() => { setMenuOpen(false); onArchive(); }}>
                      {t('envelopes.archive')}
                    </MenuBtn>
                  )}
                  {onDelete && (
                    <MenuBtn
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => { setMenuOpen(false); onDelete(); }}
                      danger
                    >
                      {t('envelopes.delete')}
                    </MenuBtn>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-3 text-2xl font-bold">{formatCurrency(envelope.currentBalance, currency)}</p>

        {progress !== null && envelope.targetAmount && (
          <>
            <div className="mt-3 h-1.5 w-full rounded-full bg-ink-100 dark:bg-ink-700">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: envelope.color }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted">
              {t('dashboard.goal')}: {formatCurrency(envelope.targetAmount, currency)} ·{' '}
              {Math.round(progress)}%
            </p>
          </>
        )}
      </Wrapper>
    </div>
  );
}

function MenuBtn({
  icon,
  onClick,
  children,
  danger,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-ink-50 dark:hover:bg-ink-700/40',
        danger && 'text-danger',
      )}
    >
      {icon}
      {children}
    </button>
  );
}

'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightSlot, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex h-11 items-center gap-2 rounded-xl border px-3 surface',
            'focus-within:ring-2 focus-within:ring-brand-300',
            error
              ? 'border-danger focus-within:ring-red-200'
              : 'border-ink-200 dark:border-ink-700',
          )}
        >
          {leftIcon && <span className="text-ink-400">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400',
              className,
            )}
            {...props}
          />
          {rightSlot}
        </div>
        {(error || hint) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-danger' : 'text-muted')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

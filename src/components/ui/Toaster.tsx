'use client';

import { create } from 'zustand';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  show: (type: ToastType, message: string) => void;
  dismiss: (id: string) => void;
}

const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: (type, message) => {
    const id = Math.random().toString(36).slice(2);
    set({ toasts: [...get().toasts, { id, type, message }] });
    setTimeout(() => get().dismiss(id), 4000);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = {
  success: (m: string) => useToastStore.getState().show('success', m),
  error:   (m: string) => useToastStore.getState().show('error', m),
  info:    (m: string) => useToastStore.getState().show('info', m),
  warning: (m: string) => useToastStore.getState().show('warning', m),
};

const styles: Record<ToastType, { wrap: string; icon: React.ReactNode }> = {
  success: { wrap: 'border-brand-200 bg-brand-50 text-brand-800 dark:bg-brand-500/10 dark:text-brand-200', icon: <CheckCircle2 className="h-5 w-5" /> },
  error:   { wrap: 'border-red-200 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200', icon: <XCircle className="h-5 w-5" /> },
  info:    { wrap: 'border-ink-200 bg-ink-50 text-ink-800 dark:bg-ink-800 dark:text-ink-100', icon: <Info className="h-5 w-5" /> },
  warning: { wrap: 'border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200', icon: <AlertTriangle className="h-5 w-5" /> },
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-card min-w-[280px] max-w-md',
            styles[t.type].wrap,
          )}
          role="status"
        >
          <span className="mt-0.5 shrink-0">{styles[t.type].icon}</span>
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button onClick={() => dismiss(t.id)} aria-label="Cerrar" className="opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

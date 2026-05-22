'use client';

import {
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  useImperativeHandle,
  useCallback,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Listbox custom que reemplaza al `<select>` nativo.
 *
 * MOTIVACIÓN: el `<select>` nativo abre un dropdown del SO que NO se puede estilizar
 * (esquinas redondeadas, hover, padding, sombras). Para tener un dropdown que respete
 * la estética del producto en dark mode hay que implementar uno custom.
 *
 * Implementación:
 *  · Trigger: `<button>` accesible (role="combobox") con flecha.
 *  · Panel: `<ul role="listbox">` con `<li role="option">`. Esquinas redondeadas, sombra,
 *    hover/active estilizables, igual en light y dark.
 *  · Keyboard: Enter/Space abre, ↑/↓ navega, Esc cierra, Tab cierra. Letras hacen typeahead.
 *  · A11y: `aria-expanded`, `aria-activedescendant`, `aria-selected`.
 *  · Click afuera cierra (mousedown en `document`).
 */

export interface SelectOption<T = string> {
  value: T;
  label: string;
  /** Contenido custom a la izquierda (ícono, color dot, etc) */
  leading?: ReactNode;
  /** Contenido custom a la derecha (saldo, badge, etc) */
  trailing?: ReactNode;
  /** Si true, no se puede seleccionar */
  disabled?: boolean;
}

interface BaseSelectProps<T> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Wrapper de tamaño visual */
  uiSize?: 'sm' | 'md';
  /** Si true, no envuelve en chrome propio (border/focus). Útil cuando ya hay un contenedor afuera. */
  bare?: boolean;
  /** Para forms HTML: name + id si se quiere asociar a labels */
  name?: string;
  id?: string;
  /** Marca el field como obligatorio para que el form padre pueda validar */
  required?: boolean;
  /** Render custom del trigger (ej: solo el label sin chrome). Si está, se ignora `bare`. */
  renderTrigger?: (selected: SelectOption<T> | null, open: boolean) => ReactNode;
  ariaLabel?: string;
}

export interface SelectHandle {
  focus: () => void;
  open: () => void;
  close: () => void;
}

function SelectInner<T>(
  {
    options,
    value,
    onChange,
    placeholder = '— —',
    disabled,
    className,
    uiSize = 'md',
    bare = false,
    name,
    id,
    required,
    renderTrigger,
    ariaLabel,
  }: BaseSelectProps<T>,
  ref: React.Ref<SelectHandle>,
) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const typeBufferRef = useRef({ buffer: '', timer: 0 });

  const selected = options.find((o) => o.value === value) ?? null;
  const selectedIdx = selected ? options.indexOf(selected) : -1;

  useImperativeHandle(ref, () => ({
    focus: () => triggerRef.current?.focus(),
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  const closeAndFocus = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Click afuera cierra
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Cuando abre, posicionamos el activeIdx en el seleccionado y scroleamos a él
  useEffect(() => {
    if (!open) return;
    const start = selectedIdx >= 0 ? selectedIdx : 0;
    setActiveIdx(start);
    requestAnimationFrame(() => {
      const item = listRef.current?.querySelector<HTMLLIElement>(`[data-idx="${start}"]`);
      item?.scrollIntoView({ block: 'nearest' });
    });
  }, [open, selectedIdx]);

  function moveActive(delta: number) {
    if (options.length === 0) return;
    let i = activeIdx;
    for (let step = 0; step < options.length; step++) {
      i = (i + delta + options.length) % options.length;
      if (!options[i].disabled) break;
    }
    setActiveIdx(i);
    requestAnimationFrame(() => {
      const item = listRef.current?.querySelector<HTMLLIElement>(`[data-idx="${i}"]`);
      item?.scrollIntoView({ block: 'nearest' });
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIdx(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIdx(options.length - 1);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const opt = options[activeIdx];
        if (opt && !opt.disabled) {
          onChange(opt.value);
          closeAndFocus();
        }
        break;
      }
      case 'Escape':
      case 'Tab':
        e.preventDefault();
        closeAndFocus();
        break;
      default:
        // Typeahead: tipear letras filtra por prefijo
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const buf = typeBufferRef.current;
          buf.buffer += e.key.toLowerCase();
          window.clearTimeout(buf.timer);
          buf.timer = window.setTimeout(() => (buf.buffer = ''), 600);
          const idx = options.findIndex(
            (o) => !o.disabled && o.label.toLowerCase().startsWith(buf.buffer),
          );
          if (idx >= 0) setActiveIdx(idx);
        }
    }
  }

  // Aspectos visuales del trigger según uiSize
  const triggerHeight = uiSize === 'sm' ? 'h-9' : 'h-11';
  const triggerPadding = uiSize === 'sm' ? 'px-2.5' : 'px-3';

  const triggerContent = renderTrigger ? (
    renderTrigger(selected, open)
  ) : (
    <>
      <span className="flex flex-1 items-center gap-2 truncate text-sm font-medium">
        {selected?.leading}
        <span className={cn('truncate', !selected && 'text-ink-400')}>
          {selected?.label ?? placeholder}
        </span>
      </span>
      {selected?.trailing && <span className="ml-2 text-xs text-muted">{selected.trailing}</span>}
      <ChevronDown
        className={cn(
          'ml-1 h-4 w-4 text-ink-400 transition-transform',
          open && 'rotate-180',
        )}
      />
    </>
  );

  return (
    <div ref={wrapperRef} className={cn('relative', className)} onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        name={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-required={required || undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center text-left transition-colors',
          bare
            ? 'gap-2 bg-transparent'
            : cn(
                'gap-2 rounded-xl border surface',
                triggerHeight,
                triggerPadding,
                'border-ink-200 dark:border-ink-700',
                'hover:border-ink-300 dark:hover:border-ink-600',
                'focus:outline-none focus:ring-2 focus:ring-brand-300',
              ),
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        {triggerContent}
      </button>

      {/* Panel */}
      {open && (
        <ul
          ref={listRef}
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          aria-activedescendant={
            activeIdx >= 0 && id ? `${id}-opt-${activeIdx}` : undefined
          }
          tabIndex={-1}
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 max-h-64 overflow-auto',
            'rounded-2xl border surface shadow-lg',
            'border-ink-200 dark:border-ink-700',
            'py-1',
          )}
        >
          {options.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted">— —</li>
          )}
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIdx;
            return (
              <li
                key={String(opt.value)}
                id={id ? `${id}-opt-${i}` : undefined}
                role="option"
                aria-selected={isSelected}
                data-idx={i}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => {
                  if (opt.disabled) return;
                  onChange(opt.value);
                  closeAndFocus();
                }}
                className={cn(
                  'mx-1 flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors',
                  isActive && !opt.disabled && 'bg-ink-100 dark:bg-ink-800',
                  isSelected && 'font-semibold text-brand-700 dark:text-brand-300',
                  opt.disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                {opt.leading && <span className="shrink-0">{opt.leading}</span>}
                <span className="flex-1 truncate">{opt.label}</span>
                {opt.trailing && (
                  <span className="ml-2 text-xs text-muted">{opt.trailing}</span>
                )}
                {isSelected && <Check className="h-4 w-4 text-brand-500" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// forwardRef preservando genérico T
export const Select = forwardRef(SelectInner) as <T>(
  props: BaseSelectProps<T> & { ref?: React.Ref<SelectHandle> },
) => ReturnType<typeof SelectInner>;

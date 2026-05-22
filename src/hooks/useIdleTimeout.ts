'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const EVENTS = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'] as const;

interface UseIdleTimeoutOptions {
  /** Minutos de inactividad para cerrar sesión (default: 30) */
  timeoutMinutes?: number;
  /** Minutos de inactividad para mostrar advertencia (default: 25) */
  warnMinutes?: number;
  onIdle: () => void;
  onWarn?: () => void;
  onResume?: () => void;
  /** Si false, el hook no hace nada (útil en páginas públicas) */
  enabled?: boolean;
}

export interface IdleTimeoutState {
  /** Segundos restantes hasta el cierre cuando la advertencia está activa */
  secondsLeft: number;
  isWarning: boolean;
  reset: () => void;
}

export function useIdleTimeout({
  timeoutMinutes = 30,
  warnMinutes = 25,
  onIdle,
  onWarn,
  onResume,
  enabled = true,
}: UseIdleTimeoutOptions): IdleTimeoutState {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warnMs = warnMinutes * 60 * 1000;
  const gapMs = timeoutMs - warnMs; // Tiempo entre advertencia y cierre

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isWarning, setIsWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Math.round(gapMs / 1000));

  const clearTimers = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
  }, []);

  const startCountdown = useCallback(() => {
    let secs = Math.round(gapMs / 1000);
    setSecondsLeft(secs);

    countdownTimer.current = setInterval(() => {
      secs -= 1;
      setSecondsLeft(secs);
      if (secs <= 0) {
        if (countdownTimer.current) clearInterval(countdownTimer.current);
      }
    }, 1000);
  }, [gapMs]);

  const reset = useCallback(() => {
    if (!enabled) return;
    clearTimers();
    setIsWarning(false);
    setSecondsLeft(Math.round(gapMs / 1000));
    onResume?.();

    // Armar advertencia
    warnTimer.current = setTimeout(() => {
      setIsWarning(true);
      onWarn?.();
      startCountdown();

      // Armar cierre definitivo
      idleTimer.current = setTimeout(() => {
        clearTimers();
        setIsWarning(false);
        onIdle();
      }, gapMs);
    }, warnMs);
  }, [enabled, clearTimers, gapMs, warnMs, onResume, onWarn, onIdle, startCountdown]);

  // Escuchar actividad del usuario
  useEffect(() => {
    if (!enabled) return;

    reset();

    const handleActivity = () => {
      if (!isWarning) reset();
    };

    EVENTS.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));

    return () => {
      clearTimers();
      EVENTS.forEach((e) => window.removeEventListener(e, handleActivity));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { secondsLeft, isWarning, reset };
}

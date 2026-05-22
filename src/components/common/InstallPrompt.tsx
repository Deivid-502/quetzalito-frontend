'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useT } from '@/lib/i18n';

/**
 * Tipo del evento beforeinstallprompt (no estandarizado en TS Lib).
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

/**
 * Botón "Instalar" que sólo aparece cuando el navegador
 * dispara el evento beforeinstallprompt (Chrome/Edge en mobile y desktop).
 * En Safari/iOS la instalación es manual desde "Compartir → Añadir a pantalla".
 */
export function InstallPrompt() {
  const t = useT();
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault(); // bloqueamos el prompt nativo para mostrarlo a demanda
      setEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', handler);

    function onInstalled() {
      setInstalled(true);
      setEvent(null);
    }
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || !event) return null;

  async function handleInstall() {
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setEvent(null);
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleInstall} title={t('offline.installApp')}>
      <Download className="h-4 w-4" /> {t('offline.install')}
    </Button>
  );
}

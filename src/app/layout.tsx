import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/Toaster';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthBootstrap } from '@/components/common/AuthBootstrap';
import { SwRegister } from '@/components/common/SwRegister';
import { I18nBootstrap } from '@/components/common/I18nBootstrap';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Quetzalito · Tu dinero bajo control',
  description:
    'Plataforma de finanzas personales para jóvenes guatemaltecos. Lleva tus gastos, presupuestos y alcancías de forma simple.',
  manifest: '/manifest.json',
  icons: { icon: '/logo.webp' },
};

export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-GT" className={inter.variable}>
      <body>
        {/* Registra el service worker (solo en producción) */}
        <SwRegister />
        {/* Detecta sesión en cualquier ruta (pública o privada) */}
        <AuthBootstrap>
          {/* Sincroniza <html lang> y traduce mensajes nativos de validación al idioma del usuario */}
          <I18nBootstrap />
          {/* Aplica tema en cualquier ruta — usa user.theme si está logueado, localStorage si no */}
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthBootstrap>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

const CONTENT = {
  es: {
    title: 'Política de Cookies',
    updated: 'Última actualización: 18 de mayo de 2026',
    what: { heading: '¿Qué son las Cookies?', body: 'Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador o dispositivo del Usuario. Permiten recordar configuraciones básicas, mantener sesiones activas de forma segura e identificar patrones de navegación generales para corregir errores técnicos de la página.' },
    how: { heading: '¿Cómo utilizamos las Cookies en Quetzalito?', intro: 'En Quetzalito utilizamos las Cookies para:' },
    types: [
      { label: 'Obligatoria', border: 'border-blue-500', heading: '1. Cookies Técnicas Necesarias', body: 'Son indispensables para el correcto funcionamiento del sitio. Permiten mantener abierta la sesión del Usuario mientras navega entre los diferentes módulos (ej. pasar del registro de gastos a la pestaña de presupuestos) sin necesidad de reintroducir las credenciales. Estas cookies no recopilan información comercial y no pueden ser desactivadas.' },
      { label: 'Obligatoria', border: 'border-green-500', heading: '2. Cookies de Preferencia y Funcionalidad', body: 'Almacenan elecciones estéticas del Usuario, tales como la selección del idioma, la activación del "Modo Oscuro" de la interfaz o la preferencia de ocultar los saldos numéricos por motivos de privacidad física.' },
      { label: 'Opcional', border: 'border-amber-500', heading: '3. Cookies Analíticas y de Rendimiento', body: 'Implementadas a través de terceros autorizados (como Google Analytics). Nos permiten contabilizar de manera estadística y anónima el volumen de visitas, identificar qué herramientas financieras son las más utilizadas y medir los tiempos de carga del servidor para mejorar la velocidad web.' },
    ],
    control: {
      heading: '¿Cómo puedo controlar las Cookies de mi navegador?',
      body1: 'Suponemos tu consentimiento para el uso de cookies cuando visitas el sitio web de Quetzalito. Sin embargo, puedes modificar la configuración de tu navegador para evitar la aceptación automática de cookies, o eliminar las cookies que ya han sido almacenadas.',
      note: 'Nota: Las cookies técnicas necesarias no pueden desactivarse sin perder funcionalidad crítica.',
      browsers: 'Si deseas restringir o bloquear las cookies del navegador web en tu dispositivo, puedes hacerlo en la configuración del navegador:',
    },
    changes: { heading: 'Cambios a esta Política', body: 'Quetzalito se reserva el derecho de actualizar esta Política de Cookies en cualquier momento. Cualquier cambio será notificado en esta página con la fecha de actualización correspondiente.' },
    footer: 'Para consultas sobre cookies u otros detalles de privacidad, visitá nuestra',
    footerPrivacy: 'Política de Privacidad',
    footerOr: 'o',
    footerContact: 'contacto',
  },
  en: {
    title: 'Cookie Policy',
    updated: 'Last updated: May 18, 2026',
    what: { heading: 'What are Cookies?', body: 'Cookies are small text files that websites store on the User\'s browser or device. They allow basic settings to be remembered, active sessions to be maintained securely, and general browsing patterns to be identified to correct technical page errors.' },
    how: { heading: 'How do we use Cookies at Quetzalito?', intro: 'At Quetzalito we use Cookies for:' },
    types: [
      { label: 'Required', border: 'border-blue-500', heading: '1. Strictly Necessary Cookies', body: 'They are essential for the correct operation of the site. They allow the User\'s session to remain open while navigating between different modules (e.g. going from expense recording to the budgets tab) without having to re-enter credentials. These cookies do not collect commercial information and cannot be disabled.' },
      { label: 'Required', border: 'border-green-500', heading: '2. Preference and Functionality Cookies', body: 'They store the User\'s aesthetic choices, such as language selection, activation of the "Dark Mode" interface, or the preference to hide numeric balances for physical privacy reasons.' },
      { label: 'Optional', border: 'border-amber-500', heading: '3. Analytical and Performance Cookies', body: 'Implemented through authorized third parties (such as Google Analytics). They allow us to statistically and anonymously count the volume of visits, identify which financial tools are most used, and measure server load times to improve web speed.' },
    ],
    control: {
      heading: 'How can I control my browser\'s Cookies?',
      body1: 'We assume your consent to the use of cookies when you visit the Quetzalito website. However, you can modify your browser settings to avoid automatically accepting cookies, or delete cookies that have already been stored.',
      note: 'Note: Strictly necessary cookies cannot be disabled without losing critical functionality.',
      browsers: 'If you wish to restrict or block cookies on your device, you can do so in your browser settings:',
    },
    changes: { heading: 'Changes to This Policy', body: 'Quetzalito reserves the right to update this Cookie Policy at any time. Any changes will be notified on this page with the corresponding update date.' },
    footer: 'For questions about cookies or other privacy details, please see our',
    footerPrivacy: 'Privacy Policy',
    footerOr: 'or our',
    footerContact: 'contact page',
  },
} as const;

const BROWSERS = [
  { name: 'Chrome', path: 'Settings → Privacy and security → Cookies and other site data' },
  { name: 'Firefox', path: 'Preferences → Privacy & Security → Cookies and Site Data' },
  { name: 'Safari', path: 'Preferences → Privacy → Manage Website Data' },
  { name: 'Edge', path: 'Settings → Privacy, search, and services → Clear browsing data → Cookies' },
];

export default function CookiesPage() {
  const { language } = useLanguage();
  const c = CONTENT[language] ?? CONTENT.es;

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-sm text-muted mt-1">{c.updated}</p>
      </div>

      <section><h2 className="text-xl font-semibold mb-2">{c.what.heading}</h2><p className="text-ink-700 dark:text-ink-300">{c.what.body}</p></section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.how.heading}</h2>
        <p className="mb-3 text-ink-700 dark:text-ink-300">{c.how.intro}</p>
        <div className="space-y-4">
          {c.types.map((type, i) => (
            <div key={i} className={`border-l-4 ${type.border} pl-4`}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{type.heading}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${type.border === 'border-amber-500' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'}`}>
                  {type.label}
                </span>
              </div>
              <p className="text-ink-700 dark:text-ink-300">{type.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.control.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300 mb-2">{c.control.body1}</p>
        <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-3">{c.control.note}</p>
        <p className="text-ink-700 dark:text-ink-300 mb-2">{c.control.browsers}</p>
        <ul className="list-disc list-inside space-y-1 ml-4 text-ink-700 dark:text-ink-300">
          {BROWSERS.map((b) => (<li key={b.name}><strong>{b.name}:</strong> {b.path}</li>))}
        </ul>
      </section>

      <section><h2 className="text-xl font-semibold mb-2">{c.changes.heading}</h2><p className="text-ink-700 dark:text-ink-300">{c.changes.body}</p></section>

      <div className="pt-4 border-t text-sm text-muted">
        {c.footer}{' '}
        <Link href="/legal/privacidad" className="font-semibold text-brand-600 hover:underline">{c.footerPrivacy}</Link>{' '}
        {c.footerOr}{' '}
        <Link href="/legal/contacto" className="font-semibold text-brand-600 hover:underline">{c.footerContact}</Link>.
      </div>
    </article>
  );
}

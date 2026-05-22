'use client';

import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const CONTENT = {
  es: {
    title: 'Contacto',
    subtitle: 'Estamos para escucharte y resolver tus consultas.',
    corp: {
      heading: 'Información Corporativa',
      intro: 'Para los efectos legales oportunos, declaramos la siguiente identidad corporativa:',
      name: 'Razón Social', nameVal: 'Quetzalito, S.A.',
      nit: 'Identificación Tributaria (NIT)', nitVal: '12345678-9',
      address: 'Dirección de Oficinas Administrativas',
      addressVal: '4ta Avenida, Zona 10, Edificio Financiero, Nivel 5, Ciudad de Guatemala, Guatemala',
    },
    channels: {
      heading: 'Canales de Contacto',
      legal: 'Asuntos Legales y Escalaciones',
      privacy: 'Privacidad y Protección de Datos',
      support: 'Soporte Técnico (Chat en Plataforma)',
      supportDesc: 'Disponible en la esquina inferior derecha de la plataforma web oficial de Quetzalito.',
    },
    claim: {
      heading: 'Mecanismo Obligatorio de Reclamación',
      alertTitle: '📋 Proceso Formal de Reclamos',
      alertBody: 'Cualquier controversia, solicitud de aclaración de cobro o ejercicio de derechos de datos personales deberá canalizarse obligatoriamente a través del Chat de Soporte Técnico ubicado en la esquina inferior de la pantalla principal de la Plataforma.',
      formIntro: 'El Usuario deberá adjuntar el siguiente formulario obligatorio para iniciar el caso:',
      items: [
        'Nombre completo del titular de la cuenta.',
        'Dirección de correo electrónico universitario asociada al perfil.',
        'Número de referencia de la transacción o comprobante de pago emitido por BAC/PayPal donde figure monto, fecha y hora exacta.',
        'Breve exposición de motivos que fundamente la consulta o reclamación legal.',
      ],
    },
    response: { heading: 'Tiempo de Respuesta', body: 'Nos comprometemos a revisar y responder toda solicitud en un plazo máximo de 24 horas hábiles. Para reclamaciones relacionadas con reembolsos o cobros, consultá nuestra', link: 'Política de Devoluciones y Reembolsos.' },
    related: 'Políticas Relacionadas',
    links: [
      { href: '/legal/privacidad', label: 'Política de Privacidad' },
      { href: '/legal/terminos', label: 'Términos y Condiciones' },
      { href: '/legal/cookies', label: 'Política de Cookies' },
      { href: '/legal/reembolso', label: 'Política de Devoluciones y Reembolsos' },
    ],
  },
  en: {
    title: 'Contact',
    subtitle: 'We are here to listen and resolve your queries.',
    corp: {
      heading: 'Corporate Information',
      intro: 'For applicable legal purposes, we declare the following corporate identity:',
      name: 'Company Name', nameVal: 'Quetzalito, S.A.',
      nit: 'Tax ID (NIT)', nitVal: '12345678-9',
      address: 'Administrative Offices Address',
      addressVal: '4th Avenue, Zone 10, Financial Building, Level 5, Guatemala City, Guatemala',
    },
    channels: {
      heading: 'Contact Channels',
      legal: 'Legal Affairs and Escalations',
      privacy: 'Privacy and Data Protection',
      support: 'Technical Support (Platform Chat)',
      supportDesc: 'Available at the bottom right corner of the official Quetzalito web platform.',
    },
    claim: {
      heading: 'Mandatory Claims Mechanism',
      alertTitle: '📋 Formal Claims Process',
      alertBody: 'Any dispute, billing clarification request, or exercise of personal data rights must be channeled exclusively through the Technical Support Chat located at the bottom of the Platform\'s main screen.',
      formIntro: 'The User must attach the following mandatory form to initiate the case:',
      items: [
        'Full name of the account holder.',
        'University email address associated with the profile.',
        'Transaction reference number or payment receipt issued by BAC/PayPal showing amount, date and exact time.',
        'Brief statement of grounds supporting the query or legal claim.',
      ],
    },
    response: { heading: 'Response Time', body: 'We commit to reviewing and responding to all requests within a maximum of 24 business hours. For refund or billing claims, see our', link: 'Return and Refund Policy.' },
    related: 'Related Policies',
    links: [
      { href: '/legal/privacidad', label: 'Privacy Policy' },
      { href: '/legal/terminos', label: 'Terms and Conditions' },
      { href: '/legal/cookies', label: 'Cookie Policy' },
      { href: '/legal/reembolso', label: 'Return and Refund Policy' },
    ],
  },
} as const;

export default function ContactoPage() {
  const { language } = useLanguage();
  const c = CONTENT[language] ?? CONTENT.es;

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-muted mt-1">{c.subtitle}</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">{c.corp.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300 mb-4">{c.corp.intro}</p>
        <div className="space-y-3">
          {[
            { label: c.corp.name, value: c.corp.nameVal },
            { label: c.corp.nit, value: c.corp.nitVal, mono: true },
          ].map((row) => (
            <div key={row.label} className="border-l-4 border-brand-500 pl-4 py-1">
              <p className="font-semibold text-sm">{row.label}</p>
              <p className={`text-ink-700 dark:text-ink-300 ${row.mono ? 'font-mono text-sm' : ''}`}>{row.value}</p>
            </div>
          ))}
          <div className="border-l-4 border-brand-500 pl-4 py-1">
            <p className="font-semibold text-sm flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {c.corp.address}</p>
            <p className="text-ink-700 dark:text-ink-300">{c.corp.addressVal}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">{c.channels.heading}</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 rounded-xl border border-ink-200 dark:border-ink-700">
            <Mail className="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">{c.channels.legal}</p>
              <a href="mailto:legal@quetzalito.com" className="text-brand-600 dark:text-brand-400 hover:underline font-mono text-sm">legal@quetzalito.com</a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl border border-ink-200 dark:border-ink-700">
            <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">{c.channels.privacy}</p>
              <a href="mailto:privacidad@quetzalito.com.gt" className="text-brand-600 dark:text-brand-400 hover:underline font-mono text-sm">privacidad@quetzalito.com.gt</a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl border border-ink-200 dark:border-ink-700">
            <MessageCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">{c.channels.support}</p>
              <p className="text-muted text-sm">{c.channels.supportDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">{c.claim.heading}</h2>
        <div className="border-l-4 border-blue-500 bg-blue-50 pl-4 p-4 dark:bg-blue-900/20 rounded-r-xl mb-4">
          <p className="font-semibold mb-1">{c.claim.alertTitle}</p>
          <p className="text-sm text-ink-700 dark:text-ink-300">{c.claim.alertBody}</p>
        </div>
        <p className="mb-3 text-ink-700 dark:text-ink-300">{c.claim.formIntro}</p>
        <ol className="list-decimal list-inside space-y-2 ml-4 text-ink-700 dark:text-ink-300">
          {c.claim.items.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.response.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300">{c.response.body}{' '}
          <Link href="/legal/reembolso" className="font-semibold text-brand-600 hover:underline">{c.response.link}</Link>
        </p>
      </section>

      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-3">{c.related}</h3>
        <ul className="space-y-2">
          {c.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="font-semibold text-brand-600 hover:underline">→ {l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

const CONTENT = {
  es: {
    title: 'Política de Devoluciones y Reembolsos',
    updated: 'Última actualización: 18 de mayo de 2026',
    law: 'Esta sección se rige de manera íntegra y se complementa con la Ley de Protección al Consumidor y Usuario de la República de Guatemala.',
    scope: { heading: 'Ámbito y Características del Servicio Premium', body1: 'La suscripción Premium de Quetzalito comprende la eliminación de anuncios publicitarios y el desbloqueo de funciones de presupuesto avanzadas.', body2: 'El servicio otorga un período de prueba gratuita de tres (3) días calendario previos al primer cobro de la mensualidad. Una vez transcurrido dicho plazo, la suscripción se renovará automáticamente con un cobro mensual fijo recurrente.' },
    criteria: {
      heading: 'Criterios Exclusivos de Procedencia (Reembolso Total)',
      intro: 'Se contemplará únicamente la emisión de reembolsos totales cuando el Usuario compruebe fehacientemente y dentro del plazo establecido alguna de las siguientes causales:',
      items: [
        { title: '1. Cobro Duplicado', body: 'Cuando se verifiquen dos o más cobros idénticos en el mismo ciclo de facturación por la misma cuenta de suscripción.' },
        { title: '2. Cobro No Reconocido', body: 'Cuando una auditoría interna determine de manera razonable que el cargo fue realizado sin una autorización válida del titular de la cuenta.' },
        { title: '3. Error Técnico Atribuible a la Plataforma', body: 'Fallas críticas del servidor o del sistema operativo interno de Quetzalito que bloqueen de forma permanente el acceso a las funcionalidades Premium tras haberse efectuado el pago.' },
        { title: '4. Activación por Error', body: 'Errores accidentales de contratación, siempre que se reporten de inmediato y no se registre un uso relevante ni abusivo de los beneficios premium posteriores al cargo.' },
        { title: '5. Incompatibilidad Técnica', body: 'Errores críticos de visualización o compatibilidad demostrables no imputables al dispositivo del Usuario.' },
      ],
    },
    exclusions: {
      heading: 'Exclusiones de Reembolso',
      intro: 'No procederá reembolso ni compensación económica proporcional en los siguientes casos:',
      items: [
        'Olvido de la cancelación de la prueba gratuita o de la renovación automática mensual.',
        'Falta de uso de la Plataforma durante el periodo facturado.',
        'Cambio de opinión del Usuario una vez finalizado el periodo de prueba de 3 días.',
        'Solicitudes enviadas fuera del plazo de garantía legal.',
        'Fallas técnicas causadas por mal uso, modificaciones incorrectas o configuraciones inadecuadas realizadas por el propio Usuario.',
      ],
    },
    deadline: { heading: 'Plazo Improrrogable y Canal de Gestión', body: 'Toda reclamación deberá ser enviada en un plazo máximo e improrrogable de siete (7) días calendario contados a partir de la fecha de la transacción de cobro. Las solicitudes extemporáneas serán rechazadas de manera automática sin mayor trámite.', alert: '📞 Canal Único de Atención', alertBody: 'El único canal legal de recepción es el chat de atención al cliente integrado en la plataforma web oficial de Quetzalito. No se atienden disputas financieras por correo electrónico general ni redes sociales.' },
    times: {
      heading: 'Tiempos de Respuesta y Liquidación Bancaria',
      items: [
        { emoji: '⏱️', title: 'Dictamen Técnico', body: 'El equipo de soporte evaluará y notificará la resolución en un plazo máximo de veinticuatro (24) horas tras haber recibido toda la documentación.' },
        { emoji: '⏱️', title: 'Gestión Interna', body: 'Tras su aprobación, Quetzalito procesará la reversión en un plazo de tres (3) a siete (7) días hábiles.' },
        { emoji: '⏱️', title: 'Acreditación Bancaria', body: 'El tiempo final dependerá exclusivamente del método de pago y de las políticas de la entidad emisora.' },
      ],
      bac: 'Tarjetas de crédito/débito (BAC): puede demorar varios días hábiles.',
      paypal: 'PayPal: podría tomar hasta uno o dos ciclos de facturación dependiendo del banco.',
    },
    footer: 'Para reportar un problema con tu suscripción Premium o solicitar un reembolso, utilizá el chat de soporte en la plataforma o contactá a',
    footerLink: 'nuestro equipo',
  },
  en: {
    title: 'Return and Refund Policy',
    updated: 'Last updated: May 18, 2026',
    law: 'This section is fully governed by and complements the Consumer and User Protection Law of the Republic of Guatemala.',
    scope: { heading: 'Scope and Characteristics of the Premium Service', body1: 'The Quetzalito Premium subscription includes the removal of advertisements and the unlocking of advanced budgeting features.', body2: 'The service grants a free trial period of three (3) calendar days prior to the first monthly charge. Once this period has elapsed, the subscription will automatically renew with a fixed recurring monthly charge.' },
    criteria: {
      heading: 'Exclusive Qualifying Criteria (Full Refund)',
      intro: 'A full refund will be considered only when the User verifiably demonstrates within the established timeframe one of the following grounds:',
      items: [
        { title: '1. Duplicate Charge', body: 'When two or more identical charges are verified in the same billing cycle for the same subscription account.' },
        { title: '2. Unrecognized Charge', body: 'When an internal audit reasonably determines that the charge was made without a valid authorization from the account holder.' },
        { title: '3. Technical Error Attributable to the Platform', body: 'Critical server or internal operating system failures at Quetzalito that permanently block access to Premium features after payment has been made.' },
        { title: '4. Accidental Activation', body: 'Accidental contracting errors, provided they are reported immediately and no relevant or abusive use of premium benefits is recorded after the charge.' },
        { title: '5. Technical Incompatibility', body: 'Demonstrable critical display or compatibility errors not attributable to the User\'s device.' },
      ],
    },
    exclusions: {
      heading: 'Refund Exclusions',
      intro: 'No refund or proportional economic compensation shall apply in the following cases:',
      items: [
        'Forgetting to cancel the free trial or monthly automatic renewal.',
        'Non-use of the Platform during the billed period.',
        'Change of mind by the User once the 3-day trial period has ended.',
        'Requests submitted outside the legal warranty period.',
        'Technical failures caused by misuse, incorrect modifications or inadequate configurations made by the User.',
      ],
    },
    deadline: { heading: 'Non-Extendable Deadline and Management Channel', body: 'All claims must be submitted within a maximum non-extendable period of seven (7) calendar days from the date of the charge transaction. Late requests will be automatically rejected without further proceedings.', alert: '📞 Sole Support Channel', alertBody: 'The only legal reception channel is the customer service chat integrated into the official Quetzalito web platform. Financial disputes are not handled via general email or social media.' },
    times: {
      heading: 'Response Times and Bank Settlement',
      items: [
        { emoji: '⏱️', title: 'Technical Decision', body: 'The support team will evaluate and notify the resolution within a maximum of twenty-four (24) hours of receiving all documentation.' },
        { emoji: '⏱️', title: 'Internal Processing', body: 'After approval, Quetzalito will process the reversal within three (3) to seven (7) business days.' },
        { emoji: '⏱️', title: 'Bank Credit', body: 'The final time will depend exclusively on the payment method and the issuing entity\'s policies.' },
      ],
      bac: 'Credit/debit cards (BAC): may take several business days.',
      paypal: 'PayPal: could take up to one or two billing cycles depending on the bank.',
    },
    footer: 'To report a problem with your Premium subscription or request a refund, use the support chat on the platform or contact',
    footerLink: 'our team',
  },
} as const;

export default function ReembolsoPage() {
  const { language } = useLanguage();
  const c = CONTENT[language] ?? CONTENT.es;

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-sm text-muted mt-1">{c.updated}</p>
      </div>

      <p className="text-sm italic text-muted">{c.law}</p>

      <section><h2 className="text-xl font-semibold mb-2">{c.scope.heading}</h2><p className="text-ink-700 dark:text-ink-300 mb-2">{c.scope.body1}</p><p className="text-ink-700 dark:text-ink-300">{c.scope.body2}</p></section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.criteria.heading}</h2>
        <p className="mb-3 text-ink-700 dark:text-ink-300">{c.criteria.intro}</p>
        <div className="space-y-3">
          {c.criteria.items.map((item, i) => (
            <div key={i} className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold">{item.title}</p>
              <p className="text-ink-700 dark:text-ink-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.exclusions.heading}</h2>
        <p className="mb-2 text-ink-700 dark:text-ink-300">{c.exclusions.intro}</p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-ink-700 dark:text-ink-300">
          {c.exclusions.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.deadline.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300 mb-3">{c.deadline.body}</p>
        <div className="border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-900/20 rounded-r-xl">
          <p className="font-semibold mb-1">{c.deadline.alert}</p>
          <p className="text-sm">{c.deadline.alertBody}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">{c.times.heading}</h2>
        <div className="space-y-4">
          {c.times.items.map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.emoji} {item.title}</h3>
              <p className="text-ink-700 dark:text-ink-300">{item.body}</p>
              {i === 2 && (
                <ul className="list-disc list-inside ml-4 mt-1 text-ink-700 dark:text-ink-300 text-sm space-y-1">
                  <li>{c.times.bac}</li>
                  <li>{c.times.paypal}</li>
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="pt-4 border-t text-sm text-muted">
        {c.footer}{' '}
        <Link href="/legal/contacto" className="font-semibold text-brand-600 hover:underline">{c.footerLink}</Link>.
      </div>
    </article>
  );
}

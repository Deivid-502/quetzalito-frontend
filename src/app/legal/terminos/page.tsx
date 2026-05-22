'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

const CONTENT = {
  es: {
    title: 'Términos y Condiciones',
    updated: 'Última actualización: 18 de mayo de 2026',
    intro: {
      heading: 'Introducción',
      body: 'El presente documento constituye un contrato vinculante entre el usuario y Quetzalito, S.A. Al registrarse, acceder o utilizar el sitio web oficial de Quetzalito, el Usuario acepta expresamente y sin reservas todas las cláusulas estipuladas en estos Términos y Condiciones. Si no está de acuerdo con estos términos, deberá abstenerse de utilizar el servicio.',
    },
    eligibility: {
      heading: 'Elegibilidad y Capacidad Legal',
      body: 'El uso de la Plataforma está restringido exclusivamente a personas mayores de dieciocho (18) años de edad con capacidad legal para contratar, y que se encuentren cursando estudios de educación superior (universitarios) dentro del territorio de la República de Guatemala.',
    },
    disclaimer: {
      heading: 'Naturaleza Educativa y Exención de Responsabilidad Financiera',
      alert: '⚠️ IMPORTANTE',
      body1: 'Quetzalito es exclusivamente una herramienta tecnológica de organización personal, visualización de datos y educación financiera elemental. Quetzalito, S.A. no es una entidad financiera regulada, no capta fondos del público, no otorga créditos ni presta servicios de asesoría de inversión formal.',
      body2: 'Los análisis, proyecciones y recomendaciones generados automáticamente por los algoritmos de la Plataforma se basan únicamente en los datos provistos por el Usuario y poseen fines meramente ilustrativos. El Usuario es el único responsable de sus decisiones económicas, gastos, deudas y contratos financieros con terceros. Quetzalito, S.A. no asume responsabilidad alguna por pérdidas monetarias, sobregiros ni perjuicios financieros derivados del uso directo o indirecto de la aplicación.',
    },
    ip: {
      heading: 'Propiedad Intelectual',
      body1: 'Todo el contenido disponible en la Plataforma —incluyendo, pero no limitado a, el código fuente, diseños de interfaz, logotipos, textos, gráficos, algoritmos de cálculo de presupuestos y marcas comerciales— es propiedad exclusiva de Quetzalito, S.A.',
      body2: 'Queda estrictamente prohibida la reproducción, distribución, modificación, ingeniería inversa o scraping automatizado de la Plataforma sin autorización previa y por escrito de la empresa.',
    },
    prohibited: {
      heading: 'Usos Prohibidos',
      intro: 'El Usuario se compromete a utilizar la Plataforma de conformidad con la ley y la buena fe. Queda prohibido:',
      items: [
        'Registrar información financiera de manera fraudulenta, malintencionada o que suplante la identidad de terceros.',
        'Utilizar la Plataforma para fines comerciales o de intermediación financiera no autorizados.',
        'Introducir virus, troyanos o cualquier software malicioso que pretenda dañar, interferir o saturar la infraestructura técnica del servicio.',
      ],
    },
    changes: {
      heading: 'Cambios a estos Términos',
      body: 'Quetzalito, S.A. se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a través de la plataforma o por correo electrónico. El uso continuado de la Plataforma tras la publicación de cambios constituye aceptación de los nuevos términos.',
    },
    law: {
      heading: 'Ley Aplicable',
      body: 'Estos Términos y Condiciones se rigen de conformidad con las leyes de la República de Guatemala. Cualquier disputa será resuelta en los tribunales competentes de Guatemala.',
    },
    footer: 'Para consultas sobre estos términos, contactá a',
    footerLink: 'legal@quetzalito.com',
    footerOr: 'o visitá nuestra página de',
    footerContact: 'contacto',
  },
  en: {
    title: 'Terms and Conditions',
    updated: 'Last updated: May 18, 2026',
    intro: {
      heading: 'Introduction',
      body: 'This document constitutes a binding agreement between the user and Quetzalito, S.A. By registering, accessing, or using the official Quetzalito website, the User expressly and unconditionally accepts all clauses set forth in these Terms and Conditions. If you do not agree with these terms, you must refrain from using the service.',
    },
    eligibility: {
      heading: 'Eligibility and Legal Capacity',
      body: 'Use of the Platform is restricted exclusively to persons over eighteen (18) years of age with legal capacity to contract, who are enrolled in higher education (university) studies within the territory of the Republic of Guatemala.',
    },
    disclaimer: {
      heading: 'Educational Nature and Financial Liability Disclaimer',
      alert: '⚠️ IMPORTANT',
      body1: 'Quetzalito is exclusively a personal organization technology tool, data visualization, and basic financial education. Quetzalito, S.A. is not a regulated financial entity, does not raise public funds, does not grant credits, nor provides formal investment advisory services.',
      body2: 'Analyses, projections and recommendations automatically generated by the Platform\'s algorithms are based solely on data provided by the User and are for illustrative purposes only. The User is solely responsible for their economic decisions, expenses, debts and financial contracts with third parties. Quetzalito, S.A. assumes no liability for monetary losses, overdrafts or financial damages derived from the direct or indirect use of the application.',
    },
    ip: {
      heading: 'Intellectual Property',
      body1: 'All content available on the Platform — including, but not limited to, source code, interface designs, logos, texts, graphics, budget calculation algorithms and trademarks — is the exclusive property of Quetzalito, S.A.',
      body2: 'Reproduction, distribution, modification, reverse engineering or automated scraping of the Platform is strictly prohibited without prior written authorization from the company.',
    },
    prohibited: {
      heading: 'Prohibited Uses',
      intro: 'The User agrees to use the Platform in accordance with the law and good faith. The following are prohibited:',
      items: [
        'Registering financial information fraudulently, maliciously, or impersonating third parties.',
        'Using the Platform for unauthorized commercial purposes or financial intermediation.',
        'Introducing viruses, trojans, or any malicious software intended to damage, interfere with, or overload the technical infrastructure of the service.',
      ],
    },
    changes: {
      heading: 'Changes to These Terms',
      body: 'Quetzalito, S.A. reserves the right to modify these Terms and Conditions at any time. Changes will be notified through the platform or by email. Continued use of the Platform after the publication of changes constitutes acceptance of the new terms.',
    },
    law: {
      heading: 'Applicable Law',
      body: 'These Terms and Conditions are governed by the laws of the Republic of Guatemala. Any dispute shall be resolved in the competent courts of Guatemala.',
    },
    footer: 'For questions about these terms, contact us at',
    footerLink: 'legal@quetzalito.com',
    footerOr: 'or visit our',
    footerContact: 'contact page',
  },
} as const;

export default function TerminosPage() {
  const { language } = useLanguage();
  const c = CONTENT[language] ?? CONTENT.es;

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-sm text-muted mt-1">{c.updated}</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.intro.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300">{c.intro.body}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.eligibility.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300">{c.eligibility.body}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.disclaimer.heading}</h2>
        <div className="border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-900/20 rounded-r-xl mb-4">
          <p className="font-semibold mb-1">{c.disclaimer.alert}</p>
          <p className="text-sm">{c.disclaimer.body1}</p>
        </div>
        <p className="text-ink-700 dark:text-ink-300">{c.disclaimer.body2}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.ip.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300 mb-2">{c.ip.body1}</p>
        <p className="text-ink-700 dark:text-ink-300">{c.ip.body2}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.prohibited.heading}</h2>
        <p className="mb-2 text-ink-700 dark:text-ink-300">{c.prohibited.intro}</p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-ink-700 dark:text-ink-300">
          {c.prohibited.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.changes.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300">{c.changes.body}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.law.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300">{c.law.body}</p>
      </section>

      <div className="pt-4 border-t text-sm text-muted">
        {c.footer}{' '}
        <a href="mailto:legal@quetzalito.com" className="font-semibold text-brand-600 hover:underline">
          {c.footerLink}
        </a>{' '}
        {c.footerOr}{' '}
        <Link href="/legal/contacto" className="font-semibold text-brand-600 hover:underline">
          {c.footerContact}
        </Link>.
      </div>
    </article>
  );
}

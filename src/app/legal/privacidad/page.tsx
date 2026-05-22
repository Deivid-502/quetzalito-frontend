'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

const CONTENT = {
  es: {
    title: 'Política de Privacidad',
    updated: 'Última actualización: 18 de mayo de 2026',
    intro: { heading: 'Introducción', body: 'Bienvenido a Quetzalito. La privacidad y la seguridad de tus datos financieros y personales son de máxima prioridad para nosotros. De conformidad con la Constitución Política de la República de Guatemala y el Decreto Número 57-2008 (Ley de Acceso a la Información Pública), se emite el presente documento para regular el tratamiento de los datos suministrados por los usuarios.' },
    controller: { heading: 'Responsable del Tratamiento de Datos', body: 'El responsable de la recopilación, almacenamiento y procesamiento de tus datos es Quetzalito, S.A., con domicilio legal en la Ciudad de Guatemala, Guatemala, y correo electrónico de contacto de privacidad:' },
    dataCollected: {
      heading: 'Información que Recopilamos',
      intro: 'Para el correcto funcionamiento de las herramientas de presupuesto y control de gastos, la Plataforma recopila las siguientes categorías de datos:',
      items: [
        { title: '1. Datos de Registro', body: 'Nombre completo, dirección de correo electrónico institucional (universitario) y credenciales de acceso encriptadas.' },
        { title: '2. Datos Financieros de Entrada Manual', body: 'Registros de ingresos, presupuestos estimados, flujos de gastos corrientes, metas de ahorro y clasificaciones de cuentas de débito o efectivo introducidas voluntariamente por el usuario.' },
        { title: '3. Datos Técnicos y de Navegación', body: 'Dirección IP, tipo de dispositivo, sistema operativo, identificadores únicos de publicidad y datos analíticos de comportamiento dentro del sitio web.' },
      ],
    },
    security: { heading: 'Confidencialidad, Seguridad e Integridad', body1: 'Limitamos el acceso a tu información personal privada a aquellos empleados quienes necesiten conocerla para proveerle de productos y servicios. Mantenemos controles físicos, electrónicos y por procedimientos que van de acuerdo con los estándares estipulados por las agencias federales para resguardar tu información personal privada.', body2: 'No divulgaremos ninguna información personal privada acerca de ti a nadie exceptuando lo expresado en este documento o en casos permitidos por la ley.' },
    purpose: {
      heading: 'Finalidad del Procesamiento de Datos',
      intro: 'Tus datos serán utilizados estrictamente para las siguientes finalidades legítimas:',
      items: [
        'Procesar, calcular y desplegar las métricas financieras, gráficos de rendimiento y proyecciones de ahorro personalizadas del usuario.',
        'Enviar notificaciones automáticas y alertas operativas relacionadas con los límites de gasto establecidos por el propio usuario.',
        'Optimizar la interfaz técnica de la plataforma mediante análisis estadísticos anónimos y agregados sobre el comportamiento del gasto universitario en Guatemala.',
      ],
    },
    transfer: { heading: 'Transferencia y Confidencialidad de Datos', body1: 'Quetzalito, S.A. se compromete explícitamente a no vender, alquilar, transferir ni comercializar bajo ningún concepto las bases de datos financieros o personales de sus usuarios a entidades bancarias, burós de crédito, marcas comerciales ni terceros.', body2: 'Los datos podrán ser alojados en servidores de infraestructura en la nube de nivel empresarial (como AWS o Google Cloud) bajo estrictos protocolos de encriptación TLS/SSL. Los datos de pago (tarjetas) son procesados directamente por pasarelas de pago reguladas (como BAC o PayPal), por lo que Quetzalito nunca almacena ni tiene acceso a los números de tarjeta de crédito o débito.' },
    rights: { heading: 'Derechos de los Usuarios (Acceso, Rectificación y Supresión)', body1: 'Todo usuario conserva el derecho de acceder a sus datos personales, corregir cualquier inconsistencia o solicitar la eliminación definitiva de su cuenta de los servidores de la Plataforma.', body2: 'Para ejercer este derecho, el titular deberá enviar una solicitud formal a', body3: '. El proceso de supresión total e irreversible de los datos financieros se ejecutará en un plazo máximo de diez (10) días hábiles.' },
    cookies: { heading: 'Cookies y Tecnologías Similares', body: 'Para detalles sobre cómo utilizamos cookies y otras tecnologías de seguimiento, consultá nuestra', link: 'Política de Cookies', suffix: '.' },
    changes: { heading: 'Cambios a esta Política', body: 'Si actualizamos esta política, te avisaremos por correo electrónico o mediante un aviso visible en la plataforma. La fecha de última actualización siempre estará al inicio de este documento.' },
    footer: 'Si tenés preguntas sobre esta política o sobre el manejo de tus datos, podés escribirnos desde la página de',
    footerLink: 'contacto',
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: May 18, 2026',
    intro: { heading: 'Introduction', body: 'Welcome to Quetzalito. The privacy and security of your financial and personal data are our top priority. In accordance with the Political Constitution of the Republic of Guatemala and Decree No. 57-2008 (Law on Access to Public Information), this document is issued to regulate the processing of data provided by users.' },
    controller: { heading: 'Data Controller', body: 'The responsible party for the collection, storage and processing of your data is Quetzalito, S.A., with legal domicile in Guatemala City, Guatemala, and privacy contact email:' },
    dataCollected: {
      heading: 'Information We Collect',
      intro: 'For the proper functioning of the budgeting and expense control tools, the Platform collects the following categories of data:',
      items: [
        { title: '1. Registration Data', body: 'Full name, institutional (university) email address, and encrypted access credentials.' },
        { title: '2. Manually Entered Financial Data', body: 'Income records, estimated budgets, current expense flows, savings goals and debit or cash account classifications voluntarily entered by the user.' },
        { title: '3. Technical and Navigation Data', body: 'IP address, device type, operating system, unique advertising identifiers and behavioral analytics data within the website.' },
      ],
    },
    security: { heading: 'Confidentiality, Security and Integrity', body1: 'We limit access to your private personal information to those employees who need to know the information to provide you with products and services. We maintain physical, electronic and procedural controls in accordance with standards set by federal agencies to safeguard your private personal information.', body2: 'We will not disclose any private personal information about you to anyone except as described in this document or as permitted by law.' },
    purpose: {
      heading: 'Purpose of Data Processing',
      intro: 'Your data will be used strictly for the following legitimate purposes:',
      items: [
        'Processing, calculating and displaying personalized financial metrics, performance charts and savings projections for the user.',
        'Sending automatic notifications and operational alerts related to spending limits set by the user.',
        'Optimizing the technical interface of the platform through anonymous and aggregated statistical analysis of university spending behavior in Guatemala.',
      ],
    },
    transfer: { heading: 'Data Transfer and Confidentiality', body1: 'Quetzalito, S.A. explicitly commits to not sell, rent, transfer or commercialize under any concept the financial or personal databases of its users to banking entities, credit bureaus, commercial brands or third parties.', body2: 'Data may be hosted on enterprise-level cloud infrastructure servers (such as AWS or Google Cloud) under strict TLS/SSL encryption protocols. Payment data (cards) is processed directly by regulated payment gateways (such as BAC or PayPal), so Quetzalito never stores or has access to your credit or debit card numbers.' },
    rights: { heading: 'User Rights (Access, Rectification and Erasure)', body1: 'Every user retains the right to access their personal data, correct any inconsistency, or request the permanent deletion of their account from the Platform servers.', body2: 'To exercise this right, the holder must send a formal request to', body3: '. The complete and irreversible deletion of financial data will be carried out within a maximum period of ten (10) business days.' },
    cookies: { heading: 'Cookies and Similar Technologies', body: 'For details on how we use cookies and other tracking technologies, please see our', link: 'Cookie Policy', suffix: '.' },
    changes: { heading: 'Changes to This Policy', body: 'If we update this policy, we will notify you by email or through a visible notice on the platform. The last updated date will always be at the beginning of this document.' },
    footer: 'If you have questions about this policy or how we handle your data, you can contact us from our',
    footerLink: 'contact page',
  },
} as const;

export default function PrivacidadPage() {
  const { language } = useLanguage();
  const c = CONTENT[language] ?? CONTENT.es;

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-sm text-muted mt-1">{c.updated}</p>
      </div>

      <section><h2 className="text-xl font-semibold mb-2">{c.intro.heading}</h2><p className="text-ink-700 dark:text-ink-300">{c.intro.body}</p></section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.controller.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300">{c.controller.body}{' '}
          <a href="mailto:privacidad@quetzalito.com.gt" className="font-semibold text-brand-600 hover:underline">privacidad@quetzalito.com.gt</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.dataCollected.heading}</h2>
        <p className="mb-3 text-ink-700 dark:text-ink-300">{c.dataCollected.intro}</p>
        <div className="space-y-3">
          {c.dataCollected.items.map((item, i) => (
            <div key={i} className="border-l-4 border-brand-500 pl-4">
              <p className="font-semibold">{item.title}</p>
              <p className="text-ink-700 dark:text-ink-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section><h2 className="text-xl font-semibold mb-2">{c.security.heading}</h2><p className="text-ink-700 dark:text-ink-300 mb-2">{c.security.body1}</p><p className="text-ink-700 dark:text-ink-300">{c.security.body2}</p></section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.purpose.heading}</h2>
        <p className="mb-2 text-ink-700 dark:text-ink-300">{c.purpose.intro}</p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-ink-700 dark:text-ink-300">
          {c.purpose.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      <section><h2 className="text-xl font-semibold mb-2">{c.transfer.heading}</h2><p className="text-ink-700 dark:text-ink-300 mb-2"><strong>{language === 'es' ? 'No vendemos tus datos.' : 'We do not sell your data.'}</strong> {c.transfer.body1}</p><p className="text-ink-700 dark:text-ink-300">{c.transfer.body2}</p></section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{c.rights.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300 mb-2">{c.rights.body1}</p>
        <p className="text-ink-700 dark:text-ink-300">{c.rights.body2}{' '}
          <a href="mailto:privacidad@quetzalito.com.gt" className="font-semibold text-brand-600 hover:underline">privacidad@quetzalito.com.gt</a>
          {c.rights.body3}
        </p>
      </section>

      <section><h2 className="text-xl font-semibold mb-2">{c.cookies.heading}</h2>
        <p className="text-ink-700 dark:text-ink-300">{c.cookies.body}{' '}
          <Link href="/legal/cookies" className="font-semibold text-brand-600 hover:underline">{c.cookies.link}</Link>{c.cookies.suffix}
        </p>
      </section>

      <section><h2 className="text-xl font-semibold mb-2">{c.changes.heading}</h2><p className="text-ink-700 dark:text-ink-300">{c.changes.body}</p></section>

      <div className="pt-4 border-t text-sm text-muted">
        {c.footer}{' '}
        <Link href="/legal/contacto" className="font-semibold text-brand-600 hover:underline">{c.footerLink}</Link>.
      </div>
    </article>
  );
}

'use client';

import Link from 'next/link';
import { Mail, MessageSquare, ShieldCheck, Github } from 'lucide-react';
import { AcademicNotice } from '@/components/legal/AcademicNotice';

export default function ContactoPage() {
  return (
    <>
      <h1>Contacto</h1>
      <p className="text-muted text-sm">Estamos para escucharte.</p>

      <AcademicNotice />

      <p>
        Si tenés una consulta, sugerencia o reportar un problema, podés contactarnos por
        cualquiera de los siguientes medios. Respondemos en un plazo razonable.
      </p>

      <h2>Canales</h2>
      <div className="not-prose grid gap-4 sm:grid-cols-2 mt-4">
        <ContactCard
          icon={<Mail className="h-5 w-5" />}
          title="Soporte general"
          subtitle="Para consultas, dudas o ayuda con tu cuenta."
          value="soporte@quetzalito.example"
          href="mailto:soporte@quetzalito.example"
        />
        <ContactCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Reporte de seguridad"
          subtitle="Si encontrás una vulnerabilidad, escribinos por privado primero."
          value="security@quetzalito.example"
          href="mailto:security@quetzalito.example"
        />
        <ContactCard
          icon={<MessageSquare className="h-5 w-5" />}
          title="Privacidad y datos"
          subtitle="Para solicitudes de acceso, rectificación o eliminación de tus datos."
          value="privacidad@quetzalito.example"
          href="mailto:privacidad@quetzalito.example"
        />
        <ContactCard
          icon={<Github className="h-5 w-5" />}
          title="Reportes técnicos"
          subtitle="Para bugs o sugerencias de mejora del software."
          value="github.com/quetzalito"
          href="https://github.com/"
        />
      </div>

      <h2>Antes de escribir</h2>
      <p>
        Es posible que tu pregunta ya esté contestada en nuestras políticas:
      </p>
      <ul>
        <li><Link href="/legal/privacidad">Política de privacidad</Link></li>
        <li><Link href="/legal/terminos">Términos y condiciones</Link></li>
        <li><Link href="/legal/cookies">Política de cookies</Link></li>
        <li><Link href="/legal/reembolso">Política de reembolso</Link></li>
      </ul>

      <h2>Datos del proyecto</h2>
      <p>
        Quetzalito es un proyecto académico desarrollado en Guatemala. No corresponde a
        una empresa registrada con razón social ni dirección física comercial. Las
        direcciones de correo arriba son referenciales para fines del proyecto.
      </p>
    </>
  );
}

function ContactCard({
  icon,
  title,
  subtitle,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-ink-200 dark:border-ink-700 surface p-4 hover:border-brand-400 dark:hover:border-brand-400 transition-colors"
    >
      <div className="flex items-center gap-2 text-brand-600">
        {icon}
        <p className="font-semibold text-ink-900 dark:text-ink-50">{title}</p>
      </div>
      <p className="mt-1 text-xs text-muted">{subtitle}</p>
      <p className="mt-2 text-sm font-mono text-brand-600">{value}</p>
    </a>
  );
}

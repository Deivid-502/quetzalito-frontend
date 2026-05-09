'use client';

import Link from 'next/link';
import { AcademicNotice } from '@/components/legal/AcademicNotice';

export default function ReembolsoPage() {
  return (
    <>
      <h1>Política de reembolso</h1>
      <p className="text-muted text-sm">Última actualización: enero de 2026</p>

      <AcademicNotice />

      <h2>1. Modo demo del proyecto</h2>
      <p>
        En la versión actual del proyecto, la "activación" del plan Premium es una
        <strong> simulación</strong>: <strong>no se procesan cobros reales</strong> y, por
        lo tanto, <strong>no existen reembolsos a procesar</strong>. La activación y la
        cancelación impactan únicamente el estado interno de tu cuenta.
      </p>

      <h2>2. Cancelación</h2>
      <p>
        Podés cancelar tu suscripción Premium en cualquier momento desde la página de
        <Link href="/premium"> Premium</Link>. La cancelación es inmediata y volvés al plan
        Free, perdiendo acceso a las funciones avanzadas (alcancías ilimitadas,
        estadísticas extendidas, ausencia de anuncios).
      </p>

      <h2>3. Política aplicable cuando exista cobro real</h2>
      <p>
        Cuando este proyecto se conecte con una pasarela de pago real (por ejemplo
        Stripe, PayU u otra), aplicarán las siguientes reglas de reembolso, alineadas con
        las prácticas estándar de servicios digitales por suscripción:
      </p>
      <ul>
        <li>
          <strong>Cancelación dentro de los primeros 7 días desde el primer cobro</strong>:
          podrás solicitar reembolso completo, siempre que el uso no sea masivo (entendiendo
          masivo como exportaciones repetidas o uso intensivo de funciones premium).
        </li>
        <li>
          <strong>Cancelación durante un período ya iniciado</strong> (ej: a mitad de mes):
          la cancelación es inmediata y no se hace devolución prorrateada del período en
          curso.
        </li>
        <li>
          <strong>Renovaciones automáticas duplicadas, fallas técnicas o cobros indebidos</strong>:
          serán reembolsados al 100% sin condicionamiento.
        </li>
      </ul>

      <h2>4. Cómo solicitar un reembolso</h2>
      <p>
        Cuando aplique, los reembolsos se solicitan por correo electrónico a
        <a href="mailto:soporte@quetzalito.example"> soporte@quetzalito.example</a>,
        indicando:
      </p>
      <ul>
        <li>El correo asociado a tu cuenta.</li>
        <li>La fecha aproximada del cobro.</li>
        <li>El motivo de la solicitud.</li>
      </ul>
      <p>
        Te confirmaremos la recepción de la solicitud en un plazo razonable y, si corresponde,
        ejecutaremos el reembolso en el mismo medio de pago en el que se realizó el cobro.
      </p>

      <h2>5. Cambios</h2>
      <p>
        Esta política puede modificarse a medida que el proyecto evolucione hacia un
        servicio comercial. Te avisaremos por correo o mediante un aviso visible cualquier
        cambio relevante.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para cualquier consulta sobre cancelaciones o reembolsos, escribinos desde la
        página de <Link href="/legal/contacto">contacto</Link>.
      </p>
    </>
  );
}

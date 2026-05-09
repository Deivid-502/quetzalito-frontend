'use client';

import { AcademicNotice } from '@/components/legal/AcademicNotice';

export default function TerminosPage() {
  return (
    <>
      <h1>Términos y condiciones</h1>
      <p className="text-muted text-sm">Última actualización: enero de 2026</p>

      <AcademicNotice />

      <h2>1. Aceptación</h2>
      <p>
        Al crear una cuenta en Quetzalito, aceptás estos términos y condiciones, junto con
        nuestra <a href="/legal/privacidad">política de privacidad</a> y <a href="/legal/cookies">política de cookies</a>. Si no estás de acuerdo, te pedimos que no
        uses el servicio.
      </p>

      <h2>2. Descripción del servicio</h2>
      <p>
        Quetzalito es una plataforma de finanzas personales (PFM) que te permite registrar
        ingresos y gastos, organizar tu dinero en alcancías, definir presupuestos y
        consultar estadísticas básicas. La plataforma <strong>no</strong> es un banco,
        no opera con dinero real, no procesa pagos de servicios públicos ni facilita
        transferencias bancarias. Los montos que registrás en la app son tu propio
        seguimiento personal y no representan saldos bancarios reales.
      </p>

      <h2>3. Cuenta de usuario</h2>
      <ul>
        <li>Sos responsable de mantener la confidencialidad de tus credenciales.</li>
        <li>Te comprometés a registrar información real y precisa.</li>
        <li>Te comprometés a no usar tu cuenta para actividades ilegales o que vulneren los derechos de terceros.</li>
        <li>Una cuenta es estrictamente personal e intransferible.</li>
      </ul>

      <h2>4. Plan Free y plan Premium</h2>
      <p>
        Quetzalito ofrece dos modalidades:
      </p>
      <ul>
        <li><strong>Plan Free:</strong> acceso gratuito con un límite de 5 alcancías y anuncios discretos en zonas que no interfieren con la captura de datos ni con flujos críticos.</li>
        <li><strong>Plan Premium:</strong> suscripción mensual de Q19 con alcancías ilimitadas, sin anuncios y funciones avanzadas.</li>
      </ul>
      <p>
        En el contexto académico actual, las activaciones y cancelaciones de Premium
        son simulaciones sin cobro real. Para más detalle ver la <a href="/legal/reembolso">política de reembolso</a>.
      </p>

      <h2>5. Conducta del usuario</h2>
      <p>Te comprometés a no:</p>
      <ul>
        <li>Intentar vulnerar la seguridad de la plataforma.</li>
        <li>Acceder o intentar acceder a datos de otros usuarios.</li>
        <li>Realizar ingeniería inversa, raspado masivo o uso automatizado no autorizado.</li>
        <li>Suplantar la identidad de otra persona.</li>
        <li>Usar la plataforma para almacenar contenido ilícito.</li>
      </ul>

      <h2>6. Disponibilidad del servicio</h2>
      <p>
        Hacemos lo razonable para mantener Quetzalito disponible 24/7, pero no garantizamos
        disponibilidad ininterrumpida. Pueden existir ventanas de mantenimiento, incidentes
        de infraestructura o ajustes que afecten temporalmente el servicio.
      </p>

      <h2>7. Cancelación de cuenta</h2>
      <p>
        Podés solicitar la eliminación de tu cuenta en cualquier momento desde la página de
        <a href="/legal/contacto"> contacto</a>. Una vez eliminada, los datos personales
        asociados serán removidos en un plazo razonable, salvo aquellos que debamos retener
        por motivos de seguridad o auditoría.
      </p>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Los textos, ilustraciones, marca, logo y código fuente de Quetzalito son propiedad
        del equipo desarrollador. No podés copiar, redistribuir ni hacer obras derivadas sin
        permiso escrito, salvo cuando se establezca una licencia explícita en el repositorio.
      </p>

      <h2>9. Limitación de responsabilidad</h2>
      <p>
        Quetzalito provee el servicio "tal cual". Las decisiones financieras que tomes son
        tu responsabilidad. La aplicación no constituye asesoría financiera profesional.
        En la máxima medida permitida por la ley, no nos hacemos responsables por daños
        indirectos derivados del uso del servicio.
      </p>

      <h2>10. Modificaciones</h2>
      <p>
        Podemos modificar estos términos. Los cambios se notificarán por correo o mediante
        un aviso visible en la plataforma. El uso continuado del servicio tras la
        notificación constituye aceptación.
      </p>

      <h2>11. Ley aplicable</h2>
      <p>
        Estos términos se interpretan según las leyes de la República de Guatemala, sin
        perjuicio de los derechos que correspondan a los usuarios según las leyes locales
        del lugar donde residan.
      </p>

      <h2>12. Contacto</h2>
      <p>
        Para consultas sobre estos términos, escribinos desde la página de
        <a href="/legal/contacto"> contacto</a>.
      </p>
    </>
  );
}

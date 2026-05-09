'use client';

import { AcademicNotice } from '@/components/legal/AcademicNotice';

export default function PrivacidadPage() {
  return (
    <>
      <h1>Política de privacidad</h1>
      <p className="text-muted text-sm">Última actualización: enero de 2026</p>

      <AcademicNotice />

      <h2>1. Quiénes somos</h2>
      <p>
        Quetzalito es una plataforma de gestión de finanzas personales (PFM) desarrollada como
        proyecto académico. La plataforma es operada por su equipo desarrollador, sin presencia
        de una entidad comercial registrada.
      </p>

      <h2>2. Qué datos recopilamos</h2>
      <p>Para hacer funcionar el servicio, recopilamos los siguientes datos:</p>
      <h3>Datos que vos nos proveés directamente</h3>
      <ul>
        <li>Nombre, apellido, apodo y correo electrónico (en el registro).</li>
        <li>Teléfono (opcional, podés agregarlo o no).</li>
        <li>Tu contraseña, almacenada únicamente como un hash criptográfico (Argon2id) — nunca en texto plano.</li>
        <li>Avatar (imagen elegida o URL).</li>
        <li>Movimientos financieros que registrás: ingresos, gastos, transferencias entre alcancías, presupuestos y categorías.</li>
        <li>Preferencias de uso: idioma, moneda, tema visual.</li>
      </ul>
      <h3>Datos que recopilamos automáticamente</h3>
      <ul>
        <li>Dirección IP y agente de usuario, asociadas a las sesiones activas, para detectar
          accesos no autorizados.</li>
        <li>Fecha y hora del último inicio de sesión.</li>
        <li>Cookies estrictamente necesarias para mantener tu sesión iniciada (ver <a href="/legal/cookies">política de cookies</a>).</li>
      </ul>

      <h2>3. Para qué usamos tus datos</h2>
      <ul>
        <li>Para hacer funcionar la aplicación: que puedas iniciar sesión, registrar movimientos y consultar tu información.</li>
        <li>Para mostrarte estadísticas, tips y alertas personalizadas a partir de tus movimientos.</li>
        <li>Para proteger tu cuenta y detectar actividad sospechosa.</li>
        <li>Para mejorar la plataforma a partir del uso agregado y anonimizado.</li>
      </ul>
      <p>
        <strong>No vendemos tus datos.</strong> No los compartimos con anunciantes ni con
        terceros con fines de marketing. Los datos financieros son visibles únicamente para
        vos.
      </p>

      <h2>4. Cómo protegemos tu información</h2>
      <ul>
        <li>Las contraseñas se almacenan únicamente como hash Argon2id, no en texto plano.</li>
        <li>Las sesiones usan tokens JWT en cookies HttpOnly + Secure + SameSite=Lax. Los tokens nunca son accesibles desde JavaScript.</li>
        <li>Toda comunicación entre tu navegador y el servidor está cifrada por TLS.</li>
        <li>Usamos refresh tokens rotativos con detección de reuso: si alguien intenta usar un token revocado, invalidamos toda la familia de tokens del usuario.</li>
        <li>Toda consulta a tus datos filtra por tu identificador derivado del JWT, nunca de un parámetro del cliente.</li>
        <li>Aplicamos rate limiting en endpoints sensibles (registro, login).</li>
      </ul>

      <h2>5. Tus derechos</h2>
      <p>Como usuario tenés derecho a:</p>
      <ul>
        <li><strong>Acceder</strong> a tu información personal: la podés ver íntegramente desde tu perfil.</li>
        <li><strong>Rectificar</strong> tus datos: podés editar tu nombre, apodo, teléfono y avatar en cualquier momento.</li>
        <li><strong>Eliminar</strong> tu cuenta y todos los datos asociados, contactándonos por los medios indicados en la página de <a href="/legal/contacto">contacto</a>.</li>
        <li><strong>Exportar</strong> tu información (con plan Premium, a PDF o Excel).</li>
        <li><strong>Revocar el consentimiento</strong>: cerrando todas tus sesiones desde la opción de cambio de contraseña, o eliminando tu cuenta.</li>
      </ul>

      <h2>6. Retención</h2>
      <p>
        Conservamos tu información mientras tu cuenta esté activa. Si eliminás tu cuenta,
        eliminamos tus datos personales en un plazo razonable. Los logs técnicos asociados a
        seguridad pueden conservarse por hasta 90 días con fines de auditoría.
      </p>

      <h2>7. Menores de edad</h2>
      <p>
        El servicio está pensado para usuarios mayores de 13 años. Si sos menor, te
        recomendamos usarlo con la supervisión de un adulto responsable.
      </p>

      <h2>8. Cambios a esta política</h2>
      <p>
        Si actualizamos esta política, te avisaremos por correo electrónico o mediante un
        aviso visible en la plataforma. La fecha de última actualización siempre estará al
        inicio de este documento.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Si tenés preguntas sobre esta política o sobre el manejo de tus datos, podés
        escribirnos desde la página de <a href="/legal/contacto">contacto</a>.
      </p>
    </>
  );
}

'use client';

import { AcademicNotice } from '@/components/legal/AcademicNotice';

export default function CookiesPage() {
  return (
    <>
      <h1>Política de cookies</h1>
      <p className="text-muted text-sm">Última actualización: enero de 2026</p>

      <AcademicNotice />

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que un sitio web guarda en tu navegador para
        recordar información entre visitas, mantener sesiones iniciadas y mejorar la
        experiencia.
      </p>

      <h2>2. Cookies que usa Quetzalito</h2>
      <p>
        Quetzalito usa exclusivamente <strong>cookies estrictamente necesarias</strong> para
        el funcionamiento del servicio. No usamos cookies de publicidad, perfilado ni
        rastreo entre sitios.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Propósito</th>
            <th>Vigencia</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>qz_access</code></td>
            <td>Token de acceso firmado (JWT) para autenticar peticiones a la API.</td>
            <td>15 minutos</td>
            <td>HttpOnly · Secure · SameSite=Lax</td>
          </tr>
          <tr>
            <td><code>qz_refresh</code></td>
            <td>Token de refresco para renovar el acceso sin volver a iniciar sesión.</td>
            <td>30 días</td>
            <td>HttpOnly · Secure · SameSite=Lax · Path=/api/auth</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Almacenamiento local (localStorage)</h2>
      <p>
        Adicionalmente, usamos <code>localStorage</code> del navegador para guardar:
      </p>
      <ul>
        <li><code>qz_theme</code> — la preferencia de tema (claro / oscuro / automático) cuando aún no tenés sesión iniciada.</li>
      </ul>
      <p>
        El <code>localStorage</code> no se envía al servidor. Vive sólo en tu navegador.
      </p>

      <h2>4. Almacenamiento offline (IndexedDB)</h2>
      <p>
        Cuando registrás un movimiento sin conexión, Quetzalito lo guarda temporalmente
        en una base de datos local del navegador (IndexedDB). En cuanto recuperás
        conexión, la cola se sincroniza automáticamente con el servidor y el dato local
        se descarta.
      </p>

      <h2>5. Cómo controlar las cookies</h2>
      <p>
        Como las cookies que usamos son estrictamente necesarias, deshabilitarlas
        impedirá que la plataforma funcione (no podrás iniciar sesión). Podés borrarlas
        manualmente desde la configuración de tu navegador.
      </p>
    </>
  );
}

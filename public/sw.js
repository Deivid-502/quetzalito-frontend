/* eslint-disable no-undef, no-restricted-globals */
/**
 * Quetzalito — Service Worker
 *
 * Estrategias:
 *  · Static assets (_next/static, /icons, /logo.webp, /manifest.json) → cache-first
 *  · Página offline `/offline.html` precacheada para fallback de navegación
 *  · API calls → siempre network-first, NUNCA cacheamos respuestas privadas
 *  · HTML pages → network-first; si falla y la URL es protegida, serve /offline.html
 *
 * Versionado por bump: subí CACHE_VERSION para invalidar caches viejos.
 */

const CACHE_VERSION = 'qz-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = [
  '/offline.html',
  '/manifest.json',
  '/logo.webp',
];

// =================== INSTALL ===================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// =================== ACTIVATE ==================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// =================== FETCH =====================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Sólo gestionamos GET (POST/PUT/DELETE pasan directos al network)
  if (request.method !== 'GET') return;

  // Diferente origen (DiceBear, fonts, etc.) → network-first con cache fallback
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Cacheamos solo si la respuesta es válida y opaca/básica
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // API calls → network-first, sin cachear
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => new Response(
      JSON.stringify({ message: 'Sin conexión.', offline: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )));
    return;
  }

  // Static assets de Next → cache-first
  if (url.pathname.startsWith('/_next/static/') || /\.(png|webp|svg|jpg|woff2|css|js)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  // HTML pages → network-first con offline fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Cacheamos páginas públicas sólo (landing, login, register)
          const isPublic = url.pathname === '/' || url.pathname.startsWith('/login') || url.pathname.startsWith('/register');
          if (isPublic && res.status === 200) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }
});

// ============= MENSAJE DESDE LA APP ============
// Permite a la app pedir que se omita la espera de activación (skip waiting)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

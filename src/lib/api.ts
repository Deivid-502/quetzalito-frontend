/**
 * Cliente HTTP centralizado.
 *  · credentials: 'include' → envía cookies HttpOnly al backend
 *  · Reintenta UNA vez tras 401 llamando a /auth/refresh
 */

const API_BASE = '/api';

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuthRetry?: boolean;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
  }

  /** True si el error es por falta de conexión (no llegó respuesta del servidor) */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

async function rawRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, headers, skipAuthRetry, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // fetch lanza TypeError cuando no hay conexión, DNS falla, CORS bloquea, etc.
    // Lo normalizamos a un ApiError con status=0 para que el caller pueda tratarlo
    // como error de red (típicamente: encolar offline o reintentar)
    throw new ApiError(0, 'Sin conexión con el servidor.');
  }

  if (res.status === 401 && !skipAuthRetry && path !== '/auth/refresh' && path !== '/auth/login') {
    // Intentamos refresh y reintentamos UNA vez
    const refreshed = await tryRefresh();
    if (refreshed) {
      return rawRequest<T>(path, { ...options, skipAuthRetry: true });
    }
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = (data as { message?: string | string[] })?.message;
    const finalMessage = Array.isArray(message) ? message.join(', ') : message ?? res.statusText;
    throw new ApiError(res.status, finalMessage, data);
  }

  return data as T;
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export const api = {
  get:    <T>(path: string, opts?: ApiOptions) => rawRequest<T>(path, { ...opts, method: 'GET' }),
  post:   <T>(path: string, body?: unknown, opts?: ApiOptions) =>
    rawRequest<T>(path, { ...opts, method: 'POST', body }),
  patch:  <T>(path: string, body?: unknown, opts?: ApiOptions) =>
    rawRequest<T>(path, { ...opts, method: 'PATCH', body }),
  put:    <T>(path: string, body?: unknown, opts?: ApiOptions) =>
    rawRequest<T>(path, { ...opts, method: 'PUT', body }),
  delete: <T>(path: string, opts?: ApiOptions) =>
    rawRequest<T>(path, { ...opts, method: 'DELETE' }),
};

# Quetzalito — Frontend

Next.js 14 App Router · TypeScript · TailwindCSS · PWA

## Requisitos

- Node.js 18+
- Backend corriendo (ver `quetzalito-backend`)

## Desarrollo local

```bash
cp envexample .env.local
# Editar .env.local con la URL del backend

npm install
npm run dev
# → http://localhost:3000
```

## Deploy en Vercel

1. Importar este repo en [vercel.com](https://vercel.com)
2. En **Project → Settings → Environment Variables** agregar:
   - `NEXT_PUBLIC_API_URL` → URL del backend en Render (ej. `https://quetzalito-api.onrender.com`)
3. Vercel detecta Next.js automáticamente y usa `vercel.json`

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend | `https://quetzalito-api.onrender.com` |

## Scripts

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run type-check # Verificar TypeScript
npm run lint       # ESLint
```

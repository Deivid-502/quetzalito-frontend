'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth.store';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // Si venimos de una ruta protegida con ?next=, volvemos ahí
      const target = next && next.startsWith('/') ? next : '/dashboard';
      router.replace(target);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : 'No pudimos iniciar sesión. Intentá de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Bienvenido de vuelta</h1>
          <p className="mt-1 text-sm text-muted">
            Iniciá sesión para seguir controlando tu dinero.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            placeholder="vos@correo.com"
          />

          <Input
            label="Contraseña"
            name="password"
            type={showPwd ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="h-4 w-4" />}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-ink-400 hover:text-ink-600"
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {error && (
            <div className="rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth size="lg">
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿No tenés cuenta?{' '}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Crear una
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

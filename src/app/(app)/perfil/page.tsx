'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, AtSign, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AvatarPickerModal } from '@/components/profile/AvatarPickerModal';
import { useAuthStore } from '@/stores/auth.store';
import { useProfile } from '@/hooks/usePreferences';
import { useT } from '@/lib/i18n';
import { toast } from '@/components/ui/Toaster';
import { ApiError } from '@/lib/api';

/**
 * Pantalla de perfil:
 *  - Avatar diferido: el picker emite un valor candidato (`pendingAvatar`),
 *    no se persiste hasta que el usuario presione "Guardar cambios".
 *  - "Cancelar" / "Guardar" navegan de vuelta al dashboard.
 *  - Teléfono muestra el sufijo "(opcional)" en la etiqueta para que el usuario
 *    no tenga que adivinar si es obligatorio.
 *
 * `pendingAvatar` distingue 3 estados:
 *   · undefined → sin cambios (usar el avatar actual del store)
 *   · string    → setear este avatar (URL)
 *   · null      → borrar avatar (volver a iniciales)
 */
export default function PerfilPage() {
  const router = useRouter();
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const { update, saving } = useProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [pendingAvatar, setPendingAvatar] = useState<string | null | undefined>(undefined);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza form con user al cargar / cambiar
  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setNickname(user.nickname);
    setPhone(user.phone ?? '');
    setPendingAvatar(undefined);
  }, [user]);

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  // El avatar EFECTIVO mostrado en pantalla:
  //   · si hay pendingAvatar definido (incluso null) → usar ese
  //   · si no → el del usuario
  const effectiveAvatar =
    pendingAvatar !== undefined ? pendingAvatar : user?.avatarUrl ?? null;

  const avatarChanged = pendingAvatar !== undefined && pendingAvatar !== (user?.avatarUrl ?? null);

  const dirty =
    !!user &&
    (firstName.trim() !== user.firstName ||
      lastName.trim() !== user.lastName ||
      nickname.trim() !== user.nickname ||
      (phone.trim() || null) !== (user.phone ?? null) ||
      avatarChanged);

  function handleCancel() {
    // Volvemos al dashboard descartando cambios. Los useEffect repondrán los
    // valores del usuario cuando se vuelva a montar la pantalla.
    router.push('/dashboard');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !nickname.trim()) {
      setError('Nombre, apellido y apodo son obligatorios.');
      return;
    }

    try {
      await update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nickname: nickname.trim(),
        phone: phone.trim() || undefined,
        // Solo enviamos avatarUrl si cambió. Permite explicit null para borrarlo.
        ...(avatarChanged ? { avatarUrl: pendingAvatar } : {}),
      });
      toast.success(t('profile.saved'));
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al guardar.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
        <p className="text-muted">{t('profile.subtitle')}</p>
      </div>

      {/* Avatar + identidad */}
      <Card>
        <CardContent>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarOpen(true)}
                className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white overflow-hidden hover:opacity-90 transition-opacity"
                aria-label={t('profile.changePhoto')}
              >
                {effectiveAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={effectiveAvatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-ink-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                </span>
              </button>
              {avatarChanged && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
                </span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl font-bold">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted">@{user?.nickname}</p>
              {user?.isPremium && (
                <span className="mt-1 inline-block rounded-full bg-gold-500/15 text-gold-600 px-2 py-0.5 text-[11px] font-semibold">
                  PREMIUM
                </span>
              )}
              {avatarChanged && (
                <p className="mt-1 text-xs text-brand-600">
                  {t('profile.avatarPending')}
                </p>
              )}
            </div>
            <div className="sm:ml-auto">
              <Button type="button" variant="secondary" size="sm" onClick={() => setAvatarOpen(true)}>
                <Camera className="h-4 w-4" /> {t('profile.changePhoto')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <h3 className="mb-4 font-semibold">{t('profile.personalInfo')}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t('profile.firstName')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
                required
              />
              <Input
                label={t('profile.lastName')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
                required
              />
              <Input
                label={t('profile.nickname')}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                leftIcon={<AtSign className="h-4 w-4" />}
                required
              />
              <Input
                label={`${t('profile.phone')} ${t('profile.phoneOptional')}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="h-4 w-4" />}
                placeholder={`+502 ... ${t('profile.phoneOptional')}`}
              />
              <Input
                label={t('profile.email')}
                value={user?.email ?? ''}
                leftIcon={<Mail className="h-4 w-4" />}
                disabled
                hint={t('profile.emailNote')}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger dark:bg-red-900/20">
                {error}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={saving}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" loading={saving} disabled={!dirty}>
                {t('common.saveChanges')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <AvatarPickerModal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        currentAvatar={effectiveAvatar}
        initials={initials}
        onPick={(url) => setPendingAvatar(url)}
      />
    </div>
  );
}

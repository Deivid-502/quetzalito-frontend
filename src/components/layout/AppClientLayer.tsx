'use client';

import { ReactNode } from 'react';
import { IdleTimeoutModal } from '@/components/common/IdleTimeoutModal';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { useAuthStore } from '@/stores/auth.store';

export function AppClientLayer({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const emailUnverified = user && !user.emailVerifiedAt;

  return (
    <>
      {emailUnverified && (
        <div className="px-4 pt-4 sm:px-6">
          <EmailVerificationBanner />
        </div>
      )}
      {children}
      <IdleTimeoutModal />
    </>
  );
}

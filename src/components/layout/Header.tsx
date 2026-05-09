'use client';

import { Logo } from '@/components/ui/Logo';
import { AvatarMenu } from './AvatarMenu';
import { OnlineIndicator } from '@/components/common/OnlineIndicator';
import { InstallPrompt } from '@/components/common/InstallPrompt';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b surface px-4 sm:px-6 border-ink-200 dark:border-ink-700">
      <Logo href="/dashboard" />
      <div className="flex items-center gap-2">
        <OnlineIndicator />
        <InstallPrompt />
        <AvatarMenu />
      </div>
    </header>
  );
}

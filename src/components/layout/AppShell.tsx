'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { AppClientLayer } from './AppClientLayer';
import { TransactionModalProvider } from '@/components/transactions/TransactionModalProvider';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TransactionModalProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-8">
            <div className="mx-auto w-full max-w-6xl">
              <AppClientLayer>{children}</AppClientLayer>
            </div>
          </main>
        </div>
        <MobileBottomNav />
      </div>
    </TransactionModalProvider>
  );
}

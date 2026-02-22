import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
  playerBar: ReactNode;
}

export function AppShell({ children, playerBar }: AppShellProps) {
  return (
    <div className="flex h-screen bg-app transition-theme overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Player bar at bottom */}
        {playerBar}
      </div>
    </div>
  );
}

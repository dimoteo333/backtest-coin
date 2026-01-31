'use client';

import { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function MainLayout({ leftPanel, rightPanel }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        {leftPanel}
        {rightPanel}
      </div>
    </div>
  );
}

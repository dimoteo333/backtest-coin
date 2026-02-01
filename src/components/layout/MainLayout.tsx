'use client';

import { ReactNode } from 'react';

interface MainLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function MainLayout({ leftPanel, rightPanel }: MainLayoutProps) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {leftPanel}
      {rightPanel}
    </div>
  );
}

'use client';

import { ReactNode } from 'react';

interface RightPanelProps {
  children: ReactNode;
}

export function RightPanel({ children }: RightPanelProps) {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto p-4">
      {children}
    </main>
  );
}

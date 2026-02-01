'use client';

import { ReactNode } from 'react';

interface LeftPanelProps {
  children: ReactNode;
}

export function LeftPanel({ children }: LeftPanelProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[420px] lg:min-w-[420px] lg:border-r border-border bg-card/30">
      {children}
    </aside>
  );
}

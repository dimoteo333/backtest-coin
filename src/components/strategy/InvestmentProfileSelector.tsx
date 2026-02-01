'use client';

import { InvestmentProfile } from '@/types/ai-strategy';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InvestmentProfileSelectorProps {
  value: InvestmentProfile;
  onChange: (profile: InvestmentProfile) => void;
}

export function InvestmentProfileSelector({ value, onChange }: InvestmentProfileSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          value === 'stable' ? "border-primary bg-primary/5" : "border-border"
        )}
        onClick={() => onChange('stable')}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
          <div className="text-3xl">🛡️</div>
          <div className="font-semibold">안정형</div>
          <div className="text-xs text-muted-foreground text-center">
            보수적 전략
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          value === 'aggressive' ? "border-primary bg-primary/5" : "border-border"
        )}
        onClick={() => onChange('aggressive')}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
          <div className="text-3xl">🚀</div>
          <div className="font-semibold">공격형</div>
          <div className="text-xs text-muted-foreground text-center">
            적극적 전략
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

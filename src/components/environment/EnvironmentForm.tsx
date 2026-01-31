'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SymbolSelector } from './SymbolSelector';
import { TimeframeSelector } from './TimeframeSelector';
import { DateRangePicker } from './DateRangePicker';
import { CapitalInput } from './CapitalInput';
import { FeePresetSelector } from './FeePresetSelector';

export function EnvironmentForm() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Environment Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SymbolSelector />
          <TimeframeSelector />
        </div>
        <DateRangePicker />
        <CapitalInput />
        <FeePresetSelector />
      </CardContent>
    </Card>
  );
}

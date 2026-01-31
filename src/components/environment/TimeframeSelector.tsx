'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEnvironmentStore } from '@/stores';
import { AVAILABLE_TIMEFRAMES, Timeframe } from '@/types/environment';

export function TimeframeSelector() {
  const { environment, setTimeframe } = useEnvironmentStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="timeframe">Timeframe</Label>
      <Select
        value={environment.timeframe}
        onValueChange={(value) => setTimeframe(value as Timeframe)}
      >
        <SelectTrigger id="timeframe" className="w-full">
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_TIMEFRAMES.map((tf) => (
            <SelectItem key={tf.value} value={tf.value}>
              {tf.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

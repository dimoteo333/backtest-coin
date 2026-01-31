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
import { AVAILABLE_SYMBOLS } from '@/types/environment';

export function SymbolSelector() {
  const { environment, setSymbol } = useEnvironmentStore();

  const handleSymbolChange = (value: string) => {
    const selected = AVAILABLE_SYMBOLS.find((s) => s.symbol === value);
    if (selected) {
      setSymbol(selected.symbol, selected.displayName);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="symbol">Trading Pair</Label>
      <Select value={environment.symbol} onValueChange={handleSymbolChange}>
        <SelectTrigger id="symbol" className="w-full">
          <SelectValue placeholder="Select trading pair" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_SYMBOLS.map((symbol) => (
            <SelectItem key={symbol.symbol} value={symbol.symbol}>
              {symbol.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

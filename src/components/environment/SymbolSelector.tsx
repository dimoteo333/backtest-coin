'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { ENVIRONMENT_HELP } from '@/lib/help-content';
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
      <div className="flex items-center gap-1.5">
        <Label htmlFor="symbol">거래 쌍</Label>
        <HelpTooltip
          title={ENVIRONMENT_HELP.symbol.title}
          content={ENVIRONMENT_HELP.symbol.content}
          iconSize={13}
        />
      </div>
      <Select value={environment.symbol} onValueChange={handleSymbolChange}>
        <SelectTrigger id="symbol" className="w-full">
          <SelectValue placeholder="거래 쌍 선택" />
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

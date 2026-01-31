'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEnvironmentStore } from '@/stores';

export function CapitalInput() {
  const { environment, setInitialCapital, setCurrency } = useEnvironmentStore();

  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setInitialCapital(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="capital">Initial Capital</Label>
      <div className="flex gap-2">
        <Input
          id="capital"
          type="number"
          min={0}
          step={100}
          value={environment.initialCapital}
          onChange={handleCapitalChange}
          className="flex-1"
        />
        <Select
          value={environment.initialCurrency}
          onValueChange={(value) => setCurrency(value as 'USDT' | 'KRW')}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USDT">USDT</SelectItem>
            <SelectItem value="KRW">KRW</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

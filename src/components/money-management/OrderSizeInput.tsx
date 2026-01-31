'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMoneyManagementStore } from '@/stores';

export function OrderSizeInput() {
  const { moneyManagement, setOrderMode, setOrderSizePercent, setOrderSizeFixed } =
    useMoneyManagementStore();

  const handleModeChange = (mode: 'percentOfBalance' | 'fixedAmount') => {
    setOrderMode(mode);
  };

  const handlePercentChange = (value: number[]) => {
    setOrderSizePercent(value[0]);
  };

  const handleFixedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setOrderSizeFixed(value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Order Size</Label>
        <Select value={moneyManagement.orderMode} onValueChange={handleModeChange}>
          <SelectTrigger className="h-7 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentOfBalance">% of Balance</SelectItem>
            <SelectItem value="fixedAmount">Fixed Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {moneyManagement.orderMode === 'percentOfBalance' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Allocation</span>
            <span className="font-medium">{moneyManagement.orderSize.value}%</span>
          </div>
          <Slider
            value={[moneyManagement.orderSize.value]}
            onValueChange={handlePercentChange}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>100%</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="fixed-amount" className="sr-only">
            Fixed Amount
          </Label>
          <Input
            id="fixed-amount"
            type="number"
            min={0}
            step={100}
            value={moneyManagement.orderSize.value}
            onChange={handleFixedChange}
            placeholder="Enter amount in USDT"
          />
        </div>
      )}
    </div>
  );
}

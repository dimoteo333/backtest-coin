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
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { MONEY_HELP } from '@/lib/help-content';
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
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium">주문 크기</Label>
          <HelpTooltip
            title={MONEY_HELP.orderSize.title}
            content={MONEY_HELP.orderSize.content}
            iconSize={13}
          />
        </div>
        <Select value={moneyManagement.orderMode} onValueChange={handleModeChange}>
          <SelectTrigger className="h-7 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentOfBalance">잔고 비율 (%)</SelectItem>
            <SelectItem value="fixedAmount">고정 금액</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {moneyManagement.orderMode === 'percentOfBalance' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">배분율</span>
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
            고정 금액
          </Label>
          <Input
            id="fixed-amount"
            type="number"
            min={0}
            step={100}
            value={moneyManagement.orderSize.value}
            onChange={handleFixedChange}
            placeholder="USDT 금액 입력"
          />
        </div>
      )}
    </div>
  );
}

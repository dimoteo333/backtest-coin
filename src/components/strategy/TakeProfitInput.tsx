'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useStrategyStore } from '@/stores';

export function TakeProfitInput() {
  const { strategy, setTakeProfit } = useStrategyStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="take-profit-enabled" className="text-sm font-medium">
          Take Profit
        </Label>
        <Switch
          id="take-profit-enabled"
          checked={strategy.takeProfit.enabled}
          onCheckedChange={(checked) => setTakeProfit(checked)}
        />
      </div>

      {strategy.takeProfit.enabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profit Target</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              +{strategy.takeProfit.percentage}%
            </span>
          </div>
          <Slider
            value={[strategy.takeProfit.percentage]}
            onValueChange={([value]) => setTakeProfit(true, value)}
            min={1}
            max={100}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>+1%</span>
            <span>+100%</span>
          </div>
        </div>
      )}
    </div>
  );
}

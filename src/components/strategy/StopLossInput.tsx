'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useStrategyStore } from '@/stores';

export function StopLossInput() {
  const { strategy, setStopLoss } = useStrategyStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="stop-loss-enabled" className="text-sm font-medium">
          Stop Loss
        </Label>
        <Switch
          id="stop-loss-enabled"
          checked={strategy.stopLoss.enabled}
          onCheckedChange={(checked) => setStopLoss(checked)}
        />
      </div>

      {strategy.stopLoss.enabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Loss Limit</span>
            <span className="font-medium text-destructive">-{strategy.stopLoss.percentage}%</span>
          </div>
          <Slider
            value={[strategy.stopLoss.percentage]}
            onValueChange={([value]) => setStopLoss(true, value)}
            min={1}
            max={50}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-1%</span>
            <span>-50%</span>
          </div>
        </div>
      )}
    </div>
  );
}

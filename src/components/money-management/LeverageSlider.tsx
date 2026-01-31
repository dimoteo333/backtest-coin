'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useMoneyManagementStore } from '@/stores';

export function LeverageSlider() {
  const { moneyManagement, setLeverage, setLeverageEnabled } = useMoneyManagementStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="leverage-enabled" className="text-sm font-medium">
          Leverage
        </Label>
        <Switch
          id="leverage-enabled"
          checked={moneyManagement.leverageEnabled}
          onCheckedChange={setLeverageEnabled}
        />
      </div>

      {moneyManagement.leverageEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Multiplier</span>
            <span className="font-medium">{moneyManagement.leverage}x</span>
          </div>
          <Slider
            value={[moneyManagement.leverage]}
            onValueChange={([value]) => setLeverage(value)}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1x</span>
            <span>100x</span>
          </div>
        </div>
      )}
    </div>
  );
}

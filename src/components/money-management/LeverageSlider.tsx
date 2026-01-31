'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { MONEY_HELP } from '@/lib/help-content';
import { useMoneyManagementStore } from '@/stores';

export function LeverageSlider() {
  const { moneyManagement, setLeverage, setLeverageEnabled } = useMoneyManagementStore();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="leverage-enabled" className="text-sm font-medium">
            레버리지
          </Label>
          <HelpTooltip
            title={MONEY_HELP.leverage.title}
            content={MONEY_HELP.leverage.content}
            iconSize={13}
          />
        </div>
        <Switch
          id="leverage-enabled"
          checked={moneyManagement.leverageEnabled}
          onCheckedChange={setLeverageEnabled}
        />
      </div>

      {moneyManagement.leverageEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">배율</span>
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

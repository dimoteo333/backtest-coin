'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { HelpTooltip } from '@/components/ui/help-tooltip';

interface RiskControlsInputProps {
  stopLoss: number;
  takeProfit: number;
  onStopLossChange: (value: number) => void;
  onTakeProfitChange: (value: number) => void;
}

export function RiskControlsInput({
  stopLoss,
  takeProfit,
  onStopLossChange,
  onTakeProfitChange
}: RiskControlsInputProps) {
  return (
    <div className="space-y-6">
      {/* Stop Loss */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="stop-loss" className="text-sm font-medium">
            손절매
          </Label>
          <HelpTooltip
            title="손절매"
            content="진입 가격 대비 손실 비율이 이 값에 도달하면 자동으로 매도합니다."
            iconSize={13}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">손실 한도</span>
            <span className="font-medium text-destructive">-{stopLoss}%</span>
          </div>
          <Slider
            id="stop-loss"
            value={[stopLoss]}
            onValueChange={([value]) => onStopLossChange(value)}
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
      </div>

      {/* Take Profit */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="take-profit" className="text-sm font-medium">
            익절매
          </Label>
          <HelpTooltip
            title="익절매"
            content="진입 가격 대비 수익률이 이 값에 도달하면 자동으로 매도합니다."
            iconSize={13}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">수익 목표</span>
            <span className="font-medium text-green-600">+{takeProfit}%</span>
          </div>
          <Slider
            id="take-profit"
            value={[takeProfit]}
            onValueChange={([value]) => onTakeProfitChange(value)}
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
      </div>
    </div>
  );
}

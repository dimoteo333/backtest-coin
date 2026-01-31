'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEnvironmentStore } from '@/stores';
import { FEE_PRESETS } from '@/types/environment';

export function FeePresetSelector() {
  const { environment, setFeePreset, setSlippage } = useEnvironmentStore();

  const handlePresetChange = (name: string) => {
    const preset = FEE_PRESETS.find((p) => p.name === name);
    if (preset) {
      setFeePreset(preset);
    }
  };

  const handleCustomFeeChange = (type: 'maker' | 'taker', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setFeePreset({
        name: 'Custom',
        makerFee: type === 'maker' ? numValue : environment.feePreset.makerFee,
        takerFee: type === 'taker' ? numValue : environment.feePreset.takerFee,
      });
    }
  };

  const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setSlippage(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fee-preset">Fee Preset</Label>
        <Select value={environment.feePreset.name} onValueChange={handlePresetChange}>
          <SelectTrigger id="fee-preset" className="w-full">
            <SelectValue placeholder="Select fee preset" />
          </SelectTrigger>
          <SelectContent>
            {FEE_PRESETS.map((preset) => (
              <SelectItem key={preset.name} value={preset.name}>
                {preset.name} ({preset.makerFee}% / {preset.takerFee}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {environment.feePreset.name === 'Custom' && (
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="maker-fee">Maker Fee (%)</Label>
            <Input
              id="maker-fee"
              type="number"
              min={0}
              step={0.01}
              value={environment.feePreset.makerFee}
              onChange={(e) => handleCustomFeeChange('maker', e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="taker-fee">Taker Fee (%)</Label>
            <Input
              id="taker-fee"
              type="number"
              min={0}
              step={0.01}
              value={environment.feePreset.takerFee}
              onChange={(e) => handleCustomFeeChange('taker', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="slippage">Slippage (%)</Label>
        <Input
          id="slippage"
          type="number"
          min={0}
          step={0.01}
          value={environment.slippage}
          onChange={handleSlippageChange}
        />
      </div>
    </div>
  );
}

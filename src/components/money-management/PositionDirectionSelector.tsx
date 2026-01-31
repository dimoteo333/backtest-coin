'use client';

import { Label } from '@/components/ui/label';
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

export function PositionDirectionSelector() {
  const { moneyManagement, setPositionDirection } = useMoneyManagementStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor="position-direction">포지션 방향</Label>
        <HelpTooltip
          title={MONEY_HELP.positionDirection.title}
          content={MONEY_HELP.positionDirection.content}
          iconSize={13}
        />
      </div>
      <Select
        value={moneyManagement.positionDirection}
        onValueChange={(value) => setPositionDirection(value as 'long' | 'short' | 'both')}
      >
        <SelectTrigger id="position-direction" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="long">롱만 (상승 베팅)</SelectItem>
          <SelectItem value="short">숏만 (하락 베팅)</SelectItem>
          <SelectItem value="both">양방향</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMoneyManagementStore } from '@/stores';

export function PositionDirectionSelector() {
  const { moneyManagement, setPositionDirection } = useMoneyManagementStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="position-direction">Position Direction</Label>
      <Select
        value={moneyManagement.positionDirection}
        onValueChange={(value) => setPositionDirection(value as 'long' | 'short' | 'both')}
      >
        <SelectTrigger id="position-direction" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="long">Long Only</SelectItem>
          <SelectItem value="short">Short Only</SelectItem>
          <SelectItem value="both">Both Directions</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

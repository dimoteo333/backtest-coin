'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConditionEditor } from './ConditionEditor';
import type { Condition, ConditionGroup as ConditionGroupType } from '@/types/strategy';

interface ConditionGroupProps {
  title: string;
  group: ConditionGroupType;
  onOperatorChange: (operator: 'AND' | 'OR') => void;
  onAddCondition: (condition: Condition) => void;
  onUpdateCondition: (id: string, updates: Partial<Condition>) => void;
  onRemoveCondition: (id: string) => void;
}

export function ConditionGroup({
  title,
  group,
  onOperatorChange,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
}: ConditionGroupProps) {
  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      type: 'indicator_threshold',
      indicator: 'RSI',
      indicatorPeriod: 14,
      comparison: '<',
      value: 30,
      description: 'RSI(14) < 30',
    };
    onAddCondition(newCondition);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{title}</Label>
        {group.conditions.length > 1 && (
          <Select value={group.operator} onValueChange={(v) => onOperatorChange(v as 'AND' | 'OR')}>
            <SelectTrigger className="h-7 w-20 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        {group.conditions.map((condition, index) => (
          <div key={condition.id}>
            {index > 0 && (
              <div className="flex items-center justify-center py-1">
                <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 rounded bg-muted">
                  {group.operator}
                </span>
              </div>
            )}
            <ConditionEditor
              condition={condition}
              onUpdate={(updates) => onUpdateCondition(condition.id, updates)}
              onRemove={() => onRemoveCondition(condition.id)}
            />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddCondition}
        className="w-full text-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add Condition
      </Button>
    </div>
  );
}

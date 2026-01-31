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
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { STRATEGY_HELP } from '@/lib/help-content';
import { ConditionEditor } from './ConditionEditor';
import type { Condition, ConditionGroup as ConditionGroupType } from '@/types/strategy';

interface ConditionGroupProps {
  title: string;
  helpKey: 'entryCondition' | 'exitCondition';
  group: ConditionGroupType;
  onOperatorChange: (operator: 'AND' | 'OR') => void;
  onAddCondition: (condition: Condition) => void;
  onUpdateCondition: (id: string, updates: Partial<Condition>) => void;
  onRemoveCondition: (id: string) => void;
}

export function ConditionGroup({
  title,
  helpKey,
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

  const help = STRATEGY_HELP[helpKey];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label className="text-sm font-medium">{title}</Label>
          <HelpTooltip title={help.title} content={help.content} iconSize={13} />
        </div>
        {group.conditions.length > 1 && (
          <div className="flex items-center gap-1">
            <Select value={group.operator} onValueChange={(v) => onOperatorChange(v as 'AND' | 'OR')}>
              <SelectTrigger className="h-7 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">그리고</SelectItem>
                <SelectItem value="OR">또는</SelectItem>
              </SelectContent>
            </Select>
            <HelpTooltip
              title={STRATEGY_HELP.andOr.title}
              content={STRATEGY_HELP.andOr.content}
              iconSize={12}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {group.conditions.map((condition, index) => (
          <div key={condition.id}>
            {index > 0 && (
              <div className="flex items-center justify-center py-1">
                <span className="text-xs font-medium text-muted-foreground px-2 py-0.5 rounded bg-muted">
                  {group.operator === 'AND' ? '그리고' : '또는'}
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
        조건 추가
      </Button>
    </div>
  );
}

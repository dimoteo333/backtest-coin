'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Condition, IndicatorType, ComparisonOperator } from '@/types/strategy';
import { AVAILABLE_INDICATORS } from '@/types/strategy';

interface ConditionEditorProps {
  condition: Condition;
  onUpdate: (updates: Partial<Condition>) => void;
  onRemove: () => void;
}

export function ConditionEditor({ condition, onUpdate, onRemove }: ConditionEditorProps) {
  const handleIndicatorChange = (value: IndicatorType) => {
    const indicator = AVAILABLE_INDICATORS.find((i) => i.type === value);
    const description = `${value}(${indicator?.defaultPeriod ?? condition.indicatorPeriod}) ${condition.comparison} ${condition.value}`;
    onUpdate({
      indicator: value,
      indicatorPeriod: indicator?.defaultPeriod ?? condition.indicatorPeriod,
      description,
    });
  };

  const handlePeriodChange = (value: string) => {
    const period = parseInt(value, 10);
    if (!isNaN(period) && period > 0) {
      const description = `${condition.indicator}(${period}) ${condition.comparison} ${condition.value}`;
      onUpdate({ indicatorPeriod: period, description });
    }
  };

  const handleComparisonChange = (value: ComparisonOperator) => {
    const description = `${condition.indicator}(${condition.indicatorPeriod}) ${value} ${condition.value}`;
    onUpdate({ comparison: value, description });
  };

  const handleValueChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const description = `${condition.indicator}(${condition.indicatorPeriod}) ${condition.comparison} ${numValue}`;
      onUpdate({ value: numValue, description });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {condition.description}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Indicator</Label>
          <Select
            value={condition.indicator}
            onValueChange={(value) => handleIndicatorChange(value as IndicatorType)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_INDICATORS.filter((i) => i.type !== 'PRICE').map((indicator) => (
                <SelectItem key={indicator.type} value={indicator.type}>
                  {indicator.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Period</Label>
          <Input
            type="number"
            min={1}
            value={condition.indicatorPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Operator</Label>
          <Select
            value={condition.comparison}
            onValueChange={(value) => handleComparisonChange(value as ComparisonOperator)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<">&lt;</SelectItem>
              <SelectItem value=">">&gt;</SelectItem>
              <SelectItem value="<=">&lt;=</SelectItem>
              <SelectItem value=">=">&gt;=</SelectItem>
              <SelectItem value="==">==</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Value</Label>
          <Input
            type="number"
            value={condition.value}
            onChange={(e) => handleValueChange(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

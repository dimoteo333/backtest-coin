'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { getIndicatorHelp, STRATEGY_HELP } from '@/lib/help-content';
import { X } from 'lucide-react';
import type { Condition, IndicatorType, ComparisonOperator } from '@/types/strategy';
import { AVAILABLE_INDICATORS } from '@/types/strategy';

interface ConditionEditorProps {
  condition: Condition;
  onUpdate: (updates: Partial<Condition>) => void;
  onRemove: () => void;
}

// 지표 한국어 레이블
const INDICATOR_LABELS: Record<string, string> = {
  RSI: 'RSI',
  SMA: 'SMA (단순이동평균)',
  EMA: 'EMA (지수이동평균)',
  MACD: 'MACD',
  MACD_SIGNAL: 'MACD 시그널',
  MACD_HISTOGRAM: 'MACD 히스토그램',
  BB_UPPER: '볼린저밴드 상단',
  BB_MIDDLE: '볼린저밴드 중앙',
  BB_LOWER: '볼린저밴드 하단',
  PRICE: '현재가',
};

// 비교 연산자 한국어 레이블
const COMPARISON_LABELS: Record<string, string> = {
  '<': '< 보다 작음',
  '>': '> 보다 큼',
  '<=': '≤ 이하',
  '>=': '≥ 이상',
  '==': '= 같음',
  'crosses_above': '↗ 상향 돌파',
  'crosses_below': '↘ 하향 돌파',
};

const COMPARISON_OPERATORS: ComparisonOperator[] = [
  '<',
  '>',
  '<=',
  '>=',
  '==',
  'crosses_above',
  'crosses_below',
];

export function ConditionEditor({ condition, onUpdate, onRemove }: ConditionEditorProps) {
  const indicatorHelp = condition.indicator ? getIndicatorHelp(condition.indicator) : null;

  const handleIndicatorChange = (value: IndicatorType) => {
    const indicator = AVAILABLE_INDICATORS.find((i) => i.type === value);
    onUpdate({
      indicator: value,
      indicatorPeriod: indicator?.defaultPeriod || 14,
    });
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onUpdate({ indicatorPeriod: value });
    }
  };

  const handleComparisonChange = (value: ComparisonOperator) => {
    onUpdate({ comparison: value });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onUpdate({ value });
    }
  };

  const needsPeriod = !!condition.indicator && !['PRICE'].includes(condition.indicator);

  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 grid grid-cols-2 gap-2">
          {/* 지표 선택 */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <Label className="text-xs">지표</Label>
              {indicatorHelp && (
                <HelpTooltip
                  title={indicatorHelp.title}
                  content={indicatorHelp.content}
                  iconSize={11}
                />
              )}
            </div>
            <Select value={condition.indicator} onValueChange={handleIndicatorChange}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_INDICATORS.map((indicator) => (
                  <SelectItem key={indicator.type} value={indicator.type}>
                    {INDICATOR_LABELS[indicator.type] || indicator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 기간 */}
          {needsPeriod && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <Label className="text-xs">기간</Label>
                <HelpTooltip
                  title={STRATEGY_HELP.period.title}
                  content={STRATEGY_HELP.period.content}
                  iconSize={11}
                />
              </div>
              <Input
                type="number"
                min={1}
                max={200}
                value={condition.indicatorPeriod}
                onChange={handlePeriodChange}
                className="h-8 text-xs"
              />
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
        >
          <X size={14} />
          <span className="sr-only">조건 삭제</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* 비교 연산자 */}
        <div className="space-y-1.5">
          <Label className="text-xs">조건</Label>
          <Select value={condition.comparison} onValueChange={handleComparisonChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPARISON_OPERATORS.map((op) => (
                <SelectItem key={op} value={op}>
                  {COMPARISON_LABELS[op] || op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 값 */}
        <div className="space-y-1.5">
          <Label className="text-xs">값</Label>
          <Input
            type="number"
            step="any"
            value={condition.value}
            onChange={handleValueChange}
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );
}

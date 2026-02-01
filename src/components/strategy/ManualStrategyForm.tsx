'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { ConditionGroup } from './ConditionGroup';
import { StopLossInput } from './StopLossInput';
import { TakeProfitInput } from './TakeProfitInput';
import { useStrategyStore } from '@/stores';

const STRATEGY_OVERVIEW_HELP = (
  <div className="space-y-2">
    <p>
      <strong>이게 뭐예요?</strong> 언제 사고 언제 팔지 자동 거래 규칙을 설정해요.
    </p>
    <ul className="list-disc list-inside space-y-1 ml-1">
      <li><strong>진입</strong> = 언제 살지</li>
      <li><strong>청산</strong> = 언제 팔지</li>
      <li><strong>손절매</strong> = 큰 손실 방지 안전장치</li>
      <li><strong>익절매</strong> = 목표 수익에서 자동 판매</li>
    </ul>
    <p className="text-muted-foreground/80 italic">
      💡 로봇 트레이더를 프로그래밍하는 거라고 생각하세요!
    </p>
  </div>
);

export function ManualStrategyForm() {
  const {
    strategy,
    setEntryOperator,
    setExitOperator,
    addEntryCondition,
    addExitCondition,
    updateEntryCondition,
    updateExitCondition,
    removeEntryCondition,
    removeExitCondition,
  } = useStrategyStore();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-base">전략 설정</CardTitle>
          <HelpTooltip
            title="전략 설정"
            content={STRATEGY_OVERVIEW_HELP}
            iconSize={14}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ConditionGroup
          title="진입 조건 (매수 시점)"
          helpKey="entryCondition"
          group={strategy.entryCondition}
          onOperatorChange={setEntryOperator}
          onAddCondition={addEntryCondition}
          onUpdateCondition={updateEntryCondition}
          onRemoveCondition={removeEntryCondition}
        />

        <Separator />

        <ConditionGroup
          title="청산 조건 (매도 시점)"
          helpKey="exitCondition"
          group={strategy.exitCondition}
          onOperatorChange={setExitOperator}
          onAddCondition={addExitCondition}
          onUpdateCondition={updateExitCondition}
          onRemoveCondition={removeExitCondition}
        />

        <Separator />

        <div className="space-y-4">
          <StopLossInput />
          <TakeProfitInput />
        </div>
      </CardContent>
    </Card>
  );
}

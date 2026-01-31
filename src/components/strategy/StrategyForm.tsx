'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ConditionGroup } from './ConditionGroup';
import { StopLossInput } from './StopLossInput';
import { TakeProfitInput } from './TakeProfitInput';
import { useStrategyStore } from '@/stores';

export function StrategyForm() {
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
        <CardTitle className="text-base">Strategy Logic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ConditionGroup
          title="Entry Conditions (When to Buy)"
          group={strategy.entryCondition}
          onOperatorChange={setEntryOperator}
          onAddCondition={addEntryCondition}
          onUpdateCondition={updateEntryCondition}
          onRemoveCondition={removeEntryCondition}
        />

        <Separator />

        <ConditionGroup
          title="Exit Conditions (When to Sell)"
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

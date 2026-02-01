'use client';

import { StrategyLogic } from '@/types/strategy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StrategyPreviewProps {
  strategy: StrategyLogic;
}

export function StrategyPreview({ strategy }: StrategyPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Entry Conditions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="default">진입 조건</Badge>
            <span className="text-sm text-muted-foreground">
              ({strategy.entryCondition.operator})
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {strategy.entryCondition.conditions.map((condition, index) => (
            <div
              key={condition.id}
              className="flex items-start gap-2 p-3 rounded-md bg-muted/50"
            >
              <Badge variant="outline" className="shrink-0">
                {index + 1}
              </Badge>
              <span className="text-sm">{condition.description}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Exit Conditions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">청산 조건</Badge>
            <span className="text-sm text-muted-foreground">
              ({strategy.exitCondition.operator})
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {strategy.exitCondition.conditions.map((condition, index) => (
            <div
              key={condition.id}
              className="flex items-start gap-2 p-3 rounded-md bg-muted/50"
            >
              <Badge variant="outline" className="shrink-0">
                {index + 1}
              </Badge>
              <span className="text-sm">{condition.description}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Management */}
      <div className="grid grid-cols-2 gap-3">
        {strategy.stopLoss.enabled && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">손절매</div>
                <div className="text-lg font-semibold text-destructive">
                  -{strategy.stopLoss.percentage}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {strategy.stopLoss.description}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {strategy.takeProfit.enabled && (
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">익절매</div>
                <div className="text-lg font-semibold text-green-600">
                  +{strategy.takeProfit.percentage}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {strategy.takeProfit.description}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

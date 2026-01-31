'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { OrderSizeInput } from './OrderSizeInput';
import { LeverageSlider } from './LeverageSlider';
import { PositionDirectionSelector } from './PositionDirectionSelector';

const MONEY_OVERVIEW_HELP = (
  <div className="space-y-2">
    <p>
      <strong>이게 뭐예요?</strong> 한 번 거래할 때 얼마를 투자할지 정해요.
    </p>
    <ul className="list-disc list-inside space-y-1 ml-1">
      <li><strong>주문 크기</strong> = 거래당 투자 금액</li>
      <li><strong>방향</strong> = 롱(상승 베팅), 숏(하락 베팅), 또는 둘 다</li>
      <li><strong>레버리지</strong> = 투자금 배율 (위험 높음!)</li>
    </ul>
    <p className="text-muted-foreground/80 italic">
      💡 위험 관리를 위해 1~5%씩 작게 시작하세요.
    </p>
  </div>
);

export function MoneyManagementForm() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-base">자금 관리</CardTitle>
          <HelpTooltip
            title="자금 관리"
            content={MONEY_OVERVIEW_HELP}
            iconSize={14}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderSizeInput />
        <PositionDirectionSelector />
        <LeverageSlider />
      </CardContent>
    </Card>
  );
}

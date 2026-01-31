'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { SymbolSelector } from './SymbolSelector';
import { TimeframeSelector } from './TimeframeSelector';
import { DateRangePicker } from './DateRangePicker';
import { CapitalInput } from './CapitalInput';
import { FeePresetSelector } from './FeePresetSelector';

const ENVIRONMENT_OVERVIEW_HELP = (
  <div className="space-y-2">
    <p>
      <strong>이게 뭐예요?</strong> 백테스트 시뮬레이션을 위한 기본 설정이에요.
    </p>
    <ul className="list-disc list-inside space-y-1 ml-1">
      <li><strong>거래 쌍</strong> = 어떤 암호화폐를 테스트할지</li>
      <li><strong>타임프레임</strong> = 캔들 하나의 시간 단위</li>
      <li><strong>기간</strong> = 테스트할 과거 기간</li>
      <li><strong>자본금</strong> = 시작 금액</li>
      <li><strong>수수료</strong> = 거래소 거래 비용</li>
    </ul>
    <p className="text-muted-foreground/80 italic">
      💡 실제 거래 환경과 비슷하게 설정하면 더 정확해요.
    </p>
  </div>
);

export function EnvironmentForm() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-base">환경 설정</CardTitle>
          <HelpTooltip
            title="환경 설정"
            content={ENVIRONMENT_OVERVIEW_HELP}
            iconSize={14}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SymbolSelector />
          <TimeframeSelector />
        </div>
        <DateRangePicker />
        <CapitalInput />
        <FeePresetSelector />
      </CardContent>
    </Card>
  );
}

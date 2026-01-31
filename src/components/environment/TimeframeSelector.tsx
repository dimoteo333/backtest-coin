'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { ENVIRONMENT_HELP } from '@/lib/help-content';
import { useEnvironmentStore } from '@/stores';
import { AVAILABLE_TIMEFRAMES, Timeframe } from '@/types/environment';

// 타임프레임 한국어 레이블
const TIMEFRAME_LABELS: Record<string, string> = {
  '1m': '1분',
  '5m': '5분',
  '15m': '15분',
  '30m': '30분',
  '1h': '1시간',
  '4h': '4시간',
  '1d': '1일',
  '1w': '1주',
};

export function TimeframeSelector() {
  const { environment, setTimeframe } = useEnvironmentStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor="timeframe">타임프레임</Label>
        <HelpTooltip
          title={ENVIRONMENT_HELP.timeframe.title}
          content={ENVIRONMENT_HELP.timeframe.content}
          iconSize={13}
        />
      </div>
      <Select
        value={environment.timeframe}
        onValueChange={(value) => setTimeframe(value as Timeframe)}
      >
        <SelectTrigger id="timeframe" className="w-full">
          <SelectValue placeholder="타임프레임 선택" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_TIMEFRAMES.map((tf) => (
            <SelectItem key={tf.value} value={tf.value}>
              {TIMEFRAME_LABELS[tf.value] || tf.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

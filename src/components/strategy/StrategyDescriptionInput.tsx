'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpTooltip } from '@/components/ui/help-tooltip';

interface StrategyDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function StrategyDescriptionInput({
  value,
  onChange,
  maxLength = 500
}: StrategyDescriptionInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <Label htmlFor="strategy-description" className="text-sm font-medium">
          전략 설명
        </Label>
        <HelpTooltip
          title="전략 설명"
          content={
            <div className="space-y-2">
              <p>원하는 매매 전략을 자연어로 설명해주세요.</p>
              <div className="space-y-1 text-xs">
                <p className="font-semibold">예시:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>RSI가 30 이하일 때 매수하고 70 이상일 때 매도</li>
                  <li>골든크로스 발생 시 매수, 데드크로스 시 매도</li>
                  <li>볼린저 밴드 하단 돌파 시 매수</li>
                  <li>MACD가 시그널선을 상향 돌파할 때 진입</li>
                </ul>
              </div>
            </div>
          }
          iconSize={13}
        />
      </div>

      <Textarea
        id="strategy-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예: RSI가 30 이하일 때 매수하고 70 이상일 때 매도"
        className="min-h-[120px] resize-none"
        maxLength={maxLength}
      />

      <div className="flex justify-end text-xs text-muted-foreground">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { InvestmentProfile, AIStrategyResponse } from '@/types/ai-strategy';
import { StrategyLogic } from '@/types/strategy';
import { useStrategyStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvestmentProfileSelector } from './InvestmentProfileSelector';
import { RiskControlsInput } from './RiskControlsInput';
import { StrategyDescriptionInput } from './StrategyDescriptionInput';
import { StrategyPreview } from './StrategyPreview';
import { ValidationWarnings } from './ValidationWarnings';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

type FormStep = 'input' | 'preview' | 'confirmed';

export function AIStrategyForm() {
  const [step, setStep] = useState<FormStep>('input');
  const [profile, setProfile] = useState<InvestmentProfile>('stable');
  const [stopLoss, setStopLoss] = useState(5);
  const [takeProfit, setTakeProfit] = useState(10);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIStrategyResponse | null>(null);

  const { setStrategy } = useStrategyStore();

  const handleGenerate = async () => {
    if (!description.trim()) {
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/strategy/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          stopLossPercent: stopLoss,
          takeProfitPercent: takeProfit,
          description: description.trim(),
        }),
      });

      const data: AIStrategyResponse = await res.json();
      setResponse(data);

      if (data.success && data.strategy) {
        setStep('preview');
      }
    } catch (error) {
      setResponse({
        success: false,
        error: {
          code: 'OPENAI_ERROR',
          message: '네트워크 오류가 발생했습니다',
          details: error instanceof Error ? error.message : '알 수 없는 오류',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (response?.success && response.strategy) {
      setStrategy(response.strategy);
      setStep('confirmed');
    }
  };

  const handleReset = () => {
    setStep('input');
    setDescription('');
    setResponse(null);
  };

  const hasErrors = response?.warnings?.some(w => w.severity === 'error') ?? false;

  return (
    <div className="space-y-6">
      {step === 'input' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI 전략 생성
              </CardTitle>
              <CardDescription>
                투자 성향과 리스크 수준을 설정하고, 원하는 전략을 자연어로 설명해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Investment Profile */}
              <div className="space-y-3">
                <div className="text-sm font-medium">투자 성향</div>
                <InvestmentProfileSelector value={profile} onChange={setProfile} />
              </div>

              {/* Risk Controls */}
              <RiskControlsInput
                stopLoss={stopLoss}
                takeProfit={takeProfit}
                onStopLossChange={setStopLoss}
                onTakeProfitChange={setTakeProfit}
              />

              {/* Strategy Description */}
              <StrategyDescriptionInput value={description} onChange={setDescription} />

              {/* Error Display */}
              {response?.error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-medium text-destructive">{response.error.message}</div>
                      {response.error.details && (
                        <div className="text-sm text-muted-foreground">{response.error.details}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!description.trim() || loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    전략 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    전략 생성
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {step === 'preview' && response?.success && response.strategy && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>생성된 전략 미리보기</CardTitle>
              <CardDescription>
                아래 내용을 확인하고 적용하거나 다시 생성할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Validation Warnings */}
              {response.warnings && response.warnings.length > 0 && (
                <ValidationWarnings warnings={response.warnings} />
              )}

              {/* Strategy Preview */}
              <StrategyPreview strategy={response.strategy} />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  다시 생성
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={hasErrors}
                  className="flex-1"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  적용하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {step === 'confirmed' && (
        <>
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-green-500/10 p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">전략이 적용되었습니다</h3>
                  <p className="text-sm text-muted-foreground">
                    이제 백테스트를 실행하여 전략의 성과를 확인할 수 있습니다.
                  </p>
                </div>
                <Button onClick={handleReset} variant="outline" className="mt-4">
                  새 전략 만들기
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

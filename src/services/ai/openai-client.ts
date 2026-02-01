import OpenAI from 'openai';
import { InvestmentProfile } from '@/types/ai-strategy';
import { StrategyLogic } from '@/types/strategy';

export class OpenAIStrategyGenerator {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  private buildSystemPrompt(
    profile: InvestmentProfile,
    stopLoss: number,
    takeProfit: number
  ): string {
    const profileGuidance = profile === 'aggressive'
      ? `적극형 (Aggressive) 전략:
- 모멘텀 지표 선호: MACD, EMA
- RSI 범위: 25-75 (더 넓은 범위)
- 조건 개수: 2-3개
- 조건 연결: OR 로직 (더 많은 진입 기회)`
      : `안정형 (Stable) 전략:
- 추세 추종 지표 선호: SMA (장기)
- RSI 범위: 20-80 (보수적)
- 조건 개수: 1-2개
- 조건 연결: AND 로직 (엄격한 진입)`;

    return `당신은 암호화폐 트레이딩 전략 전문가입니다. 자연어 설명을 JSON 설정으로 변환합니다.

투자 성향: ${profile === 'aggressive' ? '적극형' : '안정형'}
${profileGuidance}

사용 가능한 지표:
- RSI (0-100, 기본 기간 14): 과매도 <30, 과매수 >70
- SMA/EMA (기간 5-200): 이동평균선
- MACD (12-26-9): MACD, MACD_SIGNAL, MACD_HISTOGRAM
- Bollinger Bands (기간 20): BB_UPPER, BB_MIDDLE, BB_LOWER
- PRICE: 현재 종가

비교 연산자: '<' | '>' | '==' | '<=' | '>='

오직 유효한 JSON만 출력하세요 (마크다운 없음):
{
  "entryCondition": {
    "operator": "AND" | "OR",
    "conditions": [
      {
        "id": "unique_id",
        "type": "indicator_threshold" | "indicator_compare" | "price_action",
        "indicator": "RSI",
        "indicatorPeriod": 14,
        "comparison": "<",
        "value": 30,
        "description": "RSI(14) < 30"
      }
    ]
  },
  "exitCondition": {
    "operator": "AND" | "OR",
    "conditions": [
      {
        "id": "unique_id",
        "type": "indicator_threshold",
        "indicator": "RSI",
        "indicatorPeriod": 14,
        "comparison": ">",
        "value": 70,
        "description": "RSI(14) > 70"
      }
    ]
  },
  "stopLoss": {
    "enabled": true,
    "percentage": ${stopLoss},
    "description": "${stopLoss}% 손절"
  },
  "takeProfit": {
    "enabled": true,
    "percentage": ${takeProfit},
    "description": "${takeProfit}% 익절"
  }
}

검증 규칙:
1. RSI 값은 0-100
2. 기간은 양의 정수
3. 조건 ID는 고유해야 함
4. 설명은 한글로 작성
5. 모순되는 조건 금지

type에 따른 필드 요구사항:
- indicator_threshold: indicator, indicatorPeriod, comparison, value 필요
- indicator_compare: indicator, indicatorPeriod, comparison, compareToIndicator, compareToIndicatorPeriod 필요
- price_action: comparison, value, compareToIndicator (옵션) 필요

예시:
사용자: "RSI가 30 이하일 때 매수하고 70 이상일 때 매도"
응답: RSI(14) < 30 진입 조건, RSI(14) > 70 청산 조건

사용자: "골든크로스 발생 시 매수"
응답: SMA(50) > SMA(200) 또는 EMA(12) > EMA(26) 진입 조건`;
  }

  async generateStrategy(
    profile: InvestmentProfile,
    stopLoss: number,
    takeProfit: number,
    description: string
  ): Promise<StrategyLogic> {
    const systemPrompt = this.buildSystemPrompt(profile, stopLoss, takeProfit);

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: description }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI 응답이 비어있습니다');
    }

    try {
      const strategy = JSON.parse(content) as StrategyLogic;
      return strategy;
    } catch (error) {
      throw new Error(`AI 응답 파싱 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  async generateStrategyWithRetry(
    profile: InvestmentProfile,
    stopLoss: number,
    takeProfit: number,
    description: string,
    maxRetries: number = 3
  ): Promise<StrategyLogic> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.generateStrategy(profile, stopLoss, takeProfit, description);
      } catch (error) {
        lastError = error as Error;

        // Rate limit error - wait before retry
        if (error instanceof OpenAI.RateLimitError) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        // Other errors - throw immediately
        throw error;
      }
    }

    throw lastError || new Error('전략 생성 실패');
  }
}

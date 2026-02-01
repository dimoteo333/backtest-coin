import { NextRequest, NextResponse } from 'next/server';
import { AIStrategyRequest, AIStrategyResponse } from '@/types/ai-strategy';
import { OpenAIStrategyGenerator } from '@/services/ai/openai-client';
import { validateStrategySchema } from '@/services/validation/schema-validator';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: AIStrategyRequest = await request.json();

    // Validate input
    if (!body.description || body.description.trim().length === 0) {
      return NextResponse.json<AIStrategyResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '전략 설명을 입력해주세요',
        }
      }, { status: 400 });
    }

    if (body.stopLossPercent <= 0 || body.takeProfitPercent <= 0) {
      return NextResponse.json<AIStrategyResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '손절/익절 비율은 양수여야 합니다',
        }
      }, { status: 400 });
    }

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json<AIStrategyResponse>({
        success: false,
        error: {
          code: 'OPENAI_ERROR',
          message: '서버 설정 오류: OpenAI API 키가 설정되지 않았습니다',
          details: 'OPENAI_API_KEY 환경 변수를 설정해주세요'
        }
      }, { status: 500 });
    }

    // Generate strategy using OpenAI
    const generator = new OpenAIStrategyGenerator(apiKey);

    let strategy;
    try {
      strategy = await generator.generateStrategyWithRetry(
        body.profile,
        body.stopLossPercent,
        body.takeProfitPercent,
        body.description,
        3 // Max retries
      );
    } catch (error) {
      // Handle OpenAI-specific errors
      if (error instanceof OpenAI.AuthenticationError) {
        return NextResponse.json<AIStrategyResponse>({
          success: false,
          error: {
            code: 'OPENAI_ERROR',
            message: '서버 설정 오류: OpenAI API 인증 실패',
            details: 'API 키를 확인해주세요'
          }
        }, { status: 500 });
      }

      if (error instanceof OpenAI.RateLimitError) {
        return NextResponse.json<AIStrategyResponse>({
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요',
          }
        }, { status: 429 });
      }

      if (error instanceof SyntaxError || (error instanceof Error && error.message.includes('파싱 실패'))) {
        return NextResponse.json<AIStrategyResponse>({
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'AI 응답을 처리할 수 없습니다',
            details: error instanceof Error ? error.message : '알 수 없는 오류'
          }
        }, { status: 422 });
      }

      // Generic error
      return NextResponse.json<AIStrategyResponse>({
        success: false,
        error: {
          code: 'OPENAI_ERROR',
          message: 'AI 전략 생성에 실패했습니다',
          details: error instanceof Error ? error.message : '알 수 없는 오류'
        }
      }, { status: 500 });
    }

    // Validate generated strategy
    const warnings = validateStrategySchema(strategy);
    const hasErrors = warnings.some(w => w.severity === 'error');

    if (hasErrors) {
      return NextResponse.json<AIStrategyResponse>({
        success: false,
        strategy,
        warnings,
        error: {
          code: 'VALIDATION_ERROR',
          message: '생성된 전략에 오류가 있습니다',
        }
      }, { status: 422 });
    }

    // Return successful response
    return NextResponse.json<AIStrategyResponse>({
      success: true,
      strategy,
      warnings
    });

  } catch (error) {
    console.error('Strategy generation error:', error);
    return NextResponse.json<AIStrategyResponse>({
      success: false,
      error: {
        code: 'OPENAI_ERROR',
        message: '전략 생성 중 오류가 발생했습니다',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      }
    }, { status: 500 });
  }
}

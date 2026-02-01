import { Candle } from '@/types/candle';
import { EnvironmentSetup } from '@/types/environment';
import { StrategyLogic } from '@/types/strategy';
import { MoneyManagement } from '@/types/moneyManagement';
import { ValidationWarning } from '@/types/ai-strategy';
import { CPUBacktestEngine } from '@/services/backtest/cpuEngine';

export interface DryRunResult {
  valid: boolean;
  tradeCount: number;
  warnings: ValidationWarning[];
  error?: string;
}

export async function runDryRunValidation(
  strategy: StrategyLogic,
  candles: Candle[],
  environment: EnvironmentSetup,
  moneyManagement: MoneyManagement
): Promise<DryRunResult> {
  const warnings: ValidationWarning[] = [];

  try {
    // Use last 168 candles (approximately 7 days for 1h timeframe)
    const testCandles = candles.slice(-168);

    if (testCandles.length === 0) {
      return {
        valid: false,
        tradeCount: 0,
        warnings: [{
          severity: 'error',
          category: 'logic',
          message: '백테스트에 사용할 데이터가 없습니다',
        }],
        error: '캔들 데이터가 비어있습니다'
      };
    }

    // Run backtest
    const engine = new CPUBacktestEngine(testCandles, {
      environment,
      strategy,
      moneyManagement
    });
    const result = engine.run();

    // Analyze results
    const tradeCount = result.visualization.trades.length;

    if (tradeCount === 0) {
      warnings.push({
        severity: 'warning',
        category: 'logic',
        message: '7일 테스트에서 거래가 발생하지 않았습니다',
        suggestion: '조건을 완화하거나 다른 지표를 사용해보세요'
      });
    } else if (tradeCount > 100) {
      warnings.push({
        severity: 'warning',
        category: 'logic',
        message: `7일 테스트에서 거래가 너무 빈번합니다 (${tradeCount}건)`,
        suggestion: '조건을 엄격하게 하여 거래 빈도를 줄이는 것을 권장합니다'
      });
    } else {
      warnings.push({
        severity: 'warning',
        category: 'logic',
        message: `7일 테스트에서 ${tradeCount}건의 거래가 발생했습니다`,
      });
    }

    return {
      valid: true,
      tradeCount,
      warnings
    };
  } catch (error) {
    return {
      valid: false,
      tradeCount: 0,
      warnings: [{
        severity: 'error',
        category: 'logic',
        message: '전략 실행 중 오류가 발생했습니다',
        suggestion: '전략 조건을 확인해주세요'
      }],
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
}

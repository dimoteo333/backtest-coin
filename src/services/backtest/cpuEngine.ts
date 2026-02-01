import type { Candle, CompletedTrade, Position, PreCalculatedIndicators } from '@/types/candle';
import type { EnvironmentSetup } from '@/types/environment';
import type { StrategyLogic, Condition, ConditionGroup } from '@/types/strategy';
import type { MoneyManagement } from '@/types/moneyManagement';
import type { BacktestResult } from '@/types/results';
import {
  calculateRSI,
  calculateSMA,
  calculateEMA,
  calculateMACD,
  calculateBollingerBands,
} from '@/indicators';
import {
  calculateSummary,
  calculateDetailedStats,
  calculateVisualizationData,
  EquityPoint,
} from './metrics';
import { logger } from '@/lib/debug-logger';

export interface BacktestConfig {
  environment: EnvironmentSetup;
  strategy: StrategyLogic;
  moneyManagement: MoneyManagement;
}

/**
 * Pre-calculate all indicators for the candle data
 * This is done once and cached for fast recalculation
 */
export function preCalculateIndicators(candles: Candle[]): PreCalculatedIndicators {
  logger.group('INDICATORS', `Pre-calculating indicators for ${candles.length} candles`, true);
  const startTime = performance.now();

  // Common RSI periods
  const rsiPeriods = [7, 14, 21, 28];
  const rsi: Record<number, number[]> = {};
  for (const period of rsiPeriods) {
    rsi[period] = calculateRSI(candles, period);
    logger.log('INDICATORS', `RSI(${period}) calculated`, { level: 'debug' });
  }

  // Common SMA periods
  const smaPeriods = [5, 10, 20, 50, 100, 200];
  const sma: Record<number, number[]> = {};
  for (const period of smaPeriods) {
    sma[period] = calculateSMA(candles, period);
    logger.log('INDICATORS', `SMA(${period}) calculated`, { level: 'debug' });
  }

  // Common EMA periods
  const emaPeriods = [5, 10, 12, 20, 26, 50, 100, 200];
  const ema: Record<number, number[]> = {};
  for (const period of emaPeriods) {
    ema[period] = calculateEMA(candles, period);
    logger.log('INDICATORS', `EMA(${period}) calculated`, { level: 'debug' });
  }

  // Bollinger Bands
  const bbPeriods = [20];
  const bb: Record<number, Array<{ upper: number; middle: number; lower: number }>> = {};
  for (const period of bbPeriods) {
    bb[period] = calculateBollingerBands(candles, period);
    logger.log('INDICATORS', `BB(${period}) calculated`, { level: 'debug' });
  }

  // MACD
  const macd = calculateMACD(candles);
  logger.log('INDICATORS', 'MACD calculated', { level: 'debug' });

  const duration = performance.now() - startTime;
  logger.log('INDICATORS', `All indicators calculated in ${duration.toFixed(2)}ms`, { level: 'success' });
  logger.groupEnd();

  return { rsi, sma, ema, bb, macd };
}

/**
 * Get indicator value at a specific index
 */
function getIndicatorValue(
  indicators: PreCalculatedIndicators,
  candles: Candle[],
  indicator: string,
  period: number,
  index: number
): number {
  switch (indicator) {
    case 'RSI':
      // If period not pre-calculated, calculate on the fly
      if (!indicators.rsi[period]) {
        indicators.rsi[period] = calculateRSI(candles, period);
      }
      return indicators.rsi[period][index];

    case 'SMA':
      if (!indicators.sma[period]) {
        indicators.sma[period] = calculateSMA(candles, period);
      }
      return indicators.sma[period][index];

    case 'EMA':
      if (!indicators.ema[period]) {
        indicators.ema[period] = calculateEMA(candles, period);
      }
      return indicators.ema[period][index];

    case 'BB_UPPER':
      if (!indicators.bb[period]) {
        indicators.bb[period] = calculateBollingerBands(candles, period);
      }
      return indicators.bb[period][index]?.upper ?? NaN;

    case 'BB_MIDDLE':
      if (!indicators.bb[period]) {
        indicators.bb[period] = calculateBollingerBands(candles, period);
      }
      return indicators.bb[period][index]?.middle ?? NaN;

    case 'BB_LOWER':
      if (!indicators.bb[period]) {
        indicators.bb[period] = calculateBollingerBands(candles, period);
      }
      return indicators.bb[period][index]?.lower ?? NaN;

    case 'MACD':
      return indicators.macd[index]?.macd ?? NaN;

    case 'MACD_SIGNAL':
      return indicators.macd[index]?.signal ?? NaN;

    case 'MACD_HISTOGRAM':
      return indicators.macd[index]?.histogram ?? NaN;

    case 'PRICE':
      return candles[index].close;

    default:
      return NaN;
  }
}

/**
 * Evaluate a single condition
 */
function evaluateCondition(
  condition: Condition,
  indicators: PreCalculatedIndicators,
  candles: Candle[],
  index: number,
  logDetails: boolean = false
): boolean {
  const indicatorValue = getIndicatorValue(
    indicators,
    candles,
    condition.indicator || 'PRICE',
    condition.indicatorPeriod || 14,
    index
  );

  if (isNaN(indicatorValue)) {
    if (logDetails) {
      logger.log('CONDITION', `${condition.description}: SKIP (indicator value is NaN)`, { level: 'debug' });
    }
    return false;
  }

  let compareValue: number;
  if (condition.compareToIndicator) {
    compareValue = getIndicatorValue(
      indicators,
      candles,
      condition.compareToIndicator,
      condition.compareToIndicatorPeriod || 14,
      index
    );
  } else {
    compareValue = condition.value;
  }

  if (isNaN(compareValue)) {
    if (logDetails) {
      logger.log('CONDITION', `${condition.description}: SKIP (compare value is NaN)`, { level: 'debug' });
    }
    return false;
  }

  let result = false;
  switch (condition.comparison) {
    case '<':
      result = indicatorValue < compareValue;
      break;
    case '>':
      result = indicatorValue > compareValue;
      break;
    case '<=':
      result = indicatorValue <= compareValue;
      break;
    case '>=':
      result = indicatorValue >= compareValue;
      break;
    case '==':
      result = Math.abs(indicatorValue - compareValue) < 0.0001;
      break;
    default:
      result = false;
  }

  if (logDetails) {
    const indicatorName = condition.indicator || 'PRICE';
    const period = condition.indicatorPeriod || 0;
    const fullName = period > 0 ? `${indicatorName}(${period})` : indicatorName;

    logger.log(
      'CONDITION',
      `${condition.description}: ${result ? '✓' : '✗'} (${fullName}=${indicatorValue.toFixed(4)} ${condition.comparison} ${compareValue.toFixed(4)})`,
      { level: result ? 'success' : 'debug' }
    );
  }

  return result;
}

/**
 * Evaluate a condition group
 */
function evaluateConditionGroup(
  group: ConditionGroup,
  indicators: PreCalculatedIndicators,
  candles: Candle[],
  index: number,
  type: 'entry' | 'exit' = 'entry',
  logDetails: boolean = false
): boolean {
  if (group.conditions.length === 0) {
    return false;
  }

  if (logDetails) {
    logger.group('CONDITION', `Evaluating ${type} conditions (${group.operator})`, false);
  }

  let result: boolean;
  if (group.operator === 'AND') {
    result = group.conditions.every((c) => evaluateCondition(c, indicators, candles, index, logDetails));
  } else {
    result = group.conditions.some((c) => evaluateCondition(c, indicators, candles, index, logDetails));
  }

  if (logDetails) {
    logger.log('CONDITION', `${type.toUpperCase()} result: ${result ? '✓ TRUE' : '✗ FALSE'}`, {
      level: result ? 'success' : 'debug',
    });
    logger.groupEnd();
  }

  return result;
}

/**
 * Calculate the warmup period needed for all indicators
 */
function calculateWarmupPeriod(strategy: StrategyLogic): number {
  let maxPeriod = 0;

  const checkConditions = (conditions: Condition[]) => {
    for (const condition of conditions) {
      if (condition.indicatorPeriod) {
        maxPeriod = Math.max(maxPeriod, condition.indicatorPeriod);
      }
      if (condition.compareToIndicatorPeriod) {
        maxPeriod = Math.max(maxPeriod, condition.compareToIndicatorPeriod);
      }
    }
  };

  checkConditions(strategy.entryCondition.conditions);
  checkConditions(strategy.exitCondition.conditions);

  // Add buffer for MACD and other complex indicators
  return maxPeriod + 30;
}

/**
 * CPU-based backtest engine
 */
export class CPUBacktestEngine {
  private candles: Candle[];
  private config: BacktestConfig;
  private indicators: PreCalculatedIndicators;

  constructor(candles: Candle[], config: BacktestConfig) {
    this.candles = candles;
    this.config = config;
    this.indicators = preCalculateIndicators(candles);
  }

  /**
   * Run the backtest
   */
  run(): BacktestResult {
    const startTime = performance.now();

    logger.log('BACKTEST', '═══════════════════════════════════════', { level: 'info' });
    logger.log('BACKTEST', 'Starting backtest execution', { level: 'info', data: {
      candles: this.candles.length,
      symbol: this.config.environment.symbol,
      timeframe: this.config.environment.timeframe,
      initialCapital: this.config.environment.initialCapital,
    }});

    const { environment, strategy, moneyManagement } = this.config;
    const { initialCapital, feePreset, slippage } = environment;

    let cash = initialCapital;
    let position: Position | null = null;
    const trades: CompletedTrade[] = [];
    const equityCurve: EquityPoint[] = [];

    const warmupPeriod = calculateWarmupPeriod(strategy);

    logger.log('BACKTEST', `Warmup period: ${warmupPeriod} candles`, { level: 'debug' });
    logger.log('BACKTEST', `Starting main loop from candle ${warmupPeriod} to ${this.candles.length}`, { level: 'info' });

    // Main candle loop
    for (let i = warmupPeriod; i < this.candles.length; i++) {
      const candle = this.candles[i];
      const shouldLog = i % 100 === 0; // Log every 100th candle to avoid spam

      if (shouldLog) {
        logger.log('BACKTEST', `Processing candle ${i}/${this.candles.length} (${new Date(candle.time).toISOString()})`, {
          level: 'debug',
          data: { price: candle.close, volume: candle.volume }
        });
      }

      // Check existing position for stop loss / take profit / exit condition
      if (position) {
        const pnlPercent =
          position.direction === 'long'
            ? ((candle.close - position.entryPrice) / position.entryPrice) * 100
            : ((position.entryPrice - candle.close) / position.entryPrice) * 100;

        let shouldClose = false;
        let exitReason: 'stop_loss' | 'take_profit' | 'exit_condition' = 'exit_condition';

        // Check stop loss
        if (strategy.stopLoss.enabled && pnlPercent <= -strategy.stopLoss.percentage) {
          shouldClose = true;
          exitReason = 'stop_loss';
          logger.log('TRADE', `Stop loss triggered at ${candle.close} (PnL: ${pnlPercent.toFixed(2)}%)`, { level: 'warning' });
        }

        // Check take profit
        if (strategy.takeProfit.enabled && pnlPercent >= strategy.takeProfit.percentage) {
          shouldClose = true;
          exitReason = 'take_profit';
          logger.log('TRADE', `Take profit triggered at ${candle.close} (PnL: ${pnlPercent.toFixed(2)}%)`, { level: 'success' });
        }

        // Check exit condition
        if (!shouldClose && evaluateConditionGroup(strategy.exitCondition, this.indicators, this.candles, i, 'exit', true)) {
          shouldClose = true;
          exitReason = 'exit_condition';
        }

        if (shouldClose) {
          // Close position
          const exitFee =
            position.quantity * candle.close * ((feePreset.takerFee + slippage) / 100);
          const grossPnL =
            position.direction === 'long'
              ? (candle.close - position.entryPrice) * position.quantity
              : (position.entryPrice - candle.close) * position.quantity;
          const netPnL = grossPnL - exitFee;

          cash += position.quantity * candle.close - exitFee;

          const trade: CompletedTrade = {
            tradeId: trades.length + 1,
            entryTime: position.entryTime,
            entryPrice: position.entryPrice,
            exitTime: candle.time,
            exitPrice: candle.close,
            quantity: position.quantity,
            profitLoss: netPnL,
            profitLossPercent: (netPnL / (position.entryPrice * position.quantity)) * 100,
            entryFee: position.entryFee,
            exitFee,
            totalFee: position.entryFee + exitFee,
            duration: candle.time - position.entryTime,
            status: netPnL > 0 ? 'profit' : 'loss',
            exitReason,
          };

          trades.push(trade);
          logger.tradeAction('EXIT', candle.close, exitReason, netPnL);
          position = null;
        }
      }

      // Check entry condition (only if no position)
      if (!position && evaluateConditionGroup(strategy.entryCondition, this.indicators, this.candles, i, 'entry', true)) {
        // Calculate order size
        let orderAmount: number;
        if (moneyManagement.orderMode === 'percentOfBalance') {
          orderAmount = cash * (moneyManagement.orderSize.value / 100);
        } else {
          orderAmount = Math.min(moneyManagement.orderSize.value, cash);
        }

        // Apply leverage
        if (moneyManagement.leverageEnabled) {
          orderAmount *= moneyManagement.leverage;
        }

        // Calculate entry fee
        const entryFee = orderAmount * ((feePreset.takerFee + slippage) / 100);
        const quantity = (orderAmount - entryFee) / candle.close;

        if (quantity > 0) {
          position = {
            entryTime: candle.time,
            entryPrice: candle.close,
            quantity,
            entryFee,
            direction: moneyManagement.positionDirection === 'short' ? 'short' : 'long',
          };

          logger.tradeAction('ENTRY', candle.close, 'entry_condition', undefined);
          logger.log('TRADE', `Position size: ${quantity.toFixed(8)} (Cost: ${orderAmount.toFixed(2)} USDT, Fee: ${entryFee.toFixed(2)})`, { level: 'debug' });

          cash -= orderAmount;
        }
      }

      // Record equity
      const unrealizedPnL = position
        ? position.direction === 'long'
          ? (candle.close - position.entryPrice) * position.quantity
          : (position.entryPrice - candle.close) * position.quantity
        : 0;

      equityCurve.push({
        timestamp: candle.time,
        date: candle.date,
        equityValue: cash + (position ? position.quantity * candle.close : 0),
        cash,
        unrealizedPnL,
      });
    }

    // Close any remaining position at the end
    if (position) {
      const lastCandle = this.candles[this.candles.length - 1];
      const exitFee =
        position.quantity * lastCandle.close * ((feePreset.takerFee + slippage) / 100);
      const grossPnL =
        position.direction === 'long'
          ? (lastCandle.close - position.entryPrice) * position.quantity
          : (position.entryPrice - lastCandle.close) * position.quantity;
      const netPnL = grossPnL - exitFee;

      cash += position.quantity * lastCandle.close - exitFee;

      const trade: CompletedTrade = {
        tradeId: trades.length + 1,
        entryTime: position.entryTime,
        entryPrice: position.entryPrice,
        exitTime: lastCandle.time,
        exitPrice: lastCandle.close,
        quantity: position.quantity,
        profitLoss: netPnL,
        profitLossPercent: (netPnL / (position.entryPrice * position.quantity)) * 100,
        entryFee: position.entryFee,
        exitFee,
        totalFee: position.entryFee + exitFee,
        duration: lastCandle.time - position.entryTime,
        status: netPnL > 0 ? 'profit' : 'loss',
        exitReason: 'exit_condition',
      };

      trades.push(trade);
    }

    const executionTimeMs = performance.now() - startTime;
    const finalEquity = equityCurve.length > 0 ? equityCurve[equityCurve.length - 1].equityValue : initialCapital;

    // Calculate all metrics
    const summary = calculateSummary(
      initialCapital,
      finalEquity,
      trades,
      equityCurve,
      environment.initialCurrency
    );

    const stats = calculateDetailedStats(
      initialCapital,
      trades,
      equityCurve,
      environment.dateRange.startDate,
      environment.dateRange.endDate
    );

    const visualization = calculateVisualizationData(initialCapital, equityCurve, trades);

    logger.log('BACKTEST', '═══════════════════════════════════════', { level: 'info' });
    logger.log('BACKTEST', `Backtest completed in ${executionTimeMs.toFixed(2)}ms`, {
      level: 'success',
      data: {
        totalTrades: trades.length,
        finalEquity: summary.finalEquity.value,
        totalReturn: summary.totalReturn.formatted,
        winRate: summary.winRate.formatted,
      }
    });

    return {
      summary,
      stats,
      visualization,
      timestamp: Date.now(),
      executionTimeMs,
      config: this.config,
    };
  }

  /**
   * Update indicators cache (for when strategy parameters change)
   */
  updateIndicators(strategy: StrategyLogic) {
    // Ensure all required indicators are calculated
    const periods = new Set<{ indicator: string; period: number }>();

    const extractPeriods = (conditions: Condition[]) => {
      for (const condition of conditions) {
        if (condition.indicator && condition.indicatorPeriod) {
          periods.add({ indicator: condition.indicator, period: condition.indicatorPeriod });
        }
      }
    };

    extractPeriods(strategy.entryCondition.conditions);
    extractPeriods(strategy.exitCondition.conditions);

    for (const { indicator, period } of periods) {
      getIndicatorValue(this.indicators, this.candles, indicator, period, 0);
    }
  }
}

/**
 * Run a quick backtest with pre-calculated indicators
 * Optimized for slider tuning (< 100ms response time)
 */
export function runQuickBacktest(
  candles: Candle[],
  indicators: PreCalculatedIndicators,
  config: BacktestConfig
): BacktestResult {
  const engine = new CPUBacktestEngine(candles, config);
  // @ts-ignore - Access private property for optimization
  engine.indicators = indicators;
  return engine.run();
}

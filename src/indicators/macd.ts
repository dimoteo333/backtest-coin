import type { Candle } from '@/types';
import { calculateEMA } from './ma';

export interface MACDValue {
  macd: number;
  signal: number;
  histogram: number;
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * @param candles - Array of candle data
 * @param fastPeriod - Fast EMA period (default: 12)
 * @param slowPeriod - Slow EMA period (default: 26)
 * @param signalPeriod - Signal line EMA period (default: 9)
 * @returns Array of MACD values
 */
export function calculateMACD(
  candles: Candle[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDValue[] {
  const macdValues: MACDValue[] = new Array(candles.length).fill({
    macd: NaN,
    signal: NaN,
    histogram: NaN,
  });

  if (candles.length < slowPeriod + signalPeriod - 1) {
    return macdValues;
  }

  // Calculate EMAs
  const fastEMA = calculateEMA(candles, fastPeriod);
  const slowEMA = calculateEMA(candles, slowPeriod);

  // Calculate MACD line
  const macdLine: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (!isNaN(fastEMA[i]) && !isNaN(slowEMA[i])) {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    } else {
      macdLine.push(NaN);
    }
  }

  // Calculate Signal line (EMA of MACD line)
  const validMacdStart = slowPeriod - 1;
  const signalStart = validMacdStart + signalPeriod - 1;

  if (candles.length <= signalStart) {
    return macdValues;
  }

  // Calculate first signal value (SMA of first signalPeriod MACD values)
  let signalSum = 0;
  for (let i = validMacdStart; i < validMacdStart + signalPeriod; i++) {
    signalSum += macdLine[i];
  }
  let signal = signalSum / signalPeriod;

  const signalMultiplier = 2 / (signalPeriod + 1);

  // Set first complete MACD value
  macdValues[signalStart] = {
    macd: macdLine[signalStart],
    signal,
    histogram: macdLine[signalStart] - signal,
  };

  // Calculate subsequent values
  for (let i = signalStart + 1; i < candles.length; i++) {
    signal = (macdLine[i] - signal) * signalMultiplier + signal;
    macdValues[i] = {
      macd: macdLine[i],
      signal,
      histogram: macdLine[i] - signal,
    };
  }

  return macdValues;
}

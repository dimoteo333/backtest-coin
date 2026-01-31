import type { Candle } from '@/types';

/**
 * Calculate RSI (Relative Strength Index) for an array of candles
 * @param candles - Array of candle data
 * @param period - RSI period (default: 14)
 * @returns Array of RSI values (NaN for warmup period)
 */
export function calculateRSI(candles: Candle[], period: number = 14): number[] {
  const rsiValues: number[] = new Array(candles.length).fill(NaN);

  if (candles.length < period + 1) {
    return rsiValues;
  }

  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    changes.push(candles[i].close - candles[i - 1].close);
  }

  // Calculate initial average gain and loss
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i];
    } else {
      avgLoss += Math.abs(changes[i]);
    }
  }

  avgGain /= period;
  avgLoss /= period;

  // First RSI value
  if (avgLoss === 0) {
    rsiValues[period] = 100;
  } else {
    const rs = avgGain / avgLoss;
    rsiValues[period] = 100 - 100 / (1 + rs);
  }

  // Calculate subsequent RSI values using smoothed method
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      rsiValues[i + 1] = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsiValues[i + 1] = 100 - 100 / (1 + rs);
    }
  }

  return rsiValues;
}

/**
 * Calculate RSI value at a specific index (optimized for single lookups)
 * @param candles - Array of candle data up to and including current index
 * @param period - RSI period
 * @returns RSI value or NaN if not enough data
 */
export function calculateRSIAtIndex(candles: Candle[], period: number = 14): number {
  if (candles.length < period + 1) {
    return NaN;
  }

  // Calculate all changes
  const changes: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    changes.push(candles[i].close - candles[i - 1].close);
  }

  // Calculate initial average gain and loss
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i];
    } else {
      avgLoss += Math.abs(changes[i]);
    }
  }

  avgGain /= period;
  avgLoss /= period;

  // Calculate subsequent values using smoothed method
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) {
    return 100;
  }

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

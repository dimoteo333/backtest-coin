import type { Candle } from '@/types';
import { calculateSMA } from './ma';

export interface BollingerBandValue {
  upper: number;
  middle: number;
  lower: number;
}

/**
 * Calculate Bollinger Bands
 * @param candles - Array of candle data
 * @param period - Period for SMA and standard deviation (default: 20)
 * @param stdDevMultiplier - Standard deviation multiplier (default: 2)
 * @returns Array of Bollinger Band values
 */
export function calculateBollingerBands(
  candles: Candle[],
  period: number = 20,
  stdDevMultiplier: number = 2
): BollingerBandValue[] {
  const bbValues: BollingerBandValue[] = new Array(candles.length).fill({
    upper: NaN,
    middle: NaN,
    lower: NaN,
  });

  if (candles.length < period) {
    return bbValues;
  }

  // Calculate SMA (middle band)
  const sma = calculateSMA(candles, period);

  // Calculate standard deviation and bands
  for (let i = period - 1; i < candles.length; i++) {
    const middle = sma[i];

    // Calculate standard deviation
    let sumSquaredDiff = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = candles[j].close - middle;
      sumSquaredDiff += diff * diff;
    }
    const stdDev = Math.sqrt(sumSquaredDiff / period);

    bbValues[i] = {
      upper: middle + stdDevMultiplier * stdDev,
      middle,
      lower: middle - stdDevMultiplier * stdDev,
    };
  }

  return bbValues;
}

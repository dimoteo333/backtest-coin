import type { Candle } from '@/types';

/**
 * Calculate Simple Moving Average (SMA) for an array of candles
 * @param candles - Array of candle data
 * @param period - SMA period
 * @returns Array of SMA values (NaN for warmup period)
 */
export function calculateSMA(candles: Candle[], period: number): number[] {
  const smaValues: number[] = new Array(candles.length).fill(NaN);

  if (candles.length < period) {
    return smaValues;
  }

  // Calculate first SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  smaValues[period - 1] = sum / period;

  // Calculate subsequent SMA values using sliding window
  for (let i = period; i < candles.length; i++) {
    sum = sum - candles[i - period].close + candles[i].close;
    smaValues[i] = sum / period;
  }

  return smaValues;
}

/**
 * Calculate Exponential Moving Average (EMA) for an array of candles
 * @param candles - Array of candle data
 * @param period - EMA period
 * @returns Array of EMA values (NaN for warmup period)
 */
export function calculateEMA(candles: Candle[], period: number): number[] {
  const emaValues: number[] = new Array(candles.length).fill(NaN);

  if (candles.length < period) {
    return emaValues;
  }

  // Multiplier for EMA
  const multiplier = 2 / (period + 1);

  // First EMA is SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  emaValues[period - 1] = sum / period;

  // Calculate subsequent EMA values
  for (let i = period; i < candles.length; i++) {
    emaValues[i] =
      (candles[i].close - emaValues[i - 1]) * multiplier + emaValues[i - 1];
  }

  return emaValues;
}

/**
 * Calculate SMA value at a specific index
 * @param candles - Array of candle data up to and including current index
 * @param period - SMA period
 * @returns SMA value or NaN if not enough data
 */
export function calculateSMAAtIndex(candles: Candle[], period: number): number {
  if (candles.length < period) {
    return NaN;
  }

  let sum = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    sum += candles[i].close;
  }
  return sum / period;
}

/**
 * Calculate EMA value at a specific index
 * @param candles - Array of candle data up to and including current index
 * @param period - EMA period
 * @returns EMA value or NaN if not enough data
 */
export function calculateEMAAtIndex(candles: Candle[], period: number): number {
  if (candles.length < period) {
    return NaN;
  }

  const multiplier = 2 / (period + 1);

  // Start with SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  let ema = sum / period;

  // Apply EMA formula for remaining candles
  for (let i = period; i < candles.length; i++) {
    ema = (candles[i].close - ema) * multiplier + ema;
  }

  return ema;
}

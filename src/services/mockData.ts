import type { Candle } from '@/types';

/**
 * Generate realistic mock candle data for testing
 * Uses random walk with trend and volatility
 */
export function generateMockCandles(
  symbol: string,
  startDate: string,
  endDate: string,
  timeframeMs: number = 60 * 60 * 1000 // 1 hour default
): Candle[] {
  const candles: Candle[] = [];
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  // Initial price based on symbol
  let basePrice: number;
  switch (symbol) {
    case 'BTCUSDT':
      basePrice = 42000;
      break;
    case 'ETHUSDT':
      basePrice = 2500;
      break;
    case 'BNBUSDT':
      basePrice = 300;
      break;
    case 'SOLUSDT':
      basePrice = 100;
      break;
    default:
      basePrice = 100;
  }

  let currentPrice = basePrice;
  const volatility = 0.015; // 1.5% daily volatility
  const trendStrength = 0.0001; // Slight upward trend

  for (let timestamp = start; timestamp <= end; timestamp += timeframeMs) {
    // Random walk with mean reversion
    const randomChange = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    const trendChange = trendStrength * currentPrice;
    const meanReversionChange = (basePrice - currentPrice) * 0.001;

    const open = currentPrice;
    currentPrice = currentPrice + randomChange + trendChange + meanReversionChange;
    currentPrice = Math.max(currentPrice, basePrice * 0.5); // Don't go below 50% of base
    currentPrice = Math.min(currentPrice, basePrice * 2); // Don't go above 200% of base

    // Generate high, low based on open/close
    const close = currentPrice;
    const range = Math.abs(close - open) + Math.random() * volatility * open;
    const high = Math.max(open, close) + Math.random() * range * 0.5;
    const low = Math.min(open, close) - Math.random() * range * 0.5;

    // Random volume
    const volume = basePrice * (1000 + Math.random() * 5000);

    candles.push({
      time: timestamp,
      date: new Date(timestamp).toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: parseFloat(volume.toFixed(2)),
    });
  }

  return candles;
}

/**
 * Get timeframe in milliseconds
 */
export function getTimeframeMs(timeframe: string): number {
  switch (timeframe) {
    case '1m':
      return 60 * 1000;
    case '5m':
      return 5 * 60 * 1000;
    case '15m':
      return 15 * 60 * 1000;
    case '1h':
      return 60 * 60 * 1000;
    case '4h':
      return 4 * 60 * 60 * 1000;
    case '1d':
      return 24 * 60 * 60 * 1000;
    case '1w':
      return 7 * 24 * 60 * 60 * 1000;
    case '1M':
      return 30 * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
}

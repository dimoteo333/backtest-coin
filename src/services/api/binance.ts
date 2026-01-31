import type { Candle } from '@/types';
import type { Timeframe } from '@/types/environment';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';
const MAX_CANDLES_PER_REQUEST = 1000;
const RATE_LIMIT_DELAY = 100; // ms between requests

/**
 * Convert our timeframe format to Binance interval format
 */
function toBinanceInterval(timeframe: Timeframe): string {
  const mapping: Record<Timeframe, string> = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '4h': '4h',
    '1d': '1d',
    '1w': '1w',
    '1M': '1M',
  };
  return mapping[timeframe] || '1h';
}

/**
 * Get timeframe in milliseconds
 */
function getTimeframeMs(timeframe: Timeframe): number {
  const mapping: Record<Timeframe, number> = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000,
  };
  return mapping[timeframe] || 60 * 60 * 1000;
}

/**
 * Parse Binance kline data to our Candle format
 */
function parseKline(kline: (string | number)[]): Candle {
  const timestamp = kline[0] as number;
  return {
    time: timestamp,
    date: new Date(timestamp).toISOString().split('T')[0],
    open: parseFloat(kline[1] as string),
    high: parseFloat(kline[2] as string),
    low: parseFloat(kline[3] as string),
    close: parseFloat(kline[4] as string),
    volume: parseFloat(kline[5] as string),
  };
}

/**
 * Fetch a batch of klines from Binance API
 * @param symbol - Trading pair (e.g., "BTCUSDT")
 * @param interval - Candle interval
 * @param startTime - Start timestamp in ms
 * @param endTime - End timestamp in ms
 * @param limit - Number of candles (max 1000)
 */
export async function fetchKlines(
  symbol: string,
  interval: Timeframe,
  startTime?: number,
  endTime?: number,
  limit: number = MAX_CANDLES_PER_REQUEST
): Promise<Candle[]> {
  const params = new URLSearchParams({
    symbol: symbol.toUpperCase(),
    interval: toBinanceInterval(interval),
    limit: Math.min(limit, MAX_CANDLES_PER_REQUEST).toString(),
  });

  if (startTime) {
    params.append('startTime', startTime.toString());
  }
  if (endTime) {
    params.append('endTime', endTime.toString());
  }

  const response = await fetch(`${BINANCE_API_BASE}/klines?${params}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ msg: 'Unknown error' }));
    throw new Error(`Binance API error: ${error.msg || response.statusText}`);
  }

  const data: (string | number)[][] = await response.json();
  return data.map(parseKline);
}

/**
 * Fetch all klines for a date range (handles pagination)
 * @param symbol - Trading pair
 * @param interval - Candle interval
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @param onProgress - Progress callback (0-100)
 */
export async function fetchAllKlines(
  symbol: string,
  interval: Timeframe,
  startDate: string,
  endDate: string,
  onProgress?: (progress: number) => void
): Promise<Candle[]> {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime() + 24 * 60 * 60 * 1000; // Include end date
  const timeframeMs = getTimeframeMs(interval);

  const allCandles: Candle[] = [];
  let currentStartTime = startTime;
  let totalExpected = Math.ceil((endTime - startTime) / timeframeMs);
  let fetched = 0;

  while (currentStartTime < endTime) {
    const candles = await fetchKlines(
      symbol,
      interval,
      currentStartTime,
      endTime,
      MAX_CANDLES_PER_REQUEST
    );

    if (candles.length === 0) {
      break;
    }

    allCandles.push(...candles);
    fetched += candles.length;

    // Update progress
    if (onProgress) {
      const progress = Math.min(100, Math.round((fetched / totalExpected) * 100));
      onProgress(progress);
    }

    // Move to next batch
    const lastCandleTime = candles[candles.length - 1].time;
    currentStartTime = lastCandleTime + timeframeMs;

    // Rate limiting
    if (currentStartTime < endTime) {
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
  }

  // Remove duplicates and sort by time
  const uniqueCandles = Array.from(
    new Map(allCandles.map((c) => [c.time, c])).values()
  ).sort((a, b) => a.time - b.time);

  return uniqueCandles;
}

/**
 * Get available trading pairs from Binance
 */
export async function getExchangeInfo(): Promise<{ symbol: string; baseAsset: string; quoteAsset: string }[]> {
  const response = await fetch(`${BINANCE_API_BASE}/exchangeInfo`);

  if (!response.ok) {
    throw new Error('Failed to fetch exchange info');
  }

  const data = await response.json();

  // Filter to USDT pairs only for simplicity
  return data.symbols
    .filter((s: { quoteAsset: string; status: string }) =>
      s.quoteAsset === 'USDT' && s.status === 'TRADING'
    )
    .map((s: { symbol: string; baseAsset: string; quoteAsset: string }) => ({
      symbol: s.symbol,
      baseAsset: s.baseAsset,
      quoteAsset: s.quoteAsset,
    }));
}

/**
 * Get the current price for a symbol
 */
export async function getCurrentPrice(symbol: string): Promise<number> {
  const response = await fetch(`${BINANCE_API_BASE}/ticker/price?symbol=${symbol.toUpperCase()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch current price');
  }

  const data = await response.json();
  return parseFloat(data.price);
}

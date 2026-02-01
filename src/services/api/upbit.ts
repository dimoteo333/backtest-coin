
import type { Candle } from '@/types';
import type { Timeframe } from '@/types/environment';

const UPBIT_API_BASE = 'https://api.upbit.com/v1';
const MAX_CANDLES_PER_REQUEST = 200; // Upbit limit
const RATE_LIMIT_DELAY = 100; // ms between requests

/**
 * Convert our timeframe format to Upbit minute interval or unit
 */
function toUpbitInterval(timeframe: Timeframe): { unit: string; minutes?: number } {
  switch (timeframe) {
    case '1m': return { unit: 'minutes', minutes: 1 };
    case '5m': return { unit: 'minutes', minutes: 5 };
    case '15m': return { unit: 'minutes', minutes: 15 };
    case '1h': return { unit: 'minutes', minutes: 60 };
    case '4h': return { unit: 'minutes', minutes: 240 };
    case '1d': return { unit: 'days' };
    case '1w': return { unit: 'weeks' };
    case '1M': return { unit: 'months' };
    default: return { unit: 'days' }; // Default to daily
  }
}

/**
 * Get timeframe in milliseconds (Reuse logic or import from util)
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
 * Parse Upbit candle data to our Candle format
 */
function parseUpbitCandle(candle: any): Candle {
  // Upbit returns candle_date_time_utc as "2023-01-01T00:00:00"
  // timestamp is also available as 'timestamp' (ms) but for consistency let's use UTC string
  const time = new Date(candle.candle_date_time_utc + 'Z').getTime();
  
  return {
    time,
    date: candle.candle_date_time_utc.split('T')[0],
    open: candle.opening_price,
    high: candle.high_price,
    low: candle.low_price,
    close: candle.trade_price,
    volume: candle.candle_acc_trade_volume,
  };
}

/**
 * Fetch a batch of candles from Upbit API
 * @param symbol - Market (e.g., "KRW-BTC")
 * @param timeframe - Timeframe
 * @param to - Last candle time (ISO string) to fetch *before* (exclusive/inclusive depends on API, Upbit is "to")
 * @param count - Number of candles (max 200)
 */
async function fetchUpbitKlines(
  symbol: string,
  timeframe: Timeframe,
  to?: string,
  count: number = MAX_CANDLES_PER_REQUEST
): Promise<Candle[]> {
  const { unit, minutes } = toUpbitInterval(timeframe);
  
  let url = `${UPBIT_API_BASE}/candles/${unit}`;
  if (unit === 'minutes' && minutes) {
    url += `/${minutes}`;
  }

  const params = new URLSearchParams({
    market: symbol.toUpperCase(),
    count: Math.min(count, MAX_CANDLES_PER_REQUEST).toString(),
  });

  if (to) {
    params.append('to', to);
  }

  const response = await fetch(`${url}?${params}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(`Upbit API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  // Upbit returns data in reverse chronological order (newest first). 
  // We need to reverse it to be chronological (oldest first) if we want to append easier, 
  // but let's parse first.
  return data.map(parseUpbitCandle);
}

/**
 * Fetch all klines for a date range (handles pagination)
 * Note: Upbit API pagination uses 'to' (fetch candles BEFORE this date). 
 * So we iterate backwards from endDate to startDate.
 */
export async function fetchAllUpbitKlines(
  symbol: string,
  interval: Timeframe,
  startDate: string,
  endDate: string,
  onProgress?: (progress: number) => void
): Promise<Candle[]> {
  const targetStartTime = new Date(startDate).getTime();
  // Upbit 'to' is exclusive/inclusive? Actually it retrieves candles *ending* at or before 'to'.
  // We start fetching from the end of our range.
  // Add 1 day to endDate to cover the full last day if daily, or just use precise time.
  // Let's use endDate + 1 day roughly or set time to 23:59:59? 
  // Safest is to just pass the next day's 00:00:00Z or simply ISO string of fetch time.
  // We want data UP TO endDate.
  
  // Format endDate to ISO string for 'to' param. 
  // Example: endDate = "2023-12-31". efficient 'to' would be "2024-01-01T00:00:00Z"
  const endDateTime = new Date(endDate);
  endDateTime.setDate(endDateTime.getDate() + 1); 
  
  let currentTo: string | undefined = endDateTime.toISOString(); 
  
  const allCandles: Candle[] = [];
  const totalDuration = endDateTime.getTime() - targetStartTime;
  
  // We fetch backwards
  while (true) {
    const candles = await fetchUpbitKlines(
      symbol,
      interval,
      currentTo,
      MAX_CANDLES_PER_REQUEST
    );

    if (candles.length === 0) {
      break;
    }

    // Newest candles come first in response [0: newest, ..., 199: oldest]
    // Filter candles that are older than startDate
    const validCandles = candles.filter(c => c.time >= targetStartTime);
    
    // Add to our collection. Since we fetch backwards (newest chunks first), 
    // we should prepend or append? 
    // We are collecting chunks: [Dec], [Nov], [Oct]...
    // So we push `validCandles` (which are sorted New->Old by Upbit) to a list, 
    // then flat and reverse at the end?
    // Or just push ...validCandles and sort by time later.
    allCandles.push(...validCandles);

    // Calculate progress (based on time covered)
    const oldestFetchedTime = candles[candles.length - 1].time;
    const timeCovered = endDateTime.getTime() - oldestFetchedTime;
    if (onProgress) {
      const progress = Math.min(100, Math.round((timeCovered / totalDuration) * 100));
      onProgress(progress);
    }

    // If we reached startDate or no more candles
    if (oldestFetchedTime <= targetStartTime || validCandles.length < candles.length) {
      break;
    }

    // Prepare 'to' for next batch. 
    // Next batch should end before the oldest candle we just got.
    // Upbit API 'to' format: ISO string.
    // We use the time of the oldest candle we received.
    currentTo = new Date(oldestFetchedTime).toISOString();

    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
  }

  // Sort by time ascending (Old -> New)
  const uniqueCandles = Array.from(
    new Map(allCandles.map((c) => [c.time, c])).values()
  ).sort((a, b) => a.time - b.time);

  return uniqueCandles;
}

/**
 * Get available trading pairs from Upbit (KRW market only for MVP?)
 */
export async function getUpbitExchangeInfo(): Promise<{ symbol: string; baseAsset: string; quoteAsset: string }[]> {
  const response = await fetch(`${UPBIT_API_BASE}/market/all?isDetails=false`);

  if (!response.ok) {
    throw new Error('Failed to fetch Upbit exchange info');
  }

  const data = await response.json();

  // Filter to KRW or USDT markets? 
  // Let's support KRW and USDT if available.
  // Upbit Symbol: "KRW-BTC" -> Quote: KRW, Base: BTC
  return data
    .map((m: { market: string; korean_name: string; english_name: string }) => {
      const [quote, base] = m.market.split('-');
      return {
        symbol: m.market, // "KRW-BTC"
        baseAsset: base,
        quoteAsset: quote,
        name: m.korean_name
      };
    });
}

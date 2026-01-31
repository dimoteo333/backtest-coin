import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Candle } from '@/types';
import type { Timeframe } from '@/types/environment';

interface CandleDBSchema extends DBSchema {
  candles: {
    key: string; // symbol:timeframe:timestamp
    value: Candle;
    indexes: {
      'by-symbol-timeframe': [string, string];
      'by-timestamp': number;
    };
  };
  metadata: {
    key: string; // symbol:timeframe
    value: {
      symbol: string;
      timeframe: Timeframe;
      lastUpdated: number;
      startTime: number;
      endTime: number;
      count: number;
    };
  };
}

const DB_NAME = 'backtest-coin-cache';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<CandleDBSchema> | null = null;

/**
 * Get or create the database instance
 */
async function getDB(): Promise<IDBPDatabase<CandleDBSchema>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<CandleDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Candles store
      const candlesStore = db.createObjectStore('candles', {
        keyPath: 'key',
      });
      candlesStore.createIndex('by-symbol-timeframe', ['symbol', 'timeframe']);
      candlesStore.createIndex('by-timestamp', 'time');

      // Metadata store
      db.createObjectStore('metadata');
    },
  });

  return dbInstance;
}

/**
 * Generate a unique key for a candle
 */
function getCandleKey(symbol: string, timeframe: Timeframe, timestamp: number): string {
  return `${symbol}:${timeframe}:${timestamp}`;
}

/**
 * Generate a metadata key
 */
function getMetadataKey(symbol: string, timeframe: Timeframe): string {
  return `${symbol}:${timeframe}`;
}

/**
 * Store candles in IndexedDB
 */
export async function cacheCandles(
  symbol: string,
  timeframe: Timeframe,
  candles: Candle[]
): Promise<void> {
  if (candles.length === 0) return;

  const db = await getDB();
  const tx = db.transaction(['candles', 'metadata'], 'readwrite');

  // Add candles
  const candlesStore = tx.objectStore('candles');
  for (const candle of candles) {
    const key = getCandleKey(symbol, timeframe, candle.time);
    await candlesStore.put({ ...candle, key, symbol, timeframe } as Candle & { key: string; symbol: string; timeframe: string });
  }

  // Update metadata
  const metadataStore = tx.objectStore('metadata');
  const metadataKey = getMetadataKey(symbol, timeframe);
  const existingMetadata = await metadataStore.get(metadataKey);

  const sortedCandles = [...candles].sort((a, b) => a.time - b.time);
  const startTime = sortedCandles[0].time;
  const endTime = sortedCandles[sortedCandles.length - 1].time;

  const newMetadata = {
    symbol,
    timeframe,
    lastUpdated: Date.now(),
    startTime: existingMetadata ? Math.min(existingMetadata.startTime, startTime) : startTime,
    endTime: existingMetadata ? Math.max(existingMetadata.endTime, endTime) : endTime,
    count: existingMetadata ? existingMetadata.count + candles.length : candles.length,
  };

  await metadataStore.put(newMetadata, metadataKey);
  await tx.done;
}

/**
 * Retrieve candles from IndexedDB
 */
export async function getCachedCandles(
  symbol: string,
  timeframe: Timeframe,
  startTime: number,
  endTime: number
): Promise<Candle[]> {
  const db = await getDB();
  const tx = db.transaction('candles', 'readonly');
  const store = tx.objectStore('candles');

  const candles: Candle[] = [];

  // Iterate through all candles and filter by time range
  let cursor = await store.openCursor();
  while (cursor) {
    const value = cursor.value as Candle & { key: string; symbol: string; timeframe: string };
    if (
      value.symbol === symbol &&
      value.timeframe === timeframe &&
      value.time >= startTime &&
      value.time <= endTime
    ) {
      // Remove the extra properties before returning
      const { key, symbol: s, timeframe: t, ...candle } = value;
      candles.push(candle);
    }
    cursor = await cursor.continue();
  }

  return candles.sort((a, b) => a.time - b.time);
}

/**
 * Get cached data metadata
 */
export async function getCacheMetadata(
  symbol: string,
  timeframe: Timeframe
): Promise<{ startTime: number; endTime: number; lastUpdated: number } | null> {
  const db = await getDB();
  const metadata = await db.get('metadata', getMetadataKey(symbol, timeframe));

  if (!metadata) {
    return null;
  }

  return {
    startTime: metadata.startTime,
    endTime: metadata.endTime,
    lastUpdated: metadata.lastUpdated,
  };
}

/**
 * Find missing time ranges in cache
 */
export async function findMissingRanges(
  symbol: string,
  timeframe: Timeframe,
  requestedStart: number,
  requestedEnd: number,
  timeframeMs: number
): Promise<Array<{ start: number; end: number }>> {
  const cachedCandles = await getCachedCandles(symbol, timeframe, requestedStart, requestedEnd);

  if (cachedCandles.length === 0) {
    return [{ start: requestedStart, end: requestedEnd }];
  }

  const missingRanges: Array<{ start: number; end: number }> = [];
  const cachedTimes = new Set(cachedCandles.map((c) => c.time));

  let rangeStart: number | null = null;

  for (let time = requestedStart; time <= requestedEnd; time += timeframeMs) {
    if (!cachedTimes.has(time)) {
      if (rangeStart === null) {
        rangeStart = time;
      }
    } else if (rangeStart !== null) {
      missingRanges.push({ start: rangeStart, end: time - timeframeMs });
      rangeStart = null;
    }
  }

  // Handle case where the last range extends to the end
  if (rangeStart !== null) {
    missingRanges.push({ start: rangeStart, end: requestedEnd });
  }

  return missingRanges;
}

/**
 * Clear all cached data for a symbol/timeframe
 */
export async function clearCache(symbol?: string, timeframe?: Timeframe): Promise<void> {
  const db = await getDB();

  if (symbol && timeframe) {
    // Clear specific symbol/timeframe
    const tx = db.transaction(['candles', 'metadata'], 'readwrite');
    const candlesStore = tx.objectStore('candles');
    const metadataStore = tx.objectStore('metadata');

    let cursor = await candlesStore.openCursor();
    while (cursor) {
      const value = cursor.value as Candle & { symbol: string; timeframe: string };
      if (value.symbol === symbol && value.timeframe === timeframe) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }

    await metadataStore.delete(getMetadataKey(symbol, timeframe));
    await tx.done;
  } else {
    // Clear all
    const tx = db.transaction(['candles', 'metadata'], 'readwrite');
    await tx.objectStore('candles').clear();
    await tx.objectStore('metadata').clear();
    await tx.done;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalCandles: number;
  symbols: Array<{ symbol: string; timeframe: Timeframe; count: number; lastUpdated: number }>;
}> {
  const db = await getDB();

  const metadataStore = db.transaction('metadata', 'readonly').objectStore('metadata');
  const allMetadata = await metadataStore.getAll();

  return {
    totalCandles: allMetadata.reduce((sum, m) => sum + m.count, 0),
    symbols: allMetadata.map((m) => ({
      symbol: m.symbol,
      timeframe: m.timeframe,
      count: m.count,
      lastUpdated: m.lastUpdated,
    })),
  };
}

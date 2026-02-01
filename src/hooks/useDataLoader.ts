'use client';

import { useState, useCallback } from 'react';
import { useResultsStore } from '@/stores';
import { fetchAllKlines } from '@/services/api/binance';
import { fetchAllUpbitKlines } from '@/services/api/upbit';
import { cacheCandles, getCachedCandles, getCacheMetadata } from '@/services/cache/indexedDB';
import { generateMockCandles, getTimeframeMs } from '@/services/mockData';
import { logger } from '@/lib/debug-logger';
import type { Timeframe } from '@/types/environment';

export type DataSource = 'binance' | 'upbit' | 'mock';

interface UseDataLoaderOptions {
  source?: DataSource;
}

export function useDataLoader({ source = 'mock' }: UseDataLoaderOptions = {}) {
  const { setCandles, setCandlesLoading } = useResultsStore();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (
      symbol: string,
      timeframe: Timeframe,
      startDate: string,
      endDate: string
    ) => {
      setCandlesLoading(true);
      setError(null);
      setProgress(0);

      try {
        logger.log('DATA_LOADER', `Starting data load: ${source.toUpperCase()} - ${symbol} ${timeframe}`, {
          level: 'info',
          data: { symbol, timeframe, startDate, endDate },
        });

        if (source === 'mock') {
          // Use mock data
          logger.log('DATA_LOADER', 'Generating mock data...', { level: 'debug' });
          await new Promise((resolve) => setTimeout(resolve, 300));
          const mockCandles = generateMockCandles(
            symbol,
            startDate,
            endDate,
            getTimeframeMs(timeframe)
          );
          setCandles(mockCandles);
          setProgress(100);

          logger.dataReceived('MOCK', mockCandles.length, {
            firstCandle: mockCandles[0]?.date,
            lastCandle: mockCandles[mockCandles.length - 1]?.date,
          });
        } else {
          // Try to get cached data first (shared cache for same symbol)
          // Note: Symbol format might differ per exchange (BTC/USDT vs KRW-BTC), 
          // so cache key handles separation naturally.
          const startTime = new Date(startDate).getTime();
          const endTime = new Date(endDate).getTime() + 24 * 60 * 60 * 1000;

          const cacheMetadata = await getCacheMetadata(symbol, timeframe);

          // Check if cache covers the requested range
          if (
            cacheMetadata &&
            cacheMetadata.startTime <= startTime &&
            cacheMetadata.endTime >= endTime
          ) {
            // Use cached data
            logger.log('DATA_LOADER', 'Cache hit - loading from IndexedDB', { level: 'debug' });
            const cachedCandles = await getCachedCandles(symbol, timeframe, startTime, endTime);
            if (cachedCandles.length > 0) {
              setCandles(cachedCandles);
              setProgress(100);
              setCandlesLoading(false);

              logger.dataReceived('CACHE', cachedCandles.length, {
                firstCandle: new Date(cachedCandles[0]?.time).toISOString(),
                lastCandle: new Date(cachedCandles[cachedCandles.length - 1]?.time).toISOString(),
              });
              return;
            }
          }

          // Fetch from API
          logger.log('DATA_LOADER', `Cache miss - fetching from ${source.toUpperCase()} API`, { level: 'info' });
          
          let candles;
          if (source === 'upbit') {
             candles = await fetchAllUpbitKlines(
              symbol,
              timeframe,
              startDate,
              endDate,
              setProgress
            );
          } else {
             // Default to Binance
             candles = await fetchAllKlines(
              symbol,
              timeframe,
              startDate,
              endDate,
              setProgress
            );
          }

          logger.dataReceived(source.toUpperCase(), candles.length, {
            firstCandle: new Date(candles[0]?.time).toISOString(),
            lastCandle: new Date(candles[candles.length - 1]?.time).toISOString(),
            priceRange: {
              high: Math.max(...candles.map(c => c.high)),
              low: Math.min(...candles.map(c => c.low)),
            },
          });

          // Cache the data
          logger.log('DATA_LOADER', 'Caching data to IndexedDB', { level: 'debug' });
          await cacheCandles(symbol, timeframe, candles);

          setCandles(candles);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load data';
        setError(message);

        logger.error('DATA_LOADER', `Failed to load data: ${message}`, err instanceof Error ? err : undefined);

        // Fall back to mock data on error
        logger.log('DATA_LOADER', 'Falling back to mock data', { level: 'warning' });
        const mockCandles = generateMockCandles(
          symbol,
          startDate,
          endDate,
          getTimeframeMs(timeframe)
        );
        setCandles(mockCandles);

        logger.dataReceived('MOCK (Fallback)', mockCandles.length);
      } finally {
        setCandlesLoading(false);
        logger.log('DATA_LOADER', 'Data loading complete', { level: 'success' });
      }
    },
    [source, setCandles, setCandlesLoading]
  );

  return {
    loadData,
    progress,
    error,
  };
}

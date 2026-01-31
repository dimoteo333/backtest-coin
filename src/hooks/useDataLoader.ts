'use client';

import { useState, useCallback } from 'react';
import { useResultsStore } from '@/stores';
import { fetchAllKlines } from '@/services/api/binance';
import { cacheCandles, getCachedCandles, getCacheMetadata } from '@/services/cache/indexedDB';
import { generateMockCandles, getTimeframeMs } from '@/services/mockData';
import type { Timeframe } from '@/types/environment';

export type DataSource = 'binance' | 'mock';

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
        if (source === 'mock') {
          // Use mock data
          await new Promise((resolve) => setTimeout(resolve, 300));
          const mockCandles = generateMockCandles(
            symbol,
            startDate,
            endDate,
            getTimeframeMs(timeframe)
          );
          setCandles(mockCandles);
          setProgress(100);
        } else {
          // Try to get cached data first
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
            const cachedCandles = await getCachedCandles(symbol, timeframe, startTime, endTime);
            if (cachedCandles.length > 0) {
              setCandles(cachedCandles);
              setProgress(100);
              setCandlesLoading(false);
              return;
            }
          }

          // Fetch from Binance
          const candles = await fetchAllKlines(
            symbol,
            timeframe,
            startDate,
            endDate,
            setProgress
          );

          // Cache the data
          await cacheCandles(symbol, timeframe, candles);

          setCandles(candles);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load data';
        setError(message);

        // Fall back to mock data on error
        const mockCandles = generateMockCandles(
          symbol,
          startDate,
          endDate,
          getTimeframeMs(timeframe)
        );
        setCandles(mockCandles);
      } finally {
        setCandlesLoading(false);
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

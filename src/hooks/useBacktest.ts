'use client';

import { useEffect, useMemo, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useEnvironmentStore, useStrategyStore, useMoneyManagementStore, useResultsStore } from '@/stores';
import { CPUBacktestEngine, preCalculateIndicators, runQuickBacktest, type BacktestConfig } from '@/services/backtest';
import { logger } from '@/lib/debug-logger';
import type { Candle, PreCalculatedIndicators } from '@/types';

/**
 * Hook to run backtests with optimized performance
 * Supports real-time slider tuning with < 100ms response time
 */
export function useBacktest() {
  const environment = useEnvironmentStore((state) => state.environment);
  const strategy = useStrategyStore((state) => state.strategy);
  const moneyManagement = useMoneyManagementStore((state) => state.moneyManagement);
  const { candles, setResult, setLoading, setError } = useResultsStore();

  // Debounce strategy changes for slider tuning
  const debouncedStrategy = useDebounce(strategy, 50);

  // Pre-calculate indicators when candles change (expensive operation, done once)
  const indicatorsRef = useRef<PreCalculatedIndicators | null>(null);

  const preCalculatedIndicators = useMemo(() => {
    if (candles.length === 0) return null;
    indicatorsRef.current = preCalculateIndicators(candles);
    return indicatorsRef.current;
  }, [candles]);

  // Run backtest when inputs change
  const runBacktest = useCallback(() => {
    if (candles.length === 0) {
      logger.error('BACKTEST_HOOK', 'No candle data available');
      setError('No candle data available. Please load data first.');
      return;
    }

    if (!preCalculatedIndicators) {
      logger.error('BACKTEST_HOOK', 'Indicators not calculated yet');
      setError('Indicators not calculated yet.');
      return;
    }

    logger.log('BACKTEST_HOOK', 'Starting backtest run', { level: 'info' });
    setLoading(true);

    // Use setTimeout to allow UI to update loading state and prevent thread blocking
    setTimeout(() => {
      try {
        const config: BacktestConfig = {
          environment,
          strategy: debouncedStrategy,
          moneyManagement,
        };

        logger.log('BACKTEST_HOOK', 'Creating backtest engine', { level: 'debug', data: {
          candles: candles.length,
          strategy: debouncedStrategy,
        }});

        const result = runQuickBacktest(candles, preCalculatedIndicators!, config);

        logger.log('BACKTEST_HOOK', 'Backtest completed successfully', { level: 'success', data: result.summary as unknown as Record<string, unknown> });
        setResult(result);
      } catch (err) {
        logger.error('BACKTEST_HOOK', 'Backtest failed', err instanceof Error ? err : undefined);
        setError(err instanceof Error ? err.message : 'Backtest failed');
      }
    }, 100);
  }, [candles, environment, debouncedStrategy, moneyManagement, preCalculatedIndicators, setResult, setLoading, setError]);

  // Auto-run backtest when debounced inputs change
  useEffect(() => {
    if (candles.length > 0 && preCalculatedIndicators) {
      runBacktest();
    }
  }, [candles, debouncedStrategy, environment, moneyManagement, runBacktest, preCalculatedIndicators]);

  return {
    runBacktest,
    isReady: candles.length > 0 && preCalculatedIndicators !== null,
  };
}

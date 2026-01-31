'use client';

import { useEffect, useMemo, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { useEnvironmentStore, useStrategyStore, useMoneyManagementStore, useResultsStore } from '@/stores';
import { CPUBacktestEngine, preCalculateIndicators, type BacktestConfig } from '@/services/backtest';
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
      setError('No candle data available. Please load data first.');
      return;
    }

    if (!preCalculatedIndicators) {
      setError('Indicators not calculated yet.');
      return;
    }

    setLoading(true);

    try {
      const config: BacktestConfig = {
        environment,
        strategy: debouncedStrategy,
        moneyManagement,
      };

      const engine = new CPUBacktestEngine(candles, config);
      const result = engine.run();

      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backtest failed');
    }
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

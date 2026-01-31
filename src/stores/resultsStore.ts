import { create } from 'zustand';
import type { BacktestResult } from '@/types/results';
import type { Candle } from '@/types/candle';
import { EMPTY_RESULT } from '@/types/results';

interface ResultsState {
  result: BacktestResult | null;
  isLoading: boolean;
  error: string | null;
  candles: Candle[];
  candlesLoading: boolean;
  setResult: (result: BacktestResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCandles: (candles: Candle[]) => void;
  setCandlesLoading: (loading: boolean) => void;
  clearResult: () => void;
}

export const useResultsStore = create<ResultsState>((set) => ({
  result: null,
  isLoading: false,
  error: null,
  candles: [],
  candlesLoading: false,

  setResult: (result) =>
    set({
      result,
      isLoading: false,
      error: null,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  setCandles: (candles) =>
    set({
      candles,
      candlesLoading: false,
    }),

  setCandlesLoading: (loading) =>
    set({
      candlesLoading: loading,
    }),

  clearResult: () =>
    set({
      result: null,
      error: null,
    }),
}));

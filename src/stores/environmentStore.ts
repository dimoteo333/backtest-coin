import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnvironmentSetup, Timeframe, FeePreset } from '@/types/environment';
import { DEFAULT_ENVIRONMENT, FEE_PRESETS } from '@/types/environment';

interface EnvironmentState {
  environment: EnvironmentSetup;
  setSymbol: (symbol: string, displayName: string) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  setInitialCapital: (capital: number) => void;
  setCurrency: (currency: 'USDT' | 'KRW') => void;
  setFeePreset: (preset: FeePreset) => void;
  setSlippage: (slippage: number) => void;
  reset: () => void;
}

export const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set) => ({
      environment: DEFAULT_ENVIRONMENT,

      setSymbol: (symbol, displayName) =>
        set((state) => ({
          environment: {
            ...state.environment,
            symbol,
            symbolDisplayName: displayName,
          },
        })),

      setTimeframe: (timeframe) =>
        set((state) => ({
          environment: {
            ...state.environment,
            timeframe,
          },
        })),

      setDateRange: (startDate, endDate) =>
        set((state) => ({
          environment: {
            ...state.environment,
            dateRange: { startDate, endDate },
          },
        })),

      setInitialCapital: (capital) =>
        set((state) => ({
          environment: {
            ...state.environment,
            initialCapital: capital,
          },
        })),

      setCurrency: (currency) =>
        set((state) => ({
          environment: {
            ...state.environment,
            initialCurrency: currency,
          },
        })),

      setFeePreset: (preset) =>
        set((state) => ({
          environment: {
            ...state.environment,
            feePreset: preset,
          },
        })),

      setSlippage: (slippage) =>
        set((state) => ({
          environment: {
            ...state.environment,
            slippage,
          },
        })),

      reset: () =>
        set({
          environment: DEFAULT_ENVIRONMENT,
        }),
    }),
    {
      name: 'backtest-environment',
    }
  )
);

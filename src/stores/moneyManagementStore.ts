import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MoneyManagement } from '@/types/moneyManagement';
import { DEFAULT_MONEY_MANAGEMENT } from '@/types/moneyManagement';

interface MoneyManagementState {
  moneyManagement: MoneyManagement;
  setOrderMode: (mode: 'percentOfBalance' | 'fixedAmount') => void;
  setOrderSizePercent: (percent: number) => void;
  setOrderSizeFixed: (amount: number) => void;
  setLeverage: (leverage: number) => void;
  setLeverageEnabled: (enabled: boolean) => void;
  setPositionDirection: (direction: 'long' | 'short' | 'both') => void;
  reset: () => void;
}

const getPositionDirectionLabel = (direction: 'long' | 'short' | 'both'): string => {
  switch (direction) {
    case 'long':
      return 'Long Only';
    case 'short':
      return 'Short Only';
    case 'both':
      return 'Both Directions';
  }
};

export const useMoneyManagementStore = create<MoneyManagementState>()(
  persist(
    (set) => ({
      moneyManagement: DEFAULT_MONEY_MANAGEMENT,

      setOrderMode: (mode) =>
        set((state) => ({
          moneyManagement: {
            ...state.moneyManagement,
            orderMode: mode,
            orderSize: {
              ...state.moneyManagement.orderSize,
              mode,
            },
          },
        })),

      setOrderSizePercent: (percent) =>
        set((state) => ({
          moneyManagement: {
            ...state.moneyManagement,
            orderMode: 'percentOfBalance',
            orderSize: {
              mode: 'percentOfBalance',
              value: percent,
              description: `${percent}% of balance`,
            },
          },
        })),

      setOrderSizeFixed: (amount) =>
        set((state) => ({
          moneyManagement: {
            ...state.moneyManagement,
            orderMode: 'fixedAmount',
            orderSize: {
              mode: 'fixedAmount',
              value: amount,
              description: `${amount} USDT`,
            },
          },
        })),

      setLeverage: (leverage) =>
        set((state) => ({
          moneyManagement: {
            ...state.moneyManagement,
            leverage,
          },
        })),

      setLeverageEnabled: (enabled) =>
        set((state) => ({
          moneyManagement: {
            ...state.moneyManagement,
            leverageEnabled: enabled,
          },
        })),

      setPositionDirection: (direction) =>
        set((state) => ({
          moneyManagement: {
            ...state.moneyManagement,
            positionDirection: direction,
            positionDirectionLabel: getPositionDirectionLabel(direction),
          },
        })),

      reset: () =>
        set({
          moneyManagement: DEFAULT_MONEY_MANAGEMENT,
        }),
    }),
    {
      name: 'backtest-money-management',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StrategyLogic, Condition, ConditionGroup } from '@/types/strategy';
import { DEFAULT_STRATEGY } from '@/types/strategy';

interface StrategyState {
  strategy: StrategyLogic;
  setEntryCondition: (condition: ConditionGroup) => void;
  setExitCondition: (condition: ConditionGroup) => void;
  addEntryCondition: (condition: Condition) => void;
  addExitCondition: (condition: Condition) => void;
  removeEntryCondition: (id: string) => void;
  removeExitCondition: (id: string) => void;
  updateEntryCondition: (id: string, updates: Partial<Condition>) => void;
  updateExitCondition: (id: string, updates: Partial<Condition>) => void;
  setEntryOperator: (operator: 'AND' | 'OR') => void;
  setExitOperator: (operator: 'AND' | 'OR') => void;
  setStopLoss: (enabled: boolean, percentage?: number) => void;
  setTakeProfit: (enabled: boolean, percentage?: number) => void;
  reset: () => void;
}

export const useStrategyStore = create<StrategyState>()(
  persist(
    (set) => ({
      strategy: DEFAULT_STRATEGY,

      setEntryCondition: (condition) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            entryCondition: condition,
          },
        })),

      setExitCondition: (condition) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            exitCondition: condition,
          },
        })),

      addEntryCondition: (condition) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            entryCondition: {
              ...state.strategy.entryCondition,
              conditions: [...state.strategy.entryCondition.conditions, condition],
            },
          },
        })),

      addExitCondition: (condition) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            exitCondition: {
              ...state.strategy.exitCondition,
              conditions: [...state.strategy.exitCondition.conditions, condition],
            },
          },
        })),

      removeEntryCondition: (id) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            entryCondition: {
              ...state.strategy.entryCondition,
              conditions: state.strategy.entryCondition.conditions.filter((c) => c.id !== id),
            },
          },
        })),

      removeExitCondition: (id) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            exitCondition: {
              ...state.strategy.exitCondition,
              conditions: state.strategy.exitCondition.conditions.filter((c) => c.id !== id),
            },
          },
        })),

      updateEntryCondition: (id, updates) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            entryCondition: {
              ...state.strategy.entryCondition,
              conditions: state.strategy.entryCondition.conditions.map((c) =>
                c.id === id ? { ...c, ...updates } : c
              ),
            },
          },
        })),

      updateExitCondition: (id, updates) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            exitCondition: {
              ...state.strategy.exitCondition,
              conditions: state.strategy.exitCondition.conditions.map((c) =>
                c.id === id ? { ...c, ...updates } : c
              ),
            },
          },
        })),

      setEntryOperator: (operator) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            entryCondition: {
              ...state.strategy.entryCondition,
              operator,
            },
          },
        })),

      setExitOperator: (operator) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            exitCondition: {
              ...state.strategy.exitCondition,
              operator,
            },
          },
        })),

      setStopLoss: (enabled, percentage) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            stopLoss: {
              enabled,
              percentage: percentage ?? state.strategy.stopLoss.percentage,
              description: `${percentage ?? state.strategy.stopLoss.percentage}% stop loss`,
            },
          },
        })),

      setTakeProfit: (enabled, percentage) =>
        set((state) => ({
          strategy: {
            ...state.strategy,
            takeProfit: {
              enabled,
              percentage: percentage ?? state.strategy.takeProfit.percentage,
              description: `${percentage ?? state.strategy.takeProfit.percentage}% take profit`,
            },
          },
        })),

      reset: () =>
        set({
          strategy: DEFAULT_STRATEGY,
        }),
    }),
    {
      name: 'backtest-strategy',
    }
  )
);

// Strategy logic configuration
export interface StrategyLogic {
  // Entry condition (when to buy)
  entryCondition: ConditionGroup;

  // Exit condition (when to sell)
  exitCondition: ConditionGroup;

  // Stop loss (forced exit on loss)
  stopLoss: {
    enabled: boolean;
    percentage: number;        // Entry price - N% (e.g., 5)
    description: string;       // "5% stop loss"
  };

  // Take profit (forced exit on profit)
  takeProfit: {
    enabled: boolean;
    percentage: number;        // Entry price + N% (e.g., 10)
    description: string;       // "10% take profit"
  };
}

export interface ConditionGroup {
  operator: 'AND' | 'OR';
  conditions: Condition[];
}

export interface Condition {
  id: string;
  type: ConditionType;
  indicator?: IndicatorType;
  indicatorPeriod?: number;
  comparison: ComparisonOperator;
  value: number;
  compareToIndicator?: IndicatorType;
  compareToIndicatorPeriod?: number;
  description: string;
}

export type ConditionType =
  | 'indicator_threshold'    // RSI < 30
  | 'indicator_compare'      // SMA(20) > SMA(50)
  | 'price_action';          // Price > SMA(20)

export type IndicatorType =
  | 'RSI'
  | 'SMA'
  | 'EMA'
  | 'MACD'
  | 'MACD_SIGNAL'
  | 'MACD_HISTOGRAM'
  | 'BB_UPPER'
  | 'BB_MIDDLE'
  | 'BB_LOWER'
  | 'PRICE';

export type ComparisonOperator = '<' | '>' | '==' | '<=' | '>=';

// Available indicators with their default periods
export const AVAILABLE_INDICATORS: { type: IndicatorType; label: string; defaultPeriod: number }[] = [
  { type: 'RSI', label: 'RSI', defaultPeriod: 14 },
  { type: 'SMA', label: 'SMA', defaultPeriod: 20 },
  { type: 'EMA', label: 'EMA', defaultPeriod: 20 },
  { type: 'MACD', label: 'MACD', defaultPeriod: 12 },
  { type: 'MACD_SIGNAL', label: 'MACD Signal', defaultPeriod: 9 },
  { type: 'MACD_HISTOGRAM', label: 'MACD Histogram', defaultPeriod: 12 },
  { type: 'BB_UPPER', label: 'BB Upper', defaultPeriod: 20 },
  { type: 'BB_MIDDLE', label: 'BB Middle', defaultPeriod: 20 },
  { type: 'BB_LOWER', label: 'BB Lower', defaultPeriod: 20 },
  { type: 'PRICE', label: 'Price', defaultPeriod: 0 },
];

// Default strategy
export const DEFAULT_STRATEGY: StrategyLogic = {
  entryCondition: {
    operator: 'AND',
    conditions: [
      {
        id: '1',
        type: 'indicator_threshold',
        indicator: 'RSI',
        indicatorPeriod: 14,
        comparison: '<',
        value: 30,
        description: 'RSI(14) < 30',
      },
    ],
  },
  exitCondition: {
    operator: 'AND',
    conditions: [
      {
        id: '2',
        type: 'indicator_threshold',
        indicator: 'RSI',
        indicatorPeriod: 14,
        comparison: '>',
        value: 70,
        description: 'RSI(14) > 70',
      },
    ],
  },
  stopLoss: {
    enabled: true,
    percentage: 5,
    description: '5% stop loss',
  },
  takeProfit: {
    enabled: true,
    percentage: 10,
    description: '10% take profit',
  },
};

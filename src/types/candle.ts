// Candle data structure
export interface Candle {
  time: number;          // Unix timestamp (ms)
  date: string;          // "YYYY-MM-DD"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Completed trade record
export interface CompletedTrade {
  tradeId: number;
  entryTime: number;
  entryPrice: number;
  exitTime: number;
  exitPrice: number;
  quantity: number;
  profitLoss: number;      // USDT
  profitLossPercent: number; // %
  entryFee: number;
  exitFee: number;
  totalFee: number;
  duration: number;        // ms
  status: 'profit' | 'loss';
  exitReason: 'exit_condition' | 'stop_loss' | 'take_profit';
}

// Active position during backtest
export interface Position {
  entryTime: number;
  entryPrice: number;
  quantity: number;
  entryFee: number;
  direction: 'long' | 'short';
}

// Indicator values (for caching)
export interface IndicatorValues {
  timestamp: number;
  rsi?: Record<number, number>;
  sma?: Record<number, number>;
  ema?: Record<number, number>;
  bb?: Record<number, {
    upper: number;
    middle: number;
    lower: number;
  }>;
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
  };
}

// Pre-calculated indicators for all candles
export interface PreCalculatedIndicators {
  rsi: Record<number, number[]>;   // period -> values for each candle
  sma: Record<number, number[]>;
  ema: Record<number, number[]>;
  bb: Record<number, Array<{ upper: number; middle: number; lower: number }>>;
  macd: Array<{ macd: number; signal: number; histogram: number }>;
}

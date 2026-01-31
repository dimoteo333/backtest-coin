// Environment setup configuration
export interface EnvironmentSetup {
  // Target asset selection
  symbol: string;              // e.g., "BTCUSDT", "ETHUSDT"
  symbolDisplayName: string;   // Display name in UI

  // Candle interval
  timeframe: Timeframe;

  // Test period
  dateRange: {
    startDate: string;         // "YYYY-MM-DD"
    endDate: string;           // "YYYY-MM-DD"
  };

  // Initial capital
  initialCapital: number;      // Default: 10000
  initialCurrency: 'USDT' | 'KRW';

  // Trading fees
  feePreset: FeePreset;

  // Slippage
  slippage: number;            // % (default: 0.05)
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M';

export interface FeePreset {
  name: string;                // "Binance VIP 0" | "Upbit Standard" | "Custom"
  makerFee: number;            // % (e.g., 0.02)
  takerFee: number;            // % (e.g., 0.04)
}

// Preset options for fee configuration
export const FEE_PRESETS: FeePreset[] = [
  { name: 'Binance VIP 0', makerFee: 0.1, takerFee: 0.1 },
  { name: 'Binance VIP 1', makerFee: 0.09, takerFee: 0.1 },
  { name: 'Binance Futures', makerFee: 0.02, takerFee: 0.04 },
  { name: 'Upbit Standard', makerFee: 0.05, takerFee: 0.05 },
  { name: 'Custom', makerFee: 0.1, takerFee: 0.1 },
];

// Available symbols
export const AVAILABLE_SYMBOLS = [
  { symbol: 'BTCUSDT', displayName: 'BTC/USDT' },
  { symbol: 'ETHUSDT', displayName: 'ETH/USDT' },
  { symbol: 'BNBUSDT', displayName: 'BNB/USDT' },
  { symbol: 'SOLUSDT', displayName: 'SOL/USDT' },
  { symbol: 'XRPUSDT', displayName: 'XRP/USDT' },
  { symbol: 'ADAUSDT', displayName: 'ADA/USDT' },
  { symbol: 'DOGEUSDT', displayName: 'DOGE/USDT' },
];

// Available timeframes
export const AVAILABLE_TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: '1m', label: '1 minute' },
  { value: '5m', label: '5 minutes' },
  { value: '15m', label: '15 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '4h', label: '4 hours' },
  { value: '1d', label: '1 day' },
  { value: '1w', label: '1 week' },
  { value: '1M', label: '1 month' },
];

// Default environment setup
export const DEFAULT_ENVIRONMENT: EnvironmentSetup = {
  symbol: 'BTCUSDT',
  symbolDisplayName: 'BTC/USDT',
  timeframe: '1h',
  dateRange: {
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
  initialCapital: 10000,
  initialCurrency: 'USDT',
  feePreset: FEE_PRESETS[0],
  slippage: 0.05,
};

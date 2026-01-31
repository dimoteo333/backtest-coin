import type { Candle, CompletedTrade } from './candle';
import type { EnvironmentSetup } from './environment';
import type { StrategyLogic } from './strategy';
import type { MoneyManagement } from './moneyManagement';

// Dashboard summary (displayed prominently)
export interface DashboardSummary {
  // Total return (%)
  totalReturn: {
    value: number;
    percentage: number;
    formatted: string;           // "+25.3%" or "-8.5%"
    color: 'green' | 'red' | 'neutral';
  };

  // Final equity (USDT)
  finalEquity: {
    value: number;
    currency: string;
    formatted: string;           // "12,531 USDT"
  };

  // Win rate (%)
  winRate: {
    value: number;
    formatted: string;           // "58.3%"
    totalTrades: number;
    winTrades: number;
  };

  // Maximum drawdown (MDD, %)
  maxDrawdown: {
    value: number;
    percentage: number;
    formatted: string;           // "-18.5%"
    peakValue: number;
    troughValue: number;
  };
}

// Detailed statistics
export interface DetailedStats {
  // Trade statistics
  trades: {
    totalTrades: number;
    profitableTrades: number;
    losingTrades: number;
    consecutiveWins: number;
    consecutiveLosses: number;
  };

  // Profitability metrics
  profitability: {
    averageProfitPerTrade: {
      value: number;
      formatted: string;         // "125.5 USDT"
    };
    profitFactor: number;        // Total profit / Total loss (1.5+ recommended)
    payoffRatio: number;         // Average profit / Average loss
  };

  // Growth metrics
  growth: {
    cagr: number;                // Compound annual growth rate (%)
    cagrFormatted: string;       // "23.4% p.a."
    totalProfit: number;         // Net profit (USDT)
    totalLoss: number;           // Net loss (USDT)
  };

  // Volatility metrics
  volatility: {
    sharpeRatio: number;
    sortinoRatio: number;
    stdDev: number;
  };

  // Period information
  period: {
    startDate: string;           // "2024-01-01"
    endDate: string;             // "2025-01-31"
    daysCount: number;
    yearsCount: number;
  };
}

// Visualization data
export interface VisualizationData {
  // Equity curve
  equityCurve: Array<{
    timestamp: number;
    date: string;
    equityValue: number;
    returnPercentage: number;
  }>;

  // Drawdown chart
  drawdownChart: Array<{
    timestamp: number;
    date: string;
    drawdownPercentage: number;
    equityValue: number;
  }>;

  // Trade list
  trades: CompletedTrade[];

  // Monthly returns
  monthlyReturns: Array<{
    month: string;               // "2024-01"
    returnPercentage: number;
    profitLoss: number;
    tradeCount: number;
  }>;
}

// Complete backtest result
export interface BacktestResult {
  summary: DashboardSummary;
  stats: DetailedStats;
  visualization: VisualizationData;
  timestamp: number;
  executionTimeMs: number;
  config: {
    environment: EnvironmentSetup;
    strategy: StrategyLogic;
    moneyManagement: MoneyManagement;
  };
}

// Empty/default result
export const EMPTY_RESULT: BacktestResult = {
  summary: {
    totalReturn: { value: 0, percentage: 0, formatted: '0%', color: 'neutral' },
    finalEquity: { value: 0, currency: 'USDT', formatted: '0 USDT' },
    winRate: { value: 0, formatted: '0%', totalTrades: 0, winTrades: 0 },
    maxDrawdown: { value: 0, percentage: 0, formatted: '0%', peakValue: 0, troughValue: 0 },
  },
  stats: {
    trades: { totalTrades: 0, profitableTrades: 0, losingTrades: 0, consecutiveWins: 0, consecutiveLosses: 0 },
    profitability: { averageProfitPerTrade: { value: 0, formatted: '0 USDT' }, profitFactor: 0, payoffRatio: 0 },
    growth: { cagr: 0, cagrFormatted: '0% p.a.', totalProfit: 0, totalLoss: 0 },
    volatility: { sharpeRatio: 0, sortinoRatio: 0, stdDev: 0 },
    period: { startDate: '', endDate: '', daysCount: 0, yearsCount: 0 },
  },
  visualization: { equityCurve: [], drawdownChart: [], trades: [], monthlyReturns: [] },
  timestamp: 0,
  executionTimeMs: 0,
  config: {
    environment: {} as EnvironmentSetup,
    strategy: {} as StrategyLogic,
    moneyManagement: {} as MoneyManagement,
  },
};

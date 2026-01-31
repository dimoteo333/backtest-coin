import type { CompletedTrade } from '@/types/candle';
import type { DashboardSummary, DetailedStats, VisualizationData } from '@/types/results';

export interface EquityPoint {
  timestamp: number;
  date: string;
  equityValue: number;
  cash: number;
  unrealizedPnL: number;
}

/**
 * Format a number with thousands separator
 */
function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Calculate dashboard summary metrics
 */
export function calculateSummary(
  initialCapital: number,
  finalEquity: number,
  trades: CompletedTrade[],
  equityCurve: EquityPoint[],
  currency: string
): DashboardSummary {
  // Total return
  const totalReturnValue = finalEquity - initialCapital;
  const totalReturnPercentage =
    initialCapital > 0 ? ((finalEquity - initialCapital) / initialCapital) * 100 : 0;

  // Win rate
  const profitableTrades = trades.filter((t) => t.profitLoss > 0).length;
  const winRateValue = trades.length > 0 ? (profitableTrades / trades.length) * 100 : 0;

  // Maximum drawdown
  let runningMax = initialCapital;
  let maxDrawdownValue = 0;
  let peakValue = initialCapital;
  let troughValue = initialCapital;

  for (const point of equityCurve) {
    if (point.equityValue > runningMax) {
      runningMax = point.equityValue;
    }
    const drawdown = (runningMax - point.equityValue) / runningMax;
    if (drawdown > maxDrawdownValue) {
      maxDrawdownValue = drawdown;
      peakValue = runningMax;
      troughValue = point.equityValue;
    }
  }

  return {
    totalReturn: {
      value: totalReturnValue,
      percentage: totalReturnPercentage,
      formatted: `${totalReturnPercentage >= 0 ? '+' : ''}${totalReturnPercentage.toFixed(2)}%`,
      color: totalReturnPercentage >= 0 ? 'green' : 'red',
    },
    finalEquity: {
      value: finalEquity,
      currency,
      formatted: `${formatNumber(finalEquity)} ${currency}`,
    },
    winRate: {
      value: winRateValue,
      formatted: `${winRateValue.toFixed(1)}%`,
      totalTrades: trades.length,
      winTrades: profitableTrades,
    },
    maxDrawdown: {
      value: maxDrawdownValue,
      percentage: maxDrawdownValue * 100,
      formatted: `-${(maxDrawdownValue * 100).toFixed(2)}%`,
      peakValue,
      troughValue,
    },
  };
}

/**
 * Calculate detailed statistics
 */
export function calculateDetailedStats(
  initialCapital: number,
  trades: CompletedTrade[],
  equityCurve: EquityPoint[],
  startDate: string,
  endDate: string
): DetailedStats {
  // Trade statistics
  const profitableTrades = trades.filter((t) => t.profitLoss > 0);
  const losingTrades = trades.filter((t) => t.profitLoss < 0);

  // Consecutive wins/losses
  let currentStreak = 0;
  let maxWins = 0;
  let maxLosses = 0;
  let isWinning = true;

  for (const trade of trades) {
    if (trade.profitLoss > 0) {
      if (isWinning) {
        currentStreak++;
      } else {
        currentStreak = 1;
        isWinning = true;
      }
      maxWins = Math.max(maxWins, currentStreak);
    } else {
      if (!isWinning) {
        currentStreak++;
      } else {
        currentStreak = 1;
        isWinning = false;
      }
      maxLosses = Math.max(maxLosses, currentStreak);
    }
  }

  // Profitability metrics
  const totalProfit = profitableTrades.reduce((sum, t) => sum + t.profitLoss, 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profitLoss, 0));
  const avgProfit = profitableTrades.length > 0 ? totalProfit / profitableTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
  const payoffRatio = avgLoss > 0 ? avgProfit / avgLoss : avgProfit > 0 ? Infinity : 0;
  const avgProfitPerTrade = trades.length > 0 ? (totalProfit - totalLoss) / trades.length : 0;

  // Period information
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const yearsCount = daysCount / 365;

  // Growth metrics
  const finalEquity =
    equityCurve.length > 0 ? equityCurve[equityCurve.length - 1].equityValue : initialCapital;
  const cagr =
    yearsCount > 0 ? (Math.pow(finalEquity / initialCapital, 1 / yearsCount) - 1) * 100 : 0;

  // Volatility metrics
  const returns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    const ret =
      (equityCurve[i].equityValue - equityCurve[i - 1].equityValue) /
      equityCurve[i - 1].equityValue;
    returns.push(ret);
  }

  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const variance =
    returns.length > 0
      ? returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
      : 0;
  const stdDev = Math.sqrt(variance);

  // Annualized Sharpe Ratio (assuming 2% risk-free rate)
  const riskFreeRate = 0.02;
  const annualizedReturn = avgReturn * 252;
  const annualizedStdDev = stdDev * Math.sqrt(252);
  const sharpeRatio =
    annualizedStdDev > 0 ? (annualizedReturn - riskFreeRate) / annualizedStdDev : 0;

  // Sortino Ratio (only considers downside deviation)
  const negativeReturns = returns.filter((r) => r < 0);
  const downsideVariance =
    negativeReturns.length > 0
      ? negativeReturns.reduce((sum, r) => sum + r * r, 0) / negativeReturns.length
      : 0;
  const downsideDeviation = Math.sqrt(downsideVariance) * Math.sqrt(252);
  const sortinoRatio =
    downsideDeviation > 0 ? (annualizedReturn - riskFreeRate) / downsideDeviation : 0;

  return {
    trades: {
      totalTrades: trades.length,
      profitableTrades: profitableTrades.length,
      losingTrades: losingTrades.length,
      consecutiveWins: maxWins,
      consecutiveLosses: maxLosses,
    },
    profitability: {
      averageProfitPerTrade: {
        value: avgProfitPerTrade,
        formatted: `${formatNumber(avgProfitPerTrade)} USDT`,
      },
      profitFactor,
      payoffRatio,
    },
    growth: {
      cagr,
      cagrFormatted: `${cagr.toFixed(2)}% p.a.`,
      totalProfit,
      totalLoss,
    },
    volatility: {
      sharpeRatio,
      sortinoRatio,
      stdDev: stdDev * 100,
    },
    period: {
      startDate,
      endDate,
      daysCount,
      yearsCount,
    },
  };
}

/**
 * Calculate visualization data
 */
export function calculateVisualizationData(
  initialCapital: number,
  equityCurve: EquityPoint[],
  trades: CompletedTrade[]
): VisualizationData {
  // Equity curve with return percentage
  const equityCurveData = equityCurve.map((point) => ({
    timestamp: point.timestamp,
    date: point.date,
    equityValue: point.equityValue,
    returnPercentage: ((point.equityValue - initialCapital) / initialCapital) * 100,
  }));

  // Drawdown chart
  let runningMax = initialCapital;
  const drawdownChart = equityCurve.map((point) => {
    if (point.equityValue > runningMax) {
      runningMax = point.equityValue;
    }
    const drawdownPercentage = ((runningMax - point.equityValue) / runningMax) * 100;
    return {
      timestamp: point.timestamp,
      date: point.date,
      drawdownPercentage,
      equityValue: point.equityValue,
    };
  });

  // Monthly returns
  const monthlyData: Map<string, { pnl: number; tradeCount: number }> = new Map();

  for (const trade of trades) {
    const date = new Date(trade.exitTime);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const existing = monthlyData.get(monthKey) || { pnl: 0, tradeCount: 0 };
    existing.pnl += trade.profitLoss;
    existing.tradeCount += 1;
    monthlyData.set(monthKey, existing);
  }

  const monthlyReturns = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      returnPercentage: (data.pnl / initialCapital) * 100,
      profitLoss: data.pnl,
      tradeCount: data.tradeCount,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    equityCurve: equityCurveData,
    drawdownChart,
    trades,
    monthlyReturns,
  };
}

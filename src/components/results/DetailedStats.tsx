'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DetailedStats as DetailedStatsType } from '@/types/results';

interface DetailedStatsProps {
  stats: DetailedStatsType;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function DetailedStatsPanel({ stats }: DetailedStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Trade Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatRow label="Total Trades" value={stats.trades.totalTrades} />
          <StatRow label="Profitable Trades" value={stats.trades.profitableTrades} />
          <StatRow label="Losing Trades" value={stats.trades.losingTrades} />
          <StatRow label="Max Consecutive Wins" value={stats.trades.consecutiveWins} />
          <StatRow label="Max Consecutive Losses" value={stats.trades.consecutiveLosses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Profitability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatRow label="Avg Profit/Trade" value={stats.profitability.averageProfitPerTrade.formatted} />
          <StatRow
            label="Profit Factor"
            value={
              stats.profitability.profitFactor === Infinity
                ? '∞'
                : stats.profitability.profitFactor.toFixed(2)
            }
          />
          <StatRow
            label="Payoff Ratio"
            value={
              stats.profitability.payoffRatio === Infinity
                ? '∞'
                : stats.profitability.payoffRatio.toFixed(2)
            }
          />
          <StatRow label="Total Profit" value={`$${stats.growth.totalProfit.toFixed(2)}`} />
          <StatRow label="Total Loss" value={`$${stats.growth.totalLoss.toFixed(2)}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Growth Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatRow label="CAGR" value={stats.growth.cagrFormatted} />
          <StatRow label="Test Period" value={`${stats.period.daysCount} days`} />
          <StatRow label="Start Date" value={stats.period.startDate} />
          <StatRow label="End Date" value={stats.period.endDate} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatRow label="Sharpe Ratio" value={stats.volatility.sharpeRatio.toFixed(2)} />
          <StatRow label="Sortino Ratio" value={stats.volatility.sortinoRatio.toFixed(2)} />
          <StatRow label="Volatility (Std Dev)" value={`${stats.volatility.stdDev.toFixed(2)}%`} />
        </CardContent>
      </Card>
    </div>
  );
}

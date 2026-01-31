'use client';

import { MetricCard } from './MetricCard';
import type { DashboardSummary } from '@/types/results';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        title="Total Return"
        value={summary.totalReturn.formatted}
        trend={summary.totalReturn.percentage >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        title="Final Equity"
        value={summary.finalEquity.formatted}
        trend="neutral"
      />
      <MetricCard
        title="Win Rate"
        value={summary.winRate.formatted}
        subtitle={`${summary.winRate.winTrades} / ${summary.winRate.totalTrades} trades`}
        trend={summary.winRate.value >= 50 ? 'up' : 'down'}
      />
      <MetricCard
        title="Max Drawdown"
        value={summary.maxDrawdown.formatted}
        trend="down"
      />
    </div>
  );
}

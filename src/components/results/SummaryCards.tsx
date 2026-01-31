'use client';

import { MetricCard } from './MetricCard';
import { METRIC_HELP } from '@/lib/help-content';
import type { DashboardSummary } from '@/types/results';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        title="총 수익률"
        value={summary.totalReturn.formatted}
        trend={summary.totalReturn.percentage >= 0 ? 'up' : 'down'}
        helpTitle={METRIC_HELP.totalReturn.title}
        helpContent={METRIC_HELP.totalReturn.content}
      />
      <MetricCard
        title="최종 자산"
        value={summary.finalEquity.formatted}
        trend="neutral"
        helpTitle={METRIC_HELP.finalEquity.title}
        helpContent={METRIC_HELP.finalEquity.content}
      />
      <MetricCard
        title="승률"
        value={summary.winRate.formatted}
        subtitle={`${summary.winRate.winTrades} / ${summary.winRate.totalTrades} 거래`}
        trend={summary.winRate.value >= 50 ? 'up' : 'down'}
        helpTitle={METRIC_HELP.winRate.title}
        helpContent={METRIC_HELP.winRate.content}
      />
      <MetricCard
        title="최대 낙폭"
        value={summary.maxDrawdown.formatted}
        trend="down"
        helpTitle={METRIC_HELP.maxDrawdown.title}
        helpContent={METRIC_HELP.maxDrawdown.content}
      />
    </div>
  );
}

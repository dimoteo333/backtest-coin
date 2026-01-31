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
          <CardTitle className="text-sm">거래 통계</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatRow label="총 거래 수" value={stats.trades.totalTrades} />
          <StatRow label="수익 거래" value={stats.trades.profitableTrades} />
          <StatRow label="손실 거래" value={stats.trades.losingTrades} />
          <StatRow label="최대 연속 수익" value={`${stats.trades.consecutiveWins}회`} />
          <StatRow label="최대 연속 손실" value={`${stats.trades.consecutiveLosses}회`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">수익성 분석</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatRow label="평균 거래 수익" value={stats.profitability.averageProfitPerTrade.formatted} />
          <StatRow
            label="프로핏 팩터"
            value={
              stats.profitability.profitFactor === Infinity
                ? '∞'
                : stats.profitability.profitFactor.toFixed(2)
            }
          />
          <StatRow
            label="손익 비율"
            value={
              stats.profitability.payoffRatio === Infinity
                ? '∞'
                : stats.profitability.payoffRatio.toFixed(2)
            }
          />
          <StatRow label="총 수익" value={`$${stats.growth.totalProfit.toFixed(2)}`} />
          <StatRow label="총 손실" value={`$${stats.growth.totalLoss.toFixed(2)}`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">성장 지표</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatRow label="연평균 성장률 (CAGR)" value={stats.growth.cagrFormatted} />
          <StatRow label="테스트 기간" value={`${stats.period.daysCount}일`} />
          <StatRow label="시작일" value={stats.period.startDate} />
          <StatRow label="종료일" value={stats.period.endDate} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">위험 지표</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <StatRow label="샤프 비율" value={stats.volatility.sharpeRatio.toFixed(2)} />
          <StatRow label="소티노 비율" value={stats.volatility.sortinoRatio.toFixed(2)} />
          <StatRow label="변동성 (표준편차)" value={`${stats.volatility.stdDev.toFixed(2)}%`} />
        </CardContent>
      </Card>
    </div>
  );
}

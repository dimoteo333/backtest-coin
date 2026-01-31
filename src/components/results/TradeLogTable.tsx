'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CompletedTrade } from '@/types/candle';

interface TradeLogTableProps {
  trades: CompletedTrade[];
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}일 ${hours % 24}시간`;
  }
  if (hours > 0) {
    return `${hours}시간 ${minutes % 60}분`;
  }
  if (minutes > 0) {
    return `${minutes}분`;
  }
  return `${seconds}초`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 청산 사유 한국어 변환
function getExitReasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    'exit_condition': '조건 충족',
    'stop_loss': '손절매',
    'take_profit': '익절매',
    'end_of_data': '데이터 종료',
    'manual': '수동 청산',
  };
  return labels[reason] || reason.replace('_', ' ');
}

export function TradeLogTable({ trades }: TradeLogTableProps) {
  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">거래 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            이 기간에 실행된 거래가 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">거래 내역 ({trades.length}건)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 font-medium">#</th>
                <th className="text-left py-2 px-3 font-medium">진입 시간</th>
                <th className="text-left py-2 px-3 font-medium">청산 시간</th>
                <th className="text-right py-2 px-3 font-medium">진입가</th>
                <th className="text-right py-2 px-3 font-medium">청산가</th>
                <th className="text-right py-2 px-3 font-medium">손익</th>
                <th className="text-right py-2 px-3 font-medium">손익 %</th>
                <th className="text-left py-2 px-3 font-medium">보유 기간</th>
                <th className="text-left py-2 px-3 font-medium">청산 사유</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.tradeId} className="border-b hover:bg-muted/30">
                  <td className="py-2 px-3">{trade.tradeId}</td>
                  <td className="py-2 px-3 text-xs">{formatDate(trade.entryTime)}</td>
                  <td className="py-2 px-3 text-xs">{formatDate(trade.exitTime)}</td>
                  <td className="py-2 px-3 text-right font-mono">
                    ${trade.entryPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    ${trade.exitPrice.toFixed(2)}
                  </td>
                  <td
                    className={cn(
                      'py-2 px-3 text-right font-mono font-medium',
                      trade.status === 'profit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {trade.profitLoss >= 0 ? '+' : ''}
                    ${trade.profitLoss.toFixed(2)}
                  </td>
                  <td
                    className={cn(
                      'py-2 px-3 text-right font-mono',
                      trade.status === 'profit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {trade.profitLossPercent >= 0 ? '+' : ''}
                    {trade.profitLossPercent.toFixed(2)}%
                  </td>
                  <td className="py-2 px-3 text-xs">{formatDuration(trade.duration)}</td>
                  <td className="py-2 px-3 text-xs">
                    {getExitReasonLabel(trade.exitReason)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

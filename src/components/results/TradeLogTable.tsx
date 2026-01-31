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
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TradeLogTable({ trades }: TradeLogTableProps) {
  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Trade Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No trades executed during this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Trade Log ({trades.length} trades)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 font-medium">#</th>
                <th className="text-left py-2 px-3 font-medium">Entry</th>
                <th className="text-left py-2 px-3 font-medium">Exit</th>
                <th className="text-right py-2 px-3 font-medium">Entry Price</th>
                <th className="text-right py-2 px-3 font-medium">Exit Price</th>
                <th className="text-right py-2 px-3 font-medium">P/L</th>
                <th className="text-right py-2 px-3 font-medium">P/L %</th>
                <th className="text-left py-2 px-3 font-medium">Duration</th>
                <th className="text-left py-2 px-3 font-medium">Reason</th>
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
                  <td className="py-2 px-3 text-xs capitalize">
                    {trade.exitReason.replace('_', ' ')}
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

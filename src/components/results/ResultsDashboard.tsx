'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryCards } from './SummaryCards';
import { DetailedStatsPanel } from './DetailedStats';
import { TradeLogTable } from './TradeLogTable';
import { PriceChart, EquityCurveChart, DrawdownChart } from '@/components/charts';
import { useResultsStore } from '@/stores';
import { Badge } from '@/components/ui/badge';

export function ResultsDashboard() {
  const { result, isLoading, error, candles } = useResultsStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Running backtest...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive font-medium">Error</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium">No Results Yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your strategy and run a backtest to see results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Backtest Results</h2>
        <Badge variant="outline" className="text-xs">
          Executed in {result.executionTimeMs.toFixed(0)}ms
        </Badge>
      </div>

      <SummaryCards summary={result.summary} />

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Price Chart</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <PriceChart
                candles={candles}
                trades={result.visualization.trades}
                height={350}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Equity Curve</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EquityCurveChart
                  data={result.visualization.equityCurve}
                  initialCapital={result.config.environment.initialCapital}
                  height={250}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Drawdown</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DrawdownChart
                  data={result.visualization.drawdownChart}
                  height={250}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <DetailedStatsPanel stats={result.stats} />
        </TabsContent>

        <TabsContent value="trades" className="mt-4">
          <TradeLogTable trades={result.visualization.trades} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

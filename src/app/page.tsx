'use client';

import { useEffect, useState } from 'react';
import { MainLayout, LeftPanel, RightPanel } from '@/components/layout';
import { EnvironmentForm } from '@/components/environment';
import { StrategyForm } from '@/components/strategy';
import { MoneyManagementForm } from '@/components/money-management';
import { ResultsDashboard } from '@/components/results';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBacktest, useDataLoader, type DataSource } from '@/hooks';
import { useEnvironmentStore, useResultsStore } from '@/stores';

function BacktestButton() {
  const { runBacktest, isReady } = useBacktest();
  const { isLoading } = useResultsStore();

  return (
    <Button
      onClick={runBacktest}
      disabled={!isReady || isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          실행 중...
        </>
      ) : (
        '백테스트 실행'
      )}
    </Button>
  );
}

function DataLoader() {
  const environment = useEnvironmentStore((state) => state.environment);
  const { candles, candlesLoading } = useResultsStore();
  const [dataSource, setDataSource] = useState<DataSource>('mock');
  const { loadData, progress, error } = useDataLoader({ source: dataSource });

  const handleLoad = () => {
    loadData(
      environment.symbol,
      environment.timeframe,
      environment.dateRange.startDate,
      environment.dateRange.endDate
    );
  };

  // Auto-load on environment change
  useEffect(() => {
    handleLoad();
  }, [
    environment.symbol,
    environment.dateRange.startDate,
    environment.dateRange.endDate,
    environment.timeframe,
    dataSource,
  ]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">데이터:</span>
          {candlesLoading ? (
            <span className="text-muted-foreground">
              로딩 중... {progress > 0 && `${progress}%`}
            </span>
          ) : (
            <span className="font-medium">{candles.length.toLocaleString()}개 캔들</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={dataSource}
            onValueChange={(value) => setDataSource(value as DataSource)}
          >
            <SelectTrigger className="h-8 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mock">가상 데이터</SelectItem>
              <SelectItem value="binance">바이낸스</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoad}
            disabled={candlesLoading}
          >
            {candlesLoading ? '로딩 중...' : '새로고침'}
          </Button>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
          <Badge variant="outline" className="text-xs">
            가상 데이터로 대체
          </Badge>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <MainLayout
      leftPanel={
        <LeftPanel>
          <DataLoader />
          <EnvironmentForm />
          <StrategyForm />
          <MoneyManagementForm />
          <BacktestButton />
        </LeftPanel>
      }
      rightPanel={
        <RightPanel>
          <ResultsDashboard />
        </RightPanel>
      }
    />
  );
}

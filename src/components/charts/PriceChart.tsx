'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  CandlestickSeries,
  createSeriesMarkers,
  ISeriesMarkersPluginApi,
} from 'lightweight-charts';
import type { Candle, CompletedTrade } from '@/types';

interface PriceChartProps {
  candles: Candle[];
  trades: CompletedTrade[];
  height?: number;
}

export function PriceChart({ candles, trades, height = 400 }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(156, 163, 175, 0.1)' },
        horzLines: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: 'rgba(156, 163, 175, 0.2)',
      },
      timeScale: {
        borderColor: 'rgba(156, 163, 175, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    const markers = createSeriesMarkers(series, []);

    chartRef.current = chart;
    seriesRef.current = series;
    markersRef.current = markers;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  useEffect(() => {
    if (!seriesRef.current || !markersRef.current || candles.length === 0) return;

    const candleData: CandlestickData<Time>[] = candles.map((candle) => ({
      time: (candle.time / 1000) as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    seriesRef.current.setData(candleData);

    const markerData = trades.flatMap((trade) => [
      {
        time: (trade.entryTime / 1000) as Time,
        position: 'belowBar' as const,
        color: '#22c55e',
        shape: 'arrowUp' as const,
        text: 'Buy',
      },
      {
        time: (trade.exitTime / 1000) as Time,
        position: 'aboveBar' as const,
        color: trade.status === 'profit' ? '#22c55e' : '#ef4444',
        shape: 'arrowDown' as const,
        text: trade.status === 'profit' ? 'Sell +' : 'Sell -',
      },
    ]);

    markersRef.current.setMarkers(markerData);

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [candles, trades]);

  return (
    <div ref={containerRef} className="w-full rounded-lg bg-card border" />
  );
}

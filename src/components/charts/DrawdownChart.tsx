'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  Time,
  LineSeries,
} from 'lightweight-charts';

interface DrawdownChartProps {
  data: Array<{
    timestamp: number;
    drawdownPercentage: number;
  }>;
  height?: number;
}

export function DrawdownChart({ data, height = 200 }: DrawdownChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

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
      rightPriceScale: {
        borderColor: 'rgba(156, 163, 175, 0.2)',
        invertScale: true,
      },
      timeScale: {
        borderColor: 'rgba(156, 163, 175, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const series = chart.addSeries(LineSeries, {
      color: '#ef4444',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    chartRef.current = chart;
    seriesRef.current = series;

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
    if (!seriesRef.current || !chartRef.current || data.length === 0) return;

    const lineData: LineData<Time>[] = data.map((point) => ({
      time: (point.timestamp / 1000) as Time,
      value: point.drawdownPercentage,
    }));

    seriesRef.current.setData(lineData);
    chartRef.current.timeScale().fitContent();
  }, [data]);

  return (
    <div ref={containerRef} className="w-full rounded-lg bg-card border" />
  );
}

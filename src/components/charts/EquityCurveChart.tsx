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

interface EquityCurveChartProps {
  data: Array<{
    timestamp: number;
    equityValue: number;
  }>;
  initialCapital: number;
  height?: number;
}

export function EquityCurveChart({ data, initialCapital, height = 300 }: EquityCurveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const baselineRef = useRef<ISeriesApi<'Line'> | null>(null);

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
      },
      timeScale: {
        borderColor: 'rgba(156, 163, 175, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#3b82f6',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
    });

    const baselineSeries = chart.addSeries(LineSeries, {
      color: 'rgba(156, 163, 175, 0.5)',
      lineWidth: 1,
      lineStyle: 2,
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;
    baselineRef.current = baselineSeries;

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
    if (!seriesRef.current || !chartRef.current || !baselineRef.current || data.length === 0) return;

    const lineData: LineData<Time>[] = data.map((point) => ({
      time: (point.timestamp / 1000) as Time,
      value: point.equityValue,
    }));

    seriesRef.current.setData(lineData);

    const baselineData: LineData<Time>[] = [
      { time: lineData[0].time, value: initialCapital },
      { time: lineData[lineData.length - 1].time, value: initialCapital },
    ];

    baselineRef.current.setData(baselineData);
    chartRef.current.timeScale().fitContent();
  }, [data, initialCapital]);

  return (
    <div ref={containerRef} className="w-full rounded-lg bg-card border" />
  );
}

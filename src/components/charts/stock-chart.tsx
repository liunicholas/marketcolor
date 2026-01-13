'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts';
import type { IChartApi, CandlestickData, LineData, UTCTimestamp } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import type { StockHistory, TimeRange } from '@/types/stock';

interface StockChartProps {
  history: StockHistory[];
  isLoading?: boolean;
  isValidating?: boolean;
  range: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '5D', label: '5D' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: '5Y', label: '5Y' },
];

export function StockChart({ history, isLoading, isValidating, range, onRangeChange }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');

  // Convert dates to Unix timestamps (seconds)
  const convertTime = useCallback((dateStr: string): UTCTimestamp => {
    return Math.floor(new Date(dateStr).getTime() / 1000) as UTCTimestamp;
  }, []);

  // Create and update chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Don't create chart if no data
    if (!history || history.length === 0) return;

    const container = chartContainerRef.current;
    const width = container.clientWidth || 600;

    // Create new chart
    const chart = createChart(container, {
      width,
      height: 360,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#888888',
        fontFamily: '"SF Mono", Monaco, Menlo, monospace',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#555555',
          width: 1,
          style: 2,
          labelBackgroundColor: '#222222',
        },
        horzLine: {
          color: '#555555',
          width: 1,
          style: 2,
          labelBackgroundColor: '#222222',
        },
      },
      rightPriceScale: {
        borderColor: '#222222',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#222222',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add series based on type
    if (chartType === 'candlestick') {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#22c55e',
        wickDownColor: '#ef4444',
        wickUpColor: '#22c55e',
      });

      const chartData: CandlestickData<UTCTimestamp>[] = history
        .map((item) => ({
          time: convertTime(item.date),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }))
        .sort((a, b) => (a.time as number) - (b.time as number));

      series.setData(chartData);
    } else {
      const series = chart.addSeries(LineSeries, {
        color: '#888888',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 3,
      });

      const lineData: LineData<UTCTimestamp>[] = history
        .map((item) => ({
          time: convertTime(item.date),
          value: item.close,
        }))
        .sort((a, b) => (a.time as number) - (b.time as number));

      series.setData(lineData);
    }

    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (container && chartRef.current) {
        const newWidth = container.clientWidth;
        if (newWidth > 0) {
          chartRef.current.applyOptions({ width: newWidth });
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [history, chartType, convertTime]);

  if (isLoading) {
    return (
      <div className="border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-48 bg-secondary animate-pulse" />
          <div className="h-6 w-24 bg-secondary animate-pulse" />
        </div>
        <div className="h-[360px] w-full bg-secondary/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="border border-border p-4">
      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        {/* Time Range Selector */}
        <div className="flex items-center gap-1 font-mono text-xs">
          {timeRanges.map((tr) => (
            <Button
              key={tr.value}
              variant="ghost"
              size="sm"
              onClick={() => onRangeChange(tr.value)}
              className={`
                h-6 px-2 rounded-none font-mono text-xs
                ${range === tr.value
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }
              `}
            >
              {tr.label}
            </Button>
          ))}
          {isValidating && (
            <span className="ml-2 text-muted-foreground animate-pulse">...</span>
          )}
        </div>

        {/* Chart Type Toggle */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChartType('candlestick')}
            className={`
              h-6 px-2 rounded-none font-mono text-xs
              ${chartType === 'candlestick'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }
            `}
          >
            CANDLE
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChartType('line')}
            className={`
              h-6 px-2 rounded-none font-mono text-xs
              ${chartType === 'line'
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }
            `}
          >
            LINE
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="w-full"
        style={{ height: 360 }}
      />

      {/* No Data Message */}
      {(!history || history.length === 0) && !isLoading && (
        <div className="h-[360px] flex items-center justify-center border border-border bg-secondary/20">
          <p className="text-muted-foreground font-mono text-sm">NO DATA AVAILABLE</p>
        </div>
      )}
    </div>
  );
}

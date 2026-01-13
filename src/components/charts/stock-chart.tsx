'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData, LineData, SeriesType, Time } from 'lightweight-charts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { StockHistory, TimeRange } from '@/types/stock';
import { BarChart3, CandlestickChart } from 'lucide-react';

interface StockChartProps {
  history: StockHistory[];
  isLoading?: boolean;
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

export function StockChart({ history, isLoading, range, onRangeChange }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#06b6d4',
          width: 1,
          style: 2,
          labelBackgroundColor: '#06b6d4',
        },
        horzLine: {
          color: '#06b6d4',
          width: 1,
          style: 2,
          labelBackgroundColor: '#06b6d4',
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: 400,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update chart data and type
  useEffect(() => {
    if (!chartRef.current || !history.length) return;

    // Remove existing series
    if (seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
    }

    if (chartType === 'candlestick') {
      const candlestickSeries = chartRef.current.addSeries(
        CandlestickSeries,
        {
          upColor: '#10b981',
          downColor: '#f43f5e',
          borderDownColor: '#f43f5e',
          borderUpColor: '#10b981',
          wickDownColor: '#f43f5e',
          wickUpColor: '#10b981',
        }
      );

      const chartData: CandlestickData<Time>[] = history.map((item) => ({
        time: Math.floor(new Date(item.date).getTime() / 1000) as Time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      candlestickSeries.setData(chartData);
      seriesRef.current = candlestickSeries;
    } else {
      const lineSeries = chartRef.current.addSeries(
        LineSeries,
        {
          color: '#06b6d4',
          lineWidth: 2,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
          crosshairMarkerBorderColor: '#06b6d4',
          crosshairMarkerBackgroundColor: '#0a0a0f',
        }
      );

      const lineData: LineData<Time>[] = history.map((item) => ({
        time: Math.floor(new Date(item.date).getTime() / 1000) as Time,
        value: item.close,
      }));

      lineSeries.setData(lineData);
      seriesRef.current = lineSeries;
    }

    chartRef.current.timeScale().fitContent();
  }, [history, chartType]);

  if (isLoading) {
    return (
      <Card className="p-4 bg-card border-border/50">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-card border-border/50 animate-fade-up">
      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
          {timeRanges.map((tr) => (
            <Button
              key={tr.value}
              variant={range === tr.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onRangeChange(tr.value)}
              className={`
                h-7 px-3 text-xs font-medium
                ${range === tr.value
                  ? 'bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tr.label}
            </Button>
          ))}
        </div>

        {/* Chart Type Toggle */}
        <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
          <Button
            variant={chartType === 'candlestick' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setChartType('candlestick')}
            className={`
              h-7 px-3
              ${chartType === 'candlestick'
                ? 'bg-cyan-500/20 text-cyan-500'
                : 'text-muted-foreground'
              }
            `}
          >
            <CandlestickChart className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === 'line' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setChartType('line')}
            className={`
              h-7 px-3
              ${chartType === 'line'
                ? 'bg-cyan-500/20 text-cyan-500'
                : 'text-muted-foreground'
              }
            `}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="chart-container rounded-lg overflow-hidden"
        style={{ height: 400 }}
      />

      {/* No Data Message */}
      {history.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80">
          <p className="text-muted-foreground">No chart data available</p>
        </div>
      )}
    </Card>
  );
}

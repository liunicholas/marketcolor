'use client';

import Link from 'next/link';
import { useMarketMovers } from '@/hooks/use-market-data';

interface MoversTableProps {
  type: 'gainers' | 'losers' | 'active';
  limit?: number;
  offset?: number;
}

function formatVolume(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return num.toLocaleString();
}

export function MoversTable({ type, limit = 10, offset = 0 }: MoversTableProps) {
  const { movers, isLoading, error } = useMarketMovers(type, offset, limit);
  const isActive = type === 'active';

  // Calculate max values for bar scaling
  const maxPercent = movers.length > 0
    ? Math.max(...movers.map((m) => Math.abs(m.changePercent)))
    : 1;
  const maxVolume = movers.length > 0
    ? Math.max(...movers.map((m) => m.volume || 0))
    : 1;

  if (error) {
    return (
      <div className="border border-border p-4">
        <p className="text-sm text-muted-foreground font-mono">ERROR: Failed to load</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border border-border">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-border last:border-b-0">
            <div className="h-4 w-16 bg-secondary animate-pulse" />
            <div className="h-4 w-32 bg-secondary animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Unified header: SYM | NAME | MAGNITUDE (with bar) | PRICE | CHG %
  const magnitudeHeader = isActive ? 'VOLUME' : 'CHG %';

  return (
    <div className="border border-border">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-border bg-secondary/30 font-mono text-xs text-muted-foreground">
        <span className="w-16">SYM</span>
        <span className="flex-1 hidden sm:block">NAME</span>
        <span className="w-24 text-right">{magnitudeHeader}</span>
        <span className="w-20 text-right">PRICE</span>
        <span className="w-20 text-right">{isActive ? 'CHG %' : 'CHG'}</span>
      </div>

      {/* Rows */}
      {movers.map((stock) => {
        const isPositive = stock.change >= 0;
        const percentWidth = (Math.abs(stock.changePercent) / maxPercent) * 100;
        const volumeWidth = ((stock.volume || 0) / maxVolume) * 100;

        // Bar color based on type
        const barColor = isActive
          ? 'bg-muted-foreground/20'
          : type === 'gainers'
            ? 'bg-gain/20'
            : 'bg-loss/20';

        const barWidth = isActive ? volumeWidth : percentWidth;

        return (
          <Link
            key={stock.symbol}
            href={`/stock/${stock.symbol}`}
            className="flex items-center px-4 py-2 border-b border-border last:border-b-0 hover:bg-secondary/30 font-mono text-sm"
          >
            <span className="w-16 font-bold">{stock.symbol}</span>
            <span className="flex-1 hidden sm:block text-muted-foreground truncate pr-4">
              {stock.name}
            </span>

            {/* Magnitude column with bar */}
            <span className="w-24 text-right relative">
              <span
                className={`absolute inset-y-0 right-0 ${barColor}`}
                style={{ width: `${barWidth}%` }}
              />
              <span className={`relative font-bold ${
                isActive
                  ? 'text-foreground'
                  : isPositive
                    ? 'text-gain'
                    : 'text-loss'
              }`}>
                {isActive
                  ? formatVolume(stock.volume)
                  : `${isPositive ? '+' : ''}${stock.changePercent.toFixed(1)}%`}
              </span>
            </span>

            {/* Price */}
            <span className="w-20 text-right text-muted-foreground">
              ${stock.price.toFixed(2)}
            </span>

            {/* Change */}
            <span className={`w-20 text-right ${isPositive ? 'text-gain' : 'text-loss'}`}>
              {isActive
                ? `${isPositive ? '+' : ''}${stock.changePercent.toFixed(1)}%`
                : `${isPositive ? '+' : ''}${stock.change.toFixed(2)}`}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

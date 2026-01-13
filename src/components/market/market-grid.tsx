'use client';

import Link from 'next/link';
import type { MarketIndex } from '@/types/stock';

interface MarketGridProps {
  title: string;
  items: MarketIndex[];
  isLoading?: boolean;
  error?: Error | null;
  columns?: 2 | 4;
}

export function MarketGrid({ title, items, isLoading, error, columns = 4 }: MarketGridProps) {
  if (error) {
    return (
      <div className="border border-border">
        <div className="px-4 py-2 border-b border-border bg-secondary/30">
          <span className="font-mono text-xs text-muted-foreground">{title}</span>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground font-mono">ERROR: Failed to load</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border border-border">
        <div className="px-4 py-2 border-b border-border bg-secondary/30">
          <span className="font-mono text-xs text-muted-foreground">{title}</span>
        </div>
        <div className={`grid ${columns === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'} gap-px bg-border`}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="bg-background p-3">
              <div className="h-3 w-16 bg-secondary animate-pulse mb-2" />
              <div className="h-5 w-20 bg-secondary animate-pulse mb-1" />
              <div className="h-3 w-24 bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border">
      <div className="px-4 py-2 border-b border-border bg-secondary/30">
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
      </div>
      <div className={`grid ${columns === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'} gap-px bg-border`}>
        {items.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <Link
              key={item.symbol}
              href={`/stock/${encodeURIComponent(item.symbol)}`}
              className="bg-background p-3 hover:bg-secondary/30 cursor-pointer block"
            >
              <span className="block text-xs text-muted-foreground mb-1 truncate">{item.name}</span>
              <span className="block font-mono text-base text-foreground mb-1">
                {item.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className={isPositive ? 'text-gain' : 'text-loss'}>
                  {isPositive ? '▲' : '▼'}
                </span>
                <span className={isPositive ? 'text-gain' : 'text-loss'}>
                  {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

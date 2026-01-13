'use client';

import Link from 'next/link';
import { useMarketIndices } from '@/hooks/use-market-data';

export function IndicesGrid() {
  const { indices, isLoading, error } = useMarketIndices();

  if (error) {
    return (
      <div className="border border-border p-4">
        <p className="text-sm text-muted-foreground font-mono">ERROR: Failed to load indices</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-background p-4">
            <div className="h-3 w-16 bg-secondary animate-pulse mb-2" />
            <div className="h-5 w-20 bg-secondary animate-pulse mb-1" />
            <div className="h-3 w-24 bg-secondary animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
      {indices.map((index) => {
        const isPositive = index.change >= 0;
        return (
          <Link
            key={index.symbol}
            href={`/stock/${encodeURIComponent(index.symbol)}`}
            className="bg-background p-4 hover:bg-secondary/30 cursor-pointer block"
          >
            <span className="block text-xs text-muted-foreground mb-1">{index.name}</span>
            <span className="block font-mono text-lg text-foreground mb-1">
              {index.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={isPositive ? 'text-gain' : 'text-loss'}>
                {isPositive ? '▲' : '▼'}
              </span>
              <span className={isPositive ? 'text-gain' : 'text-loss'}>
                {isPositive ? '+' : ''}{index.change.toFixed(2)}
              </span>
              <span className={isPositive ? 'text-gain' : 'text-loss'}>
                ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

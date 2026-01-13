'use client';

import { useMarketIndices } from '@/hooks/use-market-data';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceBadge } from '@/components/stock/price-badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

const indexIcons: Record<string, string> = {
  '^GSPC': '📊',
  '^DJI': '🏛️',
  '^IXIC': '💻',
  '^RUT': '🏢',
};

export function IndicesGrid() {
  const { indices, isLoading, error } = useMarketIndices();

  if (error) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 bg-card border-border/50">
            <p className="text-sm text-muted-foreground">Failed to load</p>
          </Card>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 bg-card border-border/50">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-5 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {indices.map((index, i) => {
        const isPositive = index.change >= 0;
        return (
          <Card
            key={index.symbol}
            className={`
              relative overflow-hidden p-4 bg-card border-border/50
              card-hover animate-fade-up stagger-${i + 1}
            `}
          >
            {/* Gradient Background */}
            <div
              className={`
                absolute inset-0 opacity-5
                ${isPositive
                  ? 'bg-gradient-to-br from-emerald-500 to-transparent'
                  : 'bg-gradient-to-br from-rose-500 to-transparent'
                }
              `}
            />

            {/* Content */}
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{indexIcons[index.symbol] || '📈'}</span>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-gain" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-loss" />
                )}
              </div>

              {/* Name */}
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {index.name}
              </p>

              {/* Price */}
              <p className="font-mono-numbers text-2xl font-bold tracking-tight mb-2">
                {index.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              {/* Change Badge */}
              <PriceBadge
                change={index.change}
                changePercent={index.changePercent}
                size="sm"
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

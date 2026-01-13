'use client';

import { PriceBadge } from './price-badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { StockQuote } from '@/types/stock';

interface StockHeaderProps {
  quote: StockQuote | null;
  isLoading?: boolean;
}

export function StockHeader({ quote, isLoading }: StockHeaderProps) {
  if (isLoading || !quote) {
    return (
      <div className="animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <Skeleton className="h-10 w-24 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex items-end gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        {/* Left: Symbol & Name */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-mono-numbers text-4xl sm:text-5xl font-bold tracking-tight">
              {quote.symbol}
            </h1>
            {quote.exchange && (
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                {quote.exchange}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{quote.name}</p>
        </div>

        {/* Right: Price & Change */}
        <div className="flex items-end gap-4">
          <div className="text-right sm:text-left">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Current Price
            </p>
            <p
              className={`
                font-mono-numbers text-4xl sm:text-5xl font-bold tracking-tight
                ${isPositive ? 'text-gain' : 'text-loss'}
              `}
            >
              ${quote.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <PriceBadge
            change={quote.change}
            changePercent={quote.changePercent}
            size="lg"
            className="mb-1"
          />
        </div>
      </div>

      {/* Trading Info Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Open:</span>
          <span className="font-mono-numbers font-medium text-foreground">
            ${quote.open.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>High:</span>
          <span className="font-mono-numbers font-medium text-gain">
            ${quote.high.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Low:</span>
          <span className="font-mono-numbers font-medium text-loss">
            ${quote.low.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Prev Close:</span>
          <span className="font-mono-numbers font-medium text-foreground">
            ${quote.previousClose.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import type { StockQuote } from '@/types/stock';

interface StockHeaderProps {
  quote: StockQuote | null;
  isLoading?: boolean;
}

export function StockHeader({ quote, isLoading }: StockHeaderProps) {
  if (isLoading || !quote) {
    return (
      <div className="border border-border p-4">
        <div className="h-8 w-24 bg-secondary animate-pulse mb-2" />
        <div className="h-5 w-48 bg-secondary animate-pulse" />
      </div>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <div className="border border-border p-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        {/* Symbol & Name */}
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="font-mono text-2xl font-bold">{quote.symbol}</h1>
            {quote.exchange && (
              <span className="font-mono text-xs text-muted-foreground">
                {quote.exchange}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{quote.name}</p>
        </div>

        {/* Price & Change */}
        <div className="font-mono sm:text-right">
          <div className="flex items-baseline gap-4">
            <span className="text-2xl font-bold">
              ${quote.price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className={isPositive ? 'text-gain' : 'text-loss'}>
              {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
            </span>
          </div>
          {quote.regularMarketTime && (
            <div className="text-xs text-muted-foreground mt-1">
              As of {new Date(quote.regularMarketTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'America/New_York',
              })} ET
            </div>
          )}
        </div>
      </div>

      {/* Day Stats */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
        <span>Open: <span className="text-foreground">${quote.open.toFixed(2)}</span></span>
        <span>High: <span className="text-gain">${quote.high.toFixed(2)}</span></span>
        <span>Low: <span className="text-loss">${quote.low.toFixed(2)}</span></span>
        <span>Close: <span className="text-foreground">${quote.price.toFixed(2)}</span></span>
      </div>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { StockQuote } from '@/types/stock';

interface StatsGridProps {
  quote: StockQuote | null;
  profile?: {
    industry?: string;
    sector?: string;
    profitMargin?: number;
    operatingMargin?: number;
    returnOnEquity?: number;
    returnOnAssets?: number;
    revenue?: number;
    revenueGrowth?: number;
    targetMeanPrice?: number;
    recommendationKey?: string;
    numberOfAnalysts?: number;
  } | null;
  isLoading?: boolean;
}

function formatLargeNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function formatPercent(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  return `${(num * 100).toFixed(2)}%`;
}

function formatNumber(num: number | undefined, decimals = 2): string {
  if (num === undefined || num === null) return '-';
  return num.toFixed(decimals);
}

export function StatsGrid({ quote, profile, isLoading }: StatsGridProps) {
  const stats = [
    { label: 'Market Cap', value: formatLargeNumber(quote?.marketCap) },
    { label: 'P/E Ratio', value: formatNumber(quote?.peRatio) },
    { label: 'Forward P/E', value: formatNumber(quote?.forwardPE) },
    { label: 'Volume', value: quote?.volume?.toLocaleString() || '-' },
    { label: 'Avg Volume', value: quote?.avgVolume?.toLocaleString() || '-' },
    { label: 'Div Yield', value: quote?.dividendYield ? formatPercent(quote.dividendYield / 100) : '-' },
    { label: '52W High', value: quote?.fiftyTwoWeekHigh ? `$${quote.fiftyTwoWeekHigh.toFixed(2)}` : '-' },
    { label: '52W Low', value: quote?.fiftyTwoWeekLow ? `$${quote.fiftyTwoWeekLow.toFixed(2)}` : '-' },
  ];

  const profileStats = profile ? [
    { label: 'Sector', value: profile.sector || '-' },
    { label: 'Industry', value: profile.industry || '-' },
    { label: 'Revenue', value: formatLargeNumber(profile.revenue) },
    { label: 'Rev Growth', value: formatPercent(profile.revenueGrowth) },
    { label: 'Profit Margin', value: formatPercent(profile.profitMargin) },
    { label: 'Op Margin', value: formatPercent(profile.operatingMargin) },
    { label: 'ROE', value: formatPercent(profile.returnOnEquity) },
    { label: 'ROA', value: formatPercent(profile.returnOnAssets) },
  ] : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-3 bg-card border-border/50">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
            className={`
              p-3 bg-card border-border/50 animate-fade-up
            `}
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="font-mono-numbers font-semibold text-sm truncate">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Profile Stats */}
      {profileStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profileStats.map((stat, i) => (
            <Card
              key={stat.label}
              className={`
                p-3 bg-card border-border/50 animate-fade-up
              `}
              style={{ animationDelay: `${(i + 8) * 0.03}s` }}
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="font-mono-numbers font-semibold text-sm truncate">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Analyst Rating */}
      {profile?.recommendationKey && (
        <Card className="p-4 bg-card border-border/50 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Analyst Rating</p>
              <p className="font-semibold capitalize">
                {profile.recommendationKey.replace('_', ' ')}
              </p>
            </div>
            {profile.targetMeanPrice && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Price Target</p>
                <p className="font-mono-numbers font-semibold text-cyan-500">
                  ${profile.targetMeanPrice.toFixed(2)}
                </p>
              </div>
            )}
            {profile.numberOfAnalysts && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Analysts</p>
                <p className="font-mono-numbers font-semibold">
                  {profile.numberOfAnalysts}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

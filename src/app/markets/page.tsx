'use client';

import { IndicesGrid } from '@/components/market/indices-grid';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function MarketsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
        </div>
        <p className="text-muted-foreground">
          Real-time overview of major market indices
        </p>
      </div>

      {/* Market Indices */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Major Indices</h2>
        <IndicesGrid />
      </section>

      {/* Market Status */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Market Status</h2>
        <Card className="p-6 bg-card border-border/50">
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">US Markets</p>
              <MarketStatus />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Trading Hours</p>
              <p className="font-medium">9:30 AM - 4:00 PM ET</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Data Source</p>
              <p className="font-medium">Yahoo Finance</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function MarketStatus() {
  const now = new Date();
  const hour = now.getUTCHours() - 5; // Convert to ET
  const day = now.getDay();

  const isWeekend = day === 0 || day === 6;
  const isMarketHours = hour >= 9.5 && hour < 16;
  const isPreMarket = hour >= 4 && hour < 9.5;
  const isAfterHours = hour >= 16 && hour < 20;

  if (isWeekend) {
    return (
      <span className="inline-flex items-center gap-2 text-muted-foreground font-medium">
        <span className="h-2 w-2 rounded-full bg-muted-foreground" />
        Closed (Weekend)
      </span>
    );
  }

  if (isMarketHours) {
    return (
      <span className="inline-flex items-center gap-2 text-gain font-medium">
        <span className="h-2 w-2 rounded-full bg-gain animate-pulse" />
        Open
      </span>
    );
  }

  if (isPreMarket) {
    return (
      <span className="inline-flex items-center gap-2 text-amber-500 font-medium">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        Pre-Market
      </span>
    );
  }

  if (isAfterHours) {
    return (
      <span className="inline-flex items-center gap-2 text-amber-500 font-medium">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        After Hours
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground font-medium">
      <span className="h-2 w-2 rounded-full bg-muted-foreground" />
      Closed
    </span>
  );
}

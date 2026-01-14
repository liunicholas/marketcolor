'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heatmap } from '@/components/market/heatmap';
import { useHeatmapData } from '@/hooks/use-market-data';

export default function HeatmapPage() {
  const { sectors, isLoading, error } = useHeatmapData();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border border-border p-8 text-center">
          <p className="font-mono text-sm mb-4">ERROR: FAILED TO LOAD HEATMAP DATA</p>
          <Link href="/">
            <Button variant="outline" className="font-mono text-xs">
              BACK TO HOME
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="font-mono text-xs h-7 px-2">
            ← BACK
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h1 className="font-mono text-xs text-muted-foreground mb-1">S&P 500 HEATMAP</h1>
        <p className="font-mono text-xs text-muted-foreground">
          Market cap weighted view of S&P 500 performance. Click any stock to view details.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.6)' }} />
          <span className="text-muted-foreground">GAIN</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }} />
          <span className="text-muted-foreground">LOSS</span>
        </div>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">SIZE = MARKET CAP</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">COLOR INTENSITY = % CHANGE</span>
      </div>

      {/* Heatmap */}
      <Heatmap sectors={sectors} isLoading={isLoading} />

      {/* Sector Summary */}
      {!isLoading && sectors.length > 0 && (
        <div className="mt-4 border border-border">
          <div className="px-4 py-2 border-b border-border bg-secondary/30 flex justify-between items-center">
            <span className="font-mono text-xs text-muted-foreground">SECTORS</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {sectors.reduce((sum, s) => sum + s.children.length, 0)} stocks loaded
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border">
            {sectors.map(sector => {
              const totalMarketCap = sector.children.reduce((sum, s) => sum + s.marketCap, 0);
              // Market-cap weighted average change
              const weightedChange = totalMarketCap > 0
                ? sector.children.reduce((sum, s) => sum + (s.changePercent * s.marketCap), 0) / totalMarketCap
                : 0;
              const isPositive = weightedChange >= 0;

              return (
                <div key={sector.name} className="bg-background p-3">
                  <div className="font-mono text-[10px] text-muted-foreground truncate">
                    {sector.name.toUpperCase()}
                  </div>
                  <div className={`font-mono text-xs font-bold ${isPositive ? 'text-gain' : 'text-loss'}`}>
                    {isPositive ? '+' : ''}{weightedChange.toFixed(2)}%
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {sector.children.length} stocks
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

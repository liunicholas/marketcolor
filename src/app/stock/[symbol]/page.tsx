'use client';

import { useState, use } from 'react';
import { useStockData } from '@/hooks/use-stock-data';
import { StockHeader } from '@/components/stock/stock-header';
import { StockChart } from '@/components/charts/stock-chart';
import { StatsGrid } from '@/components/stock/stats-grid';
import { AIAnalysis } from '@/components/analysis/ai-analysis';
import { ThesisTabs } from '@/components/analysis/thesis-tabs';
import { NewsFeed } from '@/components/news/news-feed';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TimeRange } from '@/types/stock';
import Link from 'next/link';

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

export default function StockPage({ params }: StockPageProps) {
  const { symbol } = use(params);
  const [range, setRange] = useState<TimeRange>('1M');

  const { data, isLoading, isValidating, error } = useStockData(symbol.toUpperCase(), range, {
    includeProfile: true,
    includeNews: true,
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border border-border p-8 text-center">
          <p className="font-mono text-lg mb-4">NOT FOUND: {symbol.toUpperCase()}</p>
          <Link href="/">
            <Button variant="outline" className="font-mono text-xs">
              BACK
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back */}
      <div className="mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="font-mono text-xs h-7 px-2">
            BACK
          </Button>
        </Link>
      </div>

      {/* Header */}
      <StockHeader quote={data?.quote || null} isLoading={isLoading} />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Left - Chart & Analysis */}
        <div className="lg:col-span-2 space-y-4">
          <StockChart
            history={data?.history || []}
            isLoading={isLoading}
            isValidating={isValidating}
            range={range}
            onRangeChange={setRange}
          />

          <StatsGrid
            quote={data?.quote || null}
            profile={data?.profile}
            isLoading={isLoading}
          />

          {/* AI Tabs */}
          <Tabs defaultValue="thesis" className="w-full">
            <TabsList className="w-full max-w-xs grid grid-cols-2 h-8 p-0 bg-transparent border border-border mb-4">
              <TabsTrigger
                value="thesis"
                className="font-mono text-xs h-full rounded-none data-[state=active]:bg-secondary border-r border-border"
              >
                THESIS
              </TabsTrigger>
              <TabsTrigger
                value="ask"
                className="font-mono text-xs h-full rounded-none data-[state=active]:bg-secondary"
              >
                ASK AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="thesis" forceMount className="mt-0 data-[state=inactive]:hidden">
              <ThesisTabs symbol={symbol.toUpperCase()} />
            </TabsContent>
            <TabsContent value="ask" forceMount className="mt-0 data-[state=inactive]:hidden">
              <AIAnalysis symbol={symbol.toUpperCase()} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right - Info & News */}
        <div className="space-y-4">
          {/* About */}
          {data?.profile?.description && (
            <div className="border border-border">
              <div className="px-4 py-2 border-b border-border bg-secondary/30">
                <span className="font-mono text-xs text-muted-foreground">ABOUT</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-6">
                  {data.profile.description}
                </p>
                {data.profile.website && (
                  <a
                    href={data.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 font-mono text-xs text-muted-foreground hover:text-foreground"
                  >
                    {data.profile.website}
                  </a>
                )}
              </div>
            </div>
          )}

          <NewsFeed news={data?.news || null} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

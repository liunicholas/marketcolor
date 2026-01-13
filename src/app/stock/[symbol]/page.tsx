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
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

export default function StockPage({ params }: StockPageProps) {
  const { symbol } = use(params);
  const [range, setRange] = useState<TimeRange>('1M');

  const { data, isLoading, error } = useStockData(symbol.toUpperCase(), range, {
    includeProfile: true,
    includeNews: true,
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Stock Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Could not find data for symbol &quot;{symbol.toUpperCase()}&quot;
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Stock Header */}
      <StockHeader quote={data?.quote || null} isLoading={isLoading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column - Chart & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <StockChart
            history={data?.history || []}
            isLoading={isLoading}
            range={range}
            onRangeChange={setRange}
          />

          {/* Stats Grid */}
          <StatsGrid
            quote={data?.quote || null}
            profile={data?.profile}
            isLoading={isLoading}
          />

          {/* AI Analysis Tabs */}
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50 mb-4">
              <TabsTrigger
                value="analysis"
                className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400"
              >
                AI Analysis
              </TabsTrigger>
              <TabsTrigger
                value="thesis"
                className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
              >
                Investment Thesis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis">
              <AIAnalysis symbol={symbol.toUpperCase()} />
            </TabsContent>
            <TabsContent value="thesis">
              <ThesisTabs symbol={symbol.toUpperCase()} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - News & Info */}
        <div className="space-y-6">
          {/* Company Description */}
          {data?.profile?.description && (
            <div className="p-4 rounded-lg bg-card border border-border/50 animate-fade-up">
              <h3 className="font-semibold mb-2">About {data.quote?.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-6">
                {data.profile.description}
              </p>
              {data.profile.website && (
                <a
                  href={data.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-cyan-500 hover:text-cyan-400 mt-3"
                >
                  Visit Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {/* News Feed */}
          <NewsFeed news={data?.news || null} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

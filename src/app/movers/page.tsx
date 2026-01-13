'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoversTable } from '@/components/market/movers-table';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

export default function MoversPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Market Movers</h1>
        </div>
        <p className="text-muted-foreground">
          Today&apos;s top performing and most active stocks
        </p>
      </div>

      {/* Movers Tabs */}
      <Tabs defaultValue="gainers" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 bg-secondary/50 mb-6">
          <TabsTrigger
            value="gainers"
            className="data-[state=active]:bg-gain/20 data-[state=active]:text-gain"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Top Gainers
          </TabsTrigger>
          <TabsTrigger
            value="losers"
            className="data-[state=active]:bg-loss/20 data-[state=active]:text-loss"
          >
            <TrendingDown className="mr-2 h-4 w-4" />
            Top Losers
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-500"
          >
            <Zap className="mr-2 h-4 w-4" />
            Most Active
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gainers">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gain">Top Gainers</h2>
              <p className="text-sm text-muted-foreground">
                Stocks with the highest % gain today
              </p>
            </div>
            <MoversTable type="gainers" limit={20} />
          </div>
        </TabsContent>

        <TabsContent value="losers">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-loss">Top Losers</h2>
              <p className="text-sm text-muted-foreground">
                Stocks with the highest % loss today
              </p>
            </div>
            <MoversTable type="losers" limit={20} />
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-cyan-500">Most Active</h2>
              <p className="text-sm text-muted-foreground">
                Stocks with the highest trading volume today
              </p>
            </div>
            <MoversTable type="active" limit={20} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

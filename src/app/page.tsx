'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { IndicesGrid } from '@/components/market/indices-grid';
import { MarketGrid } from '@/components/market/market-grid';
import { MoversTable } from '@/components/market/movers-table';
import { InlineSearch } from '@/components/layout/inline-search';
import { useFutures, useSectorETFs, useCommodities, useCurrencies } from '@/hooks/use-market-data';

export default function HomePage() {
  const marketsRef = useRef<HTMLElement>(null);
  const moversRef = useRef<HTMLElement>(null);
  const [moversPage, setMoversPage] = useState(1);
  const [activeTab, setActiveTab] = useState('gainers');
  const moversPerPage = 15;

  const { futures, isLoading: futuresLoading, error: futuresError } = useFutures();
  const { sectors, isLoading: sectorsLoading, error: sectorsError } = useSectorETFs();
  const { commodities, isLoading: commoditiesLoading, error: commoditiesError } = useCommodities();
  const { currencies, isLoading: currenciesLoading, error: currenciesError } = useCurrencies();

  // Handle hash-based scrolling on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#markets' && marketsRef.current) {
      marketsRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (hash === '#movers' && moversRef.current) {
      moversRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Reset page when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMoversPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search */}
      <div className="mb-8">
        <InlineSearch />
      </div>

      {/* Markets Section */}
      <section id="markets" ref={marketsRef} className="mb-8 scroll-mt-16">
        <div className="mb-4">
          <h2 className="font-mono text-xs text-muted-foreground mb-1">MARKETS</h2>
          <p className="font-mono text-xs text-muted-foreground">
            Real-time market data
          </p>
        </div>

        {/* Indices and Futures Row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <div className="border border-border">
            <div className="px-4 py-2 border-b border-border bg-secondary/30">
              <span className="font-mono text-xs text-muted-foreground">INDICES</span>
            </div>
            <IndicesGrid />
          </div>
          <MarketGrid
            title="FUTURES"
            items={futures}
            isLoading={futuresLoading}
            error={futuresError}
            columns={4}
          />
        </div>

        {/* Sector ETFs */}
        <div className="mb-4">
          <MarketGrid
            title="SECTOR ETFs"
            href="/sectors"
            items={sectors}
            isLoading={sectorsLoading}
            error={sectorsError}
            columns={4}
          />
        </div>

        {/* Commodities and Currencies Row */}
        <div className="grid lg:grid-cols-2 gap-4">
          <MarketGrid
            title="COMMODITIES"
            href="/commodities"
            items={commodities}
            isLoading={commoditiesLoading}
            error={commoditiesError}
            columns={4}
          />
          <MarketGrid
            title="CURRENCIES"
            href="/currencies"
            items={currencies}
            isLoading={currenciesLoading}
            error={currenciesError}
            columns={4}
          />
        </div>
      </section>

      {/* Movers Section */}
      <section id="movers" ref={moversRef} className="scroll-mt-16">
        <div className="mb-4">
          <h2 className="font-mono text-xs text-muted-foreground mb-1">MOVERS</h2>
          <p className="font-mono text-xs text-muted-foreground">
            Today&apos;s top performing and most active stocks
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3 h-8 p-0 bg-transparent border border-border mb-4">
            <TabsTrigger
              value="gainers"
              className="font-mono text-xs h-full rounded-none data-[state=active]:bg-secondary data-[state=active]:text-gain border-r border-border"
            >
              GAINERS
            </TabsTrigger>
            <TabsTrigger
              value="losers"
              className="font-mono text-xs h-full rounded-none data-[state=active]:bg-secondary data-[state=active]:text-loss border-r border-border"
            >
              LOSERS
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="font-mono text-xs h-full rounded-none data-[state=active]:bg-secondary"
            >
              ACTIVE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="mt-0">
            <MoversTable type="gainers" limit={moversPerPage} offset={(moversPage - 1) * moversPerPage} />
          </TabsContent>
          <TabsContent value="losers" className="mt-0">
            <MoversTable type="losers" limit={moversPerPage} offset={(moversPage - 1) * moversPerPage} />
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <MoversTable type="active" limit={moversPerPage} offset={(moversPage - 1) * moversPerPage} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 border border-border p-3">
          <span className="font-mono text-xs text-muted-foreground">
            PAGE {moversPage}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMoversPage((p) => Math.max(1, p - 1))}
              disabled={moversPage === 1}
              className="font-mono text-xs h-7 px-3"
            >
              PREV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMoversPage((p) => p + 1)}
              className="font-mono text-xs h-7 px-3"
            >
              NEXT
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

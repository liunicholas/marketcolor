'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndicesGrid } from '@/components/market/indices-grid';
import { MoversTable } from '@/components/market/movers-table';
import { SearchDialog } from '@/components/layout/search-dialog';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const quickStocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'TSLA', name: 'Tesla' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 text-center">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/50 text-sm text-muted-foreground mb-6 animate-fade-up">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            Powered by AI with Real-Time Web Search
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-up stagger-1">
            Stock Research,{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up stagger-2">
            Get AI-powered analysis, real-time market data, and professional charts.
            All in one place. No login required.
          </p>

          {/* Search Button */}
          <Button
            size="lg"
            onClick={() => setSearchOpen(true)}
            className="h-14 px-8 text-base bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-lg shadow-cyan-500/25 animate-fade-up stagger-3"
          >
            <Search className="mr-2 h-5 w-5" />
            Search any stock...
            <kbd className="ml-4 hidden sm:inline-flex h-6 items-center gap-1 rounded border border-white/20 bg-white/10 px-2 font-mono text-xs">
              ⌘K
            </kbd>
          </Button>

          {/* Quick Access */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-fade-up stagger-4">
            <span className="text-sm text-muted-foreground mr-2">Quick access:</span>
            {quickStocks.map((stock) => (
              <Button
                key={stock.symbol}
                variant="outline"
                size="sm"
                onClick={() => router.push(`/stock/${stock.symbol}`)}
                className="border-border/50 hover:border-cyan-500/50 hover:bg-cyan-500/10"
              >
                {stock.symbol}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Market Indices */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Market Indices</h2>
          <Button variant="ghost" size="sm" onClick={() => router.push('/markets')}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <IndicesGrid />
      </section>

      {/* Market Movers */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Market Movers</h2>
          <Button variant="ghost" size="sm" onClick={() => router.push('/movers')}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary/50 mb-4">
            <TabsTrigger
              value="gainers"
              className="data-[state=active]:bg-gain/20 data-[state=active]:text-gain"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Gainers
            </TabsTrigger>
            <TabsTrigger
              value="losers"
              className="data-[state=active]:bg-loss/20 data-[state=active]:text-loss"
            >
              <TrendingDown className="mr-2 h-4 w-4" />
              Losers
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
            <MoversTable type="gainers" limit={10} />
          </TabsContent>
          <TabsContent value="losers">
            <MoversTable type="losers" limit={10} />
          </TabsContent>
          <TabsContent value="active">
            <MoversTable type="active" limit={10} />
          </TabsContent>
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="py-12 border-t border-border/50">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
          Why MarketColor?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: 'AI-Powered Analysis',
              description:
                'Get comprehensive stock analysis powered by GPT-5 with real-time web search for up-to-date insights.',
              gradient: 'from-violet-500 to-purple-600',
            },
            {
              icon: TrendingUp,
              title: 'Professional Charts',
              description:
                'TradingView-quality candlestick and line charts with multiple timeframes and technical analysis.',
              gradient: 'from-cyan-500 to-blue-600',
            },
            {
              icon: Zap,
              title: 'Real-Time Data',
              description:
                'Live market data including quotes, fundamentals, market movers, and breaking news.',
              gradient: 'from-amber-500 to-orange-600',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`
                  relative p-6 rounded-xl bg-card border border-border/50
                  card-hover animate-fade-up
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-xl
                    bg-gradient-to-br ${feature.gradient} shadow-lg mb-4
                  `}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

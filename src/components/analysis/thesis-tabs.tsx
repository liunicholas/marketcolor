'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import {
  FileText,
  Loader2,
  Building2,
  DollarSign,
  Newspaper,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import type { InvestmentThesis } from '@/types/stock';

interface ThesisTabsProps {
  symbol: string;
}

export function ThesisTabs({ symbol }: ThesisTabsProps) {
  const [thesis, setThesis] = useState<InvestmentThesis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analysis/thesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate investment thesis');
      }

      const data = await response.json();
      setThesis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'thesis', label: 'Final Thesis', icon: CheckCircle, content: thesis?.finalThesis },
    { id: 'industry', label: 'Industry', icon: Building2, content: thesis?.industryAnalysis },
    { id: 'financial', label: 'Financial', icon: DollarSign, content: thesis?.financialAnalysis },
    { id: 'news', label: 'News', icon: Newspaper, content: thesis?.newsAnalysis },
  ];

  return (
    <Card className="bg-card border-border/50 animate-fade-up" style={{ animationDelay: '0.3s' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
            <FileText className="h-4 w-4 text-white" />
          </div>
          Investment Thesis
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            Multi-layer AI Analysis
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!thesis && !isLoading && (
          <div className="text-center py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Generate Investment Thesis</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
              Get a comprehensive investment analysis including industry position,
              financial health, news sentiment, and a final thesis.
            </p>
            <Button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Thesis
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="py-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              <span className="text-sm text-muted-foreground">
                Generating comprehensive analysis...
              </span>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-loss/10 border border-loss/20 text-loss text-sm">
            {error}
          </div>
        )}

        {thesis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading}
                className="border-border/50"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
              <p className="text-xs text-muted-foreground">
                Generated {new Date(thesis.generatedAt).toLocaleString()}
              </p>
            </div>

            <Tabs defaultValue="thesis" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                    >
                      <Icon className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
                    <ReactMarkdown>{tab.content || 'No content available'}</ReactMarkdown>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

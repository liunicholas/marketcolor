'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface ThesisTabsProps {
  symbol: string;
}

export function ThesisTabs({ symbol }: ThesisTabsProps) {
  const [thesis, setThesis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setThesis('');

    try {
      const response = await fetch('/api/analysis/thesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate investment thesis');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setThesis(prev => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-border">
      <div className="px-4 py-2 border-b border-border bg-secondary/30 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">INVESTMENT THESIS</span>
        {thesis && !isLoading && (
          <span className="font-mono text-xs text-muted-foreground">
            {new Date().toLocaleString()}
          </span>
        )}
      </div>

      <div className="p-4">
        {!thesis && !isLoading && (
          <div className="text-center py-6">
            <p className="font-mono text-sm text-muted-foreground mb-4">
              Generate a comprehensive investment thesis including industry analysis,
              financials, news sentiment, and a buy/hold/sell recommendation.
            </p>
            <Button
              onClick={handleGenerate}
              variant="outline"
              className="font-mono text-xs h-8"
            >
              GENERATE THESIS
            </Button>
          </div>
        )}

        {error && (
          <div className="p-3 border border-loss bg-loss/10 font-mono text-xs text-loss">
            ERROR: {error}
          </div>
        )}

        {(thesis || isLoading) && (
          <div className="space-y-4">
            {thesis && !isLoading && (
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  className="font-mono text-xs h-7"
                >
                  REGENERATE
                </Button>
              </div>
            )}

            <div className="prose prose-sm dark:prose-invert max-w-none font-mono text-sm leading-relaxed prose-headings:font-mono prose-headings:font-bold prose-headings:text-foreground prose-headings:text-sm prose-headings:mt-4 prose-headings:mb-2 prose-p:text-muted-foreground prose-p:my-2 prose-strong:text-foreground prose-li:text-muted-foreground prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2">
              <ReactMarkdown>{thesis}</ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-0.5" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

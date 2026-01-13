'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  symbol: string;
}

export function AIAnalysis({ symbol }: AIAnalysisProps) {
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, question: prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
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
        setAnalysis(prev => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-border">
      <div className="px-4 py-2 border-b border-border bg-secondary/30">
        <span className="font-mono text-xs text-muted-foreground">ASK AI</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Input */}
        <Textarea
          placeholder="Ask about this stock..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[60px] font-mono text-sm bg-background border-border resize-none"
        />

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            variant="outline"
            className="font-mono text-xs h-8"
          >
            {isLoading ? 'ANALYZING...' : 'ANALYZE'}
          </Button>

          {analysis && !isLoading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAnalyze}
              className="font-mono text-xs h-8"
            >
              REFRESH
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 border border-loss bg-loss/10 text-loss text-sm font-mono">
            ERROR: {error}
          </div>
        )}

        {/* Streaming Output */}
        {(analysis || isLoading) && (
          <div className="pt-4 border-t border-border">
            <div className="prose prose-sm dark:prose-invert max-w-none font-mono text-sm leading-relaxed prose-headings:font-mono prose-headings:font-bold prose-headings:text-foreground prose-headings:text-sm prose-headings:mt-4 prose-headings:mb-2 prose-p:text-muted-foreground prose-p:my-2 prose-strong:text-foreground prose-li:text-muted-foreground prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2">
              <ReactMarkdown>{analysis}</ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-0.5" />
              )}
            </div>

            {!isLoading && analysis && (
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {new Date().toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

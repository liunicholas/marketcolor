'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import type { AIAnalysis as AIAnalysisType } from '@/types/stock';

interface AIAnalysisProps {
  symbol: string;
}

export function AIAnalysis({ symbol }: AIAnalysisProps) {
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<AIAnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, question: prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border/50 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          AI Analysis
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            Powered by GPT-5 with Web Search
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-3">
          <Textarea
            placeholder="Ask anything about this stock... (e.g., 'What are the growth prospects?' or 'Summarize recent news')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] bg-secondary/30 border-border/50 resize-none focus:border-cyan-500/50"
          />

          <div className="flex items-center gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Analysis
                </>
              )}
            </Button>

            {analysis && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="border-border/50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-loss/10 border border-loss/20 text-loss text-sm">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !analysis && (
          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {/* Analysis Output */}
        {analysis && (
          <div className="pt-4 border-t border-border/50">
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
              <ReactMarkdown>{analysis.analysis}</ReactMarkdown>
            </div>

            {/* Citations */}
            {analysis.citations && analysis.citations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-2">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.citations.slice(0, 5).map((citation, index) => (
                    <a
                      key={index}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {citation.title || `Source ${index + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <p className="mt-4 text-xs text-muted-foreground/60">
              Generated {new Date(analysis.generatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

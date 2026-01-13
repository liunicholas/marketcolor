'use client';

import type { NewsItem } from '@/types/stock';

interface NewsFeedProps {
  news: NewsItem[] | null;
  isLoading?: boolean;
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function NewsFeed({ news, isLoading }: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="border border-border">
        <div className="px-4 py-2 border-b border-border">
          <span className="font-mono text-xs text-muted-foreground">NEWS</span>
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3">
              <div className="h-4 w-full bg-secondary animate-pulse mb-2" />
              <div className="h-3 w-24 bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="border border-border">
        <div className="px-4 py-2 border-b border-border">
          <span className="font-mono text-xs text-muted-foreground">NEWS</span>
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground font-mono">NO NEWS</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border">
      <div className="px-4 py-2 border-b border-border">
        <span className="font-mono text-xs text-muted-foreground">NEWS</span>
      </div>
      <div className="divide-y divide-border">
        {news.slice(0, 8).map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 hover:bg-secondary/30"
          >
            <h4 className="text-sm line-clamp-2 mb-1">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="truncate">{item.publisher}</span>
              <span>|</span>
              <span className="shrink-0">{formatDateTime(item.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

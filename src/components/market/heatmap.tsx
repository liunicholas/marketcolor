'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import type { HeatmapSector, HeatmapStock } from '@/types/stock';

interface HeatmapProps {
  sectors: HeatmapSector[];
  isLoading?: boolean;
}

// Format market cap for display
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
}

// Transform data for recharts Treemap format
function transformData(sectors: HeatmapSector[]) {
  return sectors
    .filter(sector => sector.children.length > 0)
    .map(sector => ({
      name: sector.name,
      children: sector.children.map(stock => ({
        name: stock.symbol,
        size: stock.marketCap,
        stock: stock,
      })),
    }));
}

// Custom content renderer - renders both rectangle and HTML-like text
function CustomContent(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  depth?: number;
  stock?: HeatmapStock;
  root?: { x: number; y: number; width: number; height: number };
  onClick?: (stock: HeatmapStock) => void;
  onMouseEnter?: (stock: HeatmapStock, x: number, y: number, width: number, height: number) => void;
  onMouseLeave?: () => void;
}) {
  const { x = 0, y = 0, width = 0, height = 0, depth, stock, onClick, onMouseEnter, onMouseLeave } = props;

  // Only render leaf nodes (stocks, not sectors)
  if (depth !== 2 || !stock) return null;

  const isPositive = stock.changePercent >= 0;

  // Calculate color intensity based on percent change (cap at 5%)
  const absChange = Math.abs(stock.changePercent);
  const intensity = Math.min(absChange / 5, 1);
  const baseOpacity = 0.5;
  const maxOpacity = 0.95;
  const opacity = baseOpacity + intensity * (maxOpacity - baseOpacity);

  const bgColor = isPositive
    ? `rgba(34, 197, 94, ${opacity})`
    : `rgba(239, 68, 68, ${opacity})`;

  // Determine what to show based on cell size
  const showTicker = width > 30 && height > 20;
  const showPrice = width > 48 && height > 38;
  const showPercent = width > 40 && height > 52;

  // Calculate font sizes
  const tickerSize = Math.min(Math.max(width / 4.5, 8), 14);
  const priceSize = Math.min(Math.max(width / 6, 7), 11);
  const percentSize = Math.min(Math.max(width / 6, 7), 11);

  const handleClick = () => {
    if (onClick) onClick(stock);
  };

  const handleMouseEnter = () => {
    if (onMouseEnter) onMouseEnter(stock, x, y, width, height);
  };

  return (
    <g
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={bgColor}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={1}
      />
      {showTicker && (
        <foreignObject x={x} y={y} width={width} height={height}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                color: 'white',
                fontWeight: 700,
                fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
                fontSize: tickerSize,
                lineHeight: 1,
              }}
            >
              {stock.symbol}
            </span>
            {showPrice && (
              <span
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
                  fontSize: priceSize,
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                ${stock.price.toFixed(2)}
              </span>
            )}
            {showPercent && (
              <span
                style={{
                  color: 'white',
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
                  fontSize: percentSize,
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export function Heatmap({ sectors, isLoading }: HeatmapProps) {
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    stock: HeatmapStock;
    x: number;
    y: number;
  } | null>(null);

  const handleClick = useCallback((stock: HeatmapStock) => {
    router.push(`/stock/${stock.symbol}`);
  }, [router]);

  const handleMouseEnter = useCallback((stock: HeatmapStock, x: number, y: number, width: number, height: number) => {
    // Get the SVG container position
    const svg = document.querySelector('.recharts-responsive-container svg');
    if (svg) {
      const rect = svg.getBoundingClientRect();
      setTooltip({
        stock,
        x: rect.left + x + width / 2,
        y: rect.top + y + height / 2,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const treeData = useMemo(() => transformData(sectors), [sectors]);

  if (isLoading) {
    return (
      <div className="border border-border">
        <div className="h-[600px] w-full bg-secondary/30 animate-pulse flex items-center justify-center">
          <span className="font-mono text-xs text-muted-foreground">LOADING S&P 500 DATA...</span>
        </div>
      </div>
    );
  }

  if (!sectors.length) {
    return (
      <div className="border border-border">
        <div className="h-[600px] w-full flex items-center justify-center">
          <span className="font-mono text-xs text-muted-foreground">NO DATA AVAILABLE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border">
      <div className="relative h-[600px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treeData}
            dataKey="size"
            stroke="transparent"
            content={
              <CustomContent
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            }
            isAnimationActive={false}
            aspectRatio={1}
          />
        </ResponsiveContainer>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="bg-popover border border-border p-2 font-mono text-xs shadow-lg rounded">
            <div className="font-bold text-sm">{tooltip.stock.symbol}</div>
            <div className="text-muted-foreground text-[10px]">{tooltip.stock.sector}</div>
            <div className="mt-1">${tooltip.stock.price.toFixed(2)}</div>
            <div className={tooltip.stock.changePercent >= 0 ? 'text-gain' : 'text-loss'}>
              {tooltip.stock.changePercent >= 0 ? '+' : ''}
              {tooltip.stock.changePercent.toFixed(2)}%
            </div>
            <div className="text-muted-foreground mt-1">
              MCap: {formatMarketCap(tooltip.stock.marketCap)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

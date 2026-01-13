import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceBadgeProps {
  change: number;
  changePercent: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function PriceBadge({
  change,
  changePercent,
  size = 'md',
  showIcon = true,
  className,
}: PriceBadgeProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center font-mono-numbers font-medium rounded-md transition-all',
        sizeClasses[size],
        isNeutral
          ? 'bg-muted text-muted-foreground'
          : isPositive
            ? 'bg-gain/10 text-gain'
            : 'bg-loss/10 text-loss',
        className
      )}
    >
      {showIcon && (
        <>
          {isNeutral ? (
            <Minus className={iconSizes[size]} />
          ) : isPositive ? (
            <TrendingUp className={iconSizes[size]} />
          ) : (
            <TrendingDown className={iconSizes[size]} />
          )}
        </>
      )}
      <span>
        {isPositive ? '+' : ''}
        {change.toFixed(2)}
      </span>
      <span className="opacity-75">
        ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
      </span>
    </div>
  );
}

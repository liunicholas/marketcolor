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
  className,
}: PriceBadgeProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span
      className={cn(
        'font-mono',
        sizeClasses[size],
        isNeutral
          ? 'text-muted-foreground'
          : isPositive
            ? 'text-gain'
            : 'text-loss',
        className
      )}
    >
      {isPositive ? '▲' : isNeutral ? '-' : '▼'} {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
    </span>
  );
}

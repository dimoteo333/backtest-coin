'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function MetricCard({ title, value, subtitle, trend = 'neutral', className }: MetricCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p
          className={cn(
            'text-2xl font-bold mt-1',
            trend === 'up' && 'text-green-600 dark:text-green-400',
            trend === 'down' && 'text-red-600 dark:text-red-400'
          )}
        >
          {value}
        </p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

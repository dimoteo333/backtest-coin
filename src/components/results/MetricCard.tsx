'use client';

import { Card, CardContent } from '@/components/ui/card';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  helpTitle?: string;
  helpContent?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend = 'neutral',
  className,
  helpTitle,
  helpContent,
}: MetricCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-muted-foreground">{title}</p>
          {helpTitle && helpContent && (
            <HelpTooltip title={helpTitle} content={helpContent} iconSize={12} />
          )}
        </div>
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

'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface HelpTooltipProps {
    title: string;
    content: React.ReactNode;
    className?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    iconSize?: number;
}

export function HelpTooltip({
    title,
    content,
    className,
    side = 'top',
    iconSize = 14,
}: HelpTooltipProps) {
    return (
        <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'inline-flex items-center justify-center rounded-full',
                        'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                        'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                        'p-0.5',
                        className
                    )}
                    aria-label={`Help: ${title}`}
                >
                    <HelpCircle size={iconSize} />
                </button>
            </TooltipTrigger>
            <TooltipContent
                side={side}
                className="max-w-xs p-0 bg-popover text-popover-foreground border shadow-lg rounded-lg overflow-hidden"
            >
                <div className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">{title}</h4>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                        {content}
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}

// Labeled field with help tooltip
interface LabelWithHelpProps {
    label: string;
    helpTitle: string;
    helpContent: React.ReactNode;
    className?: string;
    required?: boolean;
}

export function LabelWithHelp({
    label,
    helpTitle,
    helpContent,
    className,
    required,
}: LabelWithHelpProps) {
    return (
        <div className={cn('flex items-center gap-1.5', className)}>
            <span className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </span>
            <HelpTooltip title={helpTitle} content={helpContent} />
        </div>
    );
}

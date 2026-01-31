'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { ENVIRONMENT_HELP } from '@/lib/help-content';
import { useEnvironmentStore } from '@/stores';

export function DateRangePicker() {
  const { environment, setDateRange } = useEnvironmentStore();

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(e.target.value, environment.dateRange.endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(environment.dateRange.startDate, e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label>기간 설정</Label>
        <HelpTooltip
          title={ENVIRONMENT_HELP.dateRange.title}
          content={ENVIRONMENT_HELP.dateRange.content}
          iconSize={13}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="start-date" className="sr-only">
            시작일
          </Label>
          <Input
            id="start-date"
            type="date"
            value={environment.dateRange.startDate}
            onChange={handleStartDateChange}
            max={environment.dateRange.endDate}
          />
        </div>
        <span className="flex items-center text-muted-foreground">~</span>
        <div className="flex-1">
          <Label htmlFor="end-date" className="sr-only">
            종료일
          </Label>
          <Input
            id="end-date"
            type="date"
            value={environment.dateRange.endDate}
            onChange={handleEndDateChange}
            min={environment.dateRange.startDate}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
    </div>
  );
}

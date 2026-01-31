'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <Label>Date Range</Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="start-date" className="sr-only">
            Start Date
          </Label>
          <Input
            id="start-date"
            type="date"
            value={environment.dateRange.startDate}
            onChange={handleStartDateChange}
            max={environment.dateRange.endDate}
          />
        </div>
        <span className="flex items-center text-muted-foreground">to</span>
        <div className="flex-1">
          <Label htmlFor="end-date" className="sr-only">
            End Date
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

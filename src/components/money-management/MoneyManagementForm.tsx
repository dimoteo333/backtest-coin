'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderSizeInput } from './OrderSizeInput';
import { LeverageSlider } from './LeverageSlider';
import { PositionDirectionSelector } from './PositionDirectionSelector';

export function MoneyManagementForm() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Money Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderSizeInput />
        <PositionDirectionSelector />
        <LeverageSlider />
      </CardContent>
    </Card>
  );
}

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIStrategyForm } from './AIStrategyForm';
import { ManualStrategyForm } from './ManualStrategyForm';
import { Sparkles, Settings2 } from 'lucide-react';

export function StrategyForm() {
  return (
    <Tabs defaultValue="ai" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ai">
          <Sparkles className="h-4 w-4" />
          AI 생성
        </TabsTrigger>
        <TabsTrigger value="manual">
          <Settings2 className="h-4 w-4" />
          수동 설정
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ai">
        <AIStrategyForm />
      </TabsContent>
      <TabsContent value="manual">
        <ManualStrategyForm />
      </TabsContent>
    </Tabs>
  );
}

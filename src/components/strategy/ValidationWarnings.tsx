'use client';

import { ValidationWarning } from '@/types/ai-strategy';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface ValidationWarningsProps {
  warnings: ValidationWarning[];
}

export function ValidationWarnings({ warnings }: ValidationWarningsProps) {
  if (warnings.length === 0) {
    return null;
  }

  const errors = warnings.filter(w => w.severity === 'error');
  const warningItems = warnings.filter(w => w.severity === 'warning');

  return (
    <div className="space-y-3">
      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            <Badge variant="destructive">오류</Badge>
            {errors.length}개의 오류가 발견되었습니다
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error.message}
                  {error.suggestion && (
                    <div className="ml-5 mt-1 text-xs flex items-start gap-1">
                      <span>💡</span>
                      <span className="opacity-90">{error.suggestion}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {warningItems.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            <Badge variant="outline">경고</Badge>
            {warningItems.length}개의 경고가 있습니다
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {warningItems.map((warning, index) => (
                <li key={index} className="text-sm">
                  {warning.message}
                  {warning.suggestion && (
                    <div className="ml-5 mt-1 text-xs flex items-start gap-1">
                      <span>💡</span>
                      <span className="opacity-90">{warning.suggestion}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

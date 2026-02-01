import { StrategyLogic } from './strategy';

export type InvestmentProfile = 'aggressive' | 'stable';

export interface AIStrategyRequest {
  profile: InvestmentProfile;
  stopLossPercent: number;
  takeProfitPercent: number;
  description: string;
}

export interface AIStrategyResponse {
  success: boolean;
  strategy?: StrategyLogic;
  warnings?: ValidationWarning[];
  error?: {
    code: 'OPENAI_ERROR' | 'VALIDATION_ERROR' | 'INVALID_JSON' | 'RATE_LIMIT';
    message: string;
    details?: string;
  };
}

export interface ValidationWarning {
  severity: 'warning' | 'error';
  category: 'indicator' | 'risk' | 'logic';
  message: string;
  suggestion?: string;
}

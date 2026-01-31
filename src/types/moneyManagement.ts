// Money management configuration
export interface MoneyManagement {
  // Order mode
  orderMode: 'percentOfBalance' | 'fixedAmount';

  // Order size
  orderSize: {
    mode: 'percentOfBalance' | 'fixedAmount';
    value: number;             // e.g., 50 (50%) or 1000 (1000 USDT)
    description: string;       // UI display "50% of balance"
  };

  // Leverage (futures trading)
  leverage: number;            // 1-100x (default: 1x)
  leverageEnabled: boolean;

  // Position direction
  positionDirection: 'long' | 'short' | 'both';
  positionDirectionLabel: string;
}

// Default money management
export const DEFAULT_MONEY_MANAGEMENT: MoneyManagement = {
  orderMode: 'percentOfBalance',
  orderSize: {
    mode: 'percentOfBalance',
    value: 100,
    description: '100% of balance',
  },
  leverage: 1,
  leverageEnabled: false,
  positionDirection: 'long',
  positionDirectionLabel: 'Long Only',
};

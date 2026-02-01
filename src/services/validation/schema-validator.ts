import { StrategyLogic, Condition } from '@/types/strategy';
import { ValidationWarning } from '@/types/ai-strategy';

export function validateStrategySchema(strategy: StrategyLogic): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check entry conditions
  if (!strategy.entryCondition?.conditions || strategy.entryCondition.conditions.length === 0) {
    warnings.push({
      severity: 'error',
      category: 'logic',
      message: '진입 조건이 없습니다',
      suggestion: '최소 1개의 진입 조건이 필요합니다'
    });
  } else {
    strategy.entryCondition.conditions.forEach((condition, index) => {
      warnings.push(...validateCondition(condition, `진입 조건 ${index + 1}`));
    });
  }

  // Check exit conditions
  if (!strategy.exitCondition?.conditions || strategy.exitCondition.conditions.length === 0) {
    warnings.push({
      severity: 'error',
      category: 'logic',
      message: '청산 조건이 없습니다',
      suggestion: '최소 1개의 청산 조건이 필요합니다'
    });
  } else {
    strategy.exitCondition.conditions.forEach((condition, index) => {
      warnings.push(...validateCondition(condition, `청산 조건 ${index + 1}`));
    });
  }

  // Check stop loss
  if (strategy.stopLoss?.enabled) {
    if (strategy.stopLoss.percentage <= 0) {
      warnings.push({
        severity: 'error',
        category: 'risk',
        message: '손절 비율은 양수여야 합니다',
      });
    }
    if (strategy.stopLoss.percentage > 50) {
      warnings.push({
        severity: 'warning',
        category: 'risk',
        message: '손절 비율이 매우 높습니다 (50% 초과)',
        suggestion: '리스크 관리를 위해 5-10% 권장'
      });
    }
  }

  // Check take profit
  if (strategy.takeProfit?.enabled) {
    if (strategy.takeProfit.percentage <= 0) {
      warnings.push({
        severity: 'error',
        category: 'risk',
        message: '익절 비율은 양수여야 합니다',
      });
    }
  }

  // Check unique IDs
  const allIds = [
    ...strategy.entryCondition.conditions.map(c => c.id),
    ...strategy.exitCondition.conditions.map(c => c.id)
  ];
  const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    warnings.push({
      severity: 'error',
      category: 'logic',
      message: `중복된 조건 ID: ${duplicateIds.join(', ')}`,
      suggestion: '각 조건은 고유한 ID를 가져야 합니다'
    });
  }

  return warnings;
}

function validateCondition(condition: Condition, label: string): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check required fields
  if (!condition.id) {
    warnings.push({
      severity: 'error',
      category: 'logic',
      message: `${label}: ID가 없습니다`
    });
  }

  if (!condition.type) {
    warnings.push({
      severity: 'error',
      category: 'logic',
      message: `${label}: 타입이 없습니다`
    });
  }

  if (!condition.comparison) {
    warnings.push({
      severity: 'error',
      category: 'logic',
      message: `${label}: 비교 연산자가 없습니다`
    });
  }

  if (!condition.description) {
    warnings.push({
      severity: 'error',
      category: 'logic',
      message: `${label}: 설명이 없습니다`
    });
  }

  // Type-specific validation
  if (condition.type === 'indicator_threshold' || condition.type === 'indicator_compare') {
    if (!condition.indicator) {
      warnings.push({
        severity: 'error',
        category: 'indicator',
        message: `${label}: 지표가 지정되지 않았습니다`
      });
    }

    if (condition.indicatorPeriod !== undefined && condition.indicatorPeriod < 1) {
      warnings.push({
        severity: 'error',
        category: 'indicator',
        message: `${label}: 지표 기간은 1 이상이어야 합니다`
      });
    }
  }

  // RSI value validation
  if (condition.indicator === 'RSI') {
    if (condition.value !== undefined && (condition.value < 0 || condition.value > 100)) {
      warnings.push({
        severity: 'error',
        category: 'indicator',
        message: `${label}: RSI 값은 0-100 범위여야 합니다 (현재: ${condition.value})`
      });
    }
  }

  // Check for indicator_compare requirements
  if (condition.type === 'indicator_compare') {
    if (!condition.compareToIndicator) {
      warnings.push({
        severity: 'error',
        category: 'indicator',
        message: `${label}: 비교 대상 지표가 없습니다`
      });
    }
  }

  return warnings;
}

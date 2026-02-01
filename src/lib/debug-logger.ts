/**
 * Debug logger for backtest operations
 * Provides consistent, structured console logging
 */

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

interface LogOptions {
  enabled?: boolean;
  level?: LogLevel;
  data?: Record<string, unknown>;
}

class DebugLogger {
  private enabled: boolean = false;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private formatMessage(level: LogLevel, category: string, message: string): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍',
    }[level];

    return `[${timestamp}] ${emoji} [${category}] ${message}`;
  }

  private getColor(level: LogLevel): string {
    return {
      info: 'color: #3b82f6',
      success: 'color: #10b981',
      warning: 'color: #f59e0b',
      error: 'color: #ef4444',
      debug: 'color: #8b5cf6',
    }[level];
  }

  log(category: string, message: string, options: LogOptions = {}) {
    if (!this.enabled && !options.enabled) return;

    const level = options.level || 'info';
    const formattedMessage = this.formatMessage(level, category, message);
    const color = this.getColor(level);

    console.log(`%c${formattedMessage}`, color);

    if (options.data) {
      console.log(`%c  └─ Data:`, 'color: #6b7280', options.data);
    }
  }

  group(category: string, title: string, collapsed: boolean = false) {
    if (!this.enabled) return;

    const method = collapsed ? console.groupCollapsed : console.group;
    method(`🔍 [${category}] ${title}`);
  }

  groupEnd() {
    if (!this.enabled) return;
    console.groupEnd();
  }

  table(data: unknown[]) {
    if (!this.enabled) return;
    console.table(data);
  }

  // Convenience methods
  dataReceived(source: string, count: number, metadata?: Record<string, unknown>) {
    this.log('DATA', `Received ${count} candles from ${source}`, {
      level: 'success',
      data: metadata,
    });
  }

  strategyEvaluation(candleIndex: number, timestamp: number, action: string) {
    this.log('STRATEGY', `[Candle ${candleIndex}] ${action} at ${new Date(timestamp).toISOString()}`, {
      level: 'debug',
    });
  }

  indicatorUpdate(name: string, value: number, period?: number) {
    const indicator = period ? `${name}(${period})` : name;
    this.log('INDICATOR', `${indicator} = ${value.toFixed(4)}`, {
      level: 'debug',
    });
  }

  conditionEval(type: 'entry' | 'exit', result: boolean, description: string) {
    this.log('CONDITION', `${type.toUpperCase()} ${result ? '✓' : '✗'} ${description}`, {
      level: result ? 'success' : 'debug',
    });
  }

  tradeAction(action: 'ENTRY' | 'EXIT', price: number, reason: string, pnl?: number) {
    const pnlText = pnl !== undefined ? ` (PnL: ${pnl > 0 ? '+' : ''}${pnl.toFixed(2)} USDT)` : '';
    this.log('TRADE', `${action} at $${price.toFixed(2)} - ${reason}${pnlText}`, {
      level: action === 'ENTRY' ? 'info' : 'success',
    });
  }

  error(category: string, message: string, error?: Error) {
    this.log(category, message, {
      level: 'error',
      data: error ? { message: error.message, stack: error.stack } : undefined,
    });
  }
}

export const logger = new DebugLogger();

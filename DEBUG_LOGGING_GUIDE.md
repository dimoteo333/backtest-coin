# Enhanced Backtest Logging - User Guide

## Overview

Comprehensive debug logging has been added to the backtest system to help you understand exactly what's happening at each step of the data pipeline and strategy execution.

## What Was Added

### 1. Debug Logger System (`src/lib/debug-logger.ts`)
- Centralized logging utility with color-coded output
- Structured logging with categories and severity levels
- Can be enabled/disabled via UI toggle

### 2. Data Loading Logs (`src/hooks/useDataLoader.ts`)
- ✅ When data loading starts
- ✅ Source detection (Mock vs Binance vs Cache)
- ✅ Data received confirmation with metadata
- ✅ Cache hits/misses
- ✅ Errors and fallbacks

### 3. Indicator Calculation Logs (`src/services/backtest/cpuEngine.ts`)
- ✅ Pre-calculation phase for all indicators
- ✅ Each indicator type (RSI, SMA, EMA, MACD, BB)
- ✅ Calculation time in milliseconds

### 4. Strategy Evaluation Logs
- ✅ Entry condition evaluation (every condition checked)
- ✅ Exit condition evaluation
- ✅ Condition results (✓ pass / ✗ fail)
- ✅ Indicator values at evaluation time

### 5. Trade Execution Logs
- ✅ Entry signals with price and position size
- ✅ Exit signals with reason (stop loss, take profit, exit condition)
- ✅ Profit/Loss for each trade
- ✅ Fees and total cost

### 6. Backtest Summary Logs
- ✅ Total execution time
- ✅ Number of trades
- ✅ Final equity and returns
- ✅ Win rate

## How to Use

### Step 1: Enable Debug Mode

1. Open the application in your browser
2. Find the "디버그 모드 (콘솔 로그)" toggle in the data section (top of left panel)
3. Click the switch to enable it
4. Open your browser's Developer Console (F12 or Cmd+Option+I)

### Step 2: Load Data

When you load data (either from Binance or Mock), you'll see logs like:

```
[12:34:56] ℹ️ [DATA_LOADER] Starting data load: BINANCE - BTCUSDT 1h
  └─ Data: {symbol: 'BTCUSDT', timeframe: '1h', ...}

[12:34:57] ✅ [DATA] Received 1000 candles from BINANCE
  └─ Data: {firstCandle: '2024-01-01T00:00:00.000Z', lastCandle: '...'}
```

### Step 3: Run Backtest

Click "백테스트 실행" and watch the console for detailed logs:

#### A. Initialization
```
[12:35:00] ℹ️ [BACKTEST] ═══════════════════════════════════════
[12:35:00] ℹ️ [BACKTEST] Starting backtest execution
  └─ Data: {candles: 1000, symbol: 'BTCUSDT', ...}
```

#### B. Indicator Calculation
```
[12:35:00] 🔍 [INDICATORS] Pre-calculating indicators for 1000 candles
[12:35:00] 🔍 [INDICATORS] RSI(14) calculated
[12:35:00] 🔍 [INDICATORS] SMA(20) calculated
[12:35:00] ✅ [INDICATORS] All indicators calculated in 45.23ms
```

#### C. Strategy Evaluation (Entry)
```
[12:35:01] 🔍 [CONDITION] Evaluating entry conditions (AND)
[12:35:01] ✅ [CONDITION] RSI(14) < 30: ✓ (RSI(14)=28.5432 < 30)
[12:35:01] ✅ [CONDITION] ENTRY result: ✓ TRUE
[12:35:01] ℹ️ [TRADE] ENTRY at $42150.50 - entry_condition
[12:35:01] 🔍 [TRADE] Position size: 0.02371234 (Cost: 1000.00 USDT, Fee: 0.75)
```

#### D. Strategy Evaluation (Exit)
```
[12:35:05] 🔍 [CONDITION] Evaluating exit conditions (AND)
[12:35:05] ✅ [CONDITION] RSI(14) > 70: ✓ (RSI(14)=72.3456 > 70)
[12:35:05] ✅ [CONDITION] EXIT result: ✓ TRUE
[12:35:05] ✅ [TRADE] EXIT at $43250.75 - exit_condition (PnL: +25.50 USDT)
```

#### E. Stop Loss / Take Profit
```
[12:35:10] ⚠️ [TRADE] Stop loss triggered at $40050.25 (PnL: -5.00%)
[12:35:15] ✅ [TRADE] Take profit triggered at $46350.50 (PnL: +10.00%)
```

#### F. Final Summary
```
[12:35:20] ℹ️ [BACKTEST] ═══════════════════════════════════════
[12:35:20] ✅ [BACKTEST] Backtest completed in 543.21ms
  └─ Data: {
    totalTrades: 15,
    finalEquity: 11250.50,
    totalReturn: '+12.5%',
    winRate: '60.0%'
  }
```

## Log Categories

| Icon | Category | Color | Purpose |
|------|----------|-------|---------|
| ℹ️ | INFO | Blue | General information |
| ✅ | SUCCESS | Green | Successful operations |
| ⚠️ | WARNING | Orange | Warnings (e.g., stop loss) |
| ❌ | ERROR | Red | Errors |
| 🔍 | DEBUG | Purple | Detailed debug info |

## Log Sections

### 🔹 DATA_LOADER
- When: Data is being fetched
- Shows: Source, progress, candle count, date range
- Use Case: Verify Binance data was received correctly

### 🔹 INDICATORS
- When: Indicators are being calculated
- Shows: Each indicator type, calculation time
- Use Case: Verify indicators are being computed

### 🔹 CONDITION
- When: Strategy conditions are evaluated
- Shows: Each condition result, operator logic (AND/OR)
- Use Case: **Understand why trades are/aren't triggered**

### 🔹 TRADE
- When: Trades are entered or exited
- Shows: Price, reason, PnL, position size, fees
- Use Case: Track every trade execution

### 🔹 BACKTEST
- When: Backtest starts and completes
- Shows: Execution time, total trades, final results
- Use Case: Performance monitoring

## Troubleshooting with Logs

### Problem: "No trades are being generated"

**Look for:**
```
🔍 [CONDITION] Evaluating entry conditions (AND)
🔍 [CONDITION] RSI(14) < 30: ✗ (RSI(14)=45.2341 < 30)
🔍 [CONDITION] ENTRY result: ✗ FALSE
```

**Solution:** Your RSI never reaches 30. Adjust the threshold or try a different condition.

### Problem: "Too many trades"

**Look for:**
```
ℹ️ [TRADE] ENTRY at $42000.00 - entry_condition
ℹ️ [TRADE] EXIT at $42050.00 - exit_condition (PnL: +1.20 USDT)
ℹ️ [TRADE] ENTRY at $42100.00 - entry_condition
ℹ️ [TRADE] EXIT at $42150.00 - exit_condition (PnL: +1.20 USDT)
```

**Solution:** Conditions are too loose. Add more restrictive filters.

### Problem: "Strategy triggers at wrong times"

**Look for:**
```
🔍 [CONDITION] Evaluating entry conditions (OR)
✅ [CONDITION] RSI(14) < 30: ✓ (RSI(14)=28.5432 < 30)
🔍 [CONDITION] SMA(20) > SMA(50): ✗ (SMA(20)=41500.23 > 42000.45)
✅ [CONDITION] ENTRY result: ✓ TRUE  <- Triggered by first condition only!
```

**Solution:** You're using OR logic. Change to AND if you want both conditions to be true.

### Problem: "Stop loss not working"

**Look for:**
```
⚠️ [TRADE] Stop loss triggered at $40000.00 (PnL: -5.23%)
```

**If missing:** Check if stop loss is enabled in your strategy settings.

## Performance Tips

### Reduce Log Spam

By default, candle processing is logged every 100 candles to avoid spam:
```javascript
// In cpuEngine.ts (already implemented)
const shouldLog = i % 100 === 0; // Only log every 100th candle
```

If you want more detailed logs, you can change this to:
```javascript
const shouldLog = i % 10 === 0; // Log every 10th candle
```

### Export Logs

To save logs for later analysis:
1. Open Console (F12)
2. Right-click in the console
3. Select "Save as..." or copy all
4. Paste into a text editor

## Console Commands

You can manually control logging from the console:

```javascript
// Enable logging
logger.setEnabled(true);

// Disable logging
logger.setEnabled(false);

// Check if enabled
logger.isEnabled(); // returns true/false

// Manual log
logger.log('TEST', 'This is a test message', { level: 'info' });
```

## Example: Full Backtest Log

Here's what a complete backtest session looks like:

```
🔍 Debug Mode Enabled
You will now see detailed logs for:
  - Data loading (Binance/Mock)
  - Indicator calculations
  - Strategy evaluations
  - Trade entries/exits

[12:00:00] ℹ️ [DATA_LOADER] Starting data load: BINANCE - BTCUSDT 1h
[12:00:02] ✅ [DATA] Received 1000 candles from BINANCE
[12:00:03] ℹ️ [BACKTEST_HOOK] Starting backtest run
[12:00:03] ℹ️ [BACKTEST] ═══════════════════════════════════════
[12:00:03] ℹ️ [BACKTEST] Starting backtest execution
[12:00:03] 🔍 [INDICATORS] Pre-calculating indicators for 1000 candles
[12:00:03] ✅ [INDICATORS] All indicators calculated in 45.23ms
[12:00:03] ℹ️ [BACKTEST] Warmup period: 44 candles
[12:00:03] ℹ️ [BACKTEST] Starting main loop from candle 44 to 1000

# (Condition evaluations happen here for each candle)

[12:00:04] 🔍 [CONDITION] Evaluating entry conditions (AND)
[12:00:04] ✅ [CONDITION] RSI(14) < 30: ✓ (RSI(14)=28.5432 < 30)
[12:00:04] ✅ [CONDITION] ENTRY result: ✓ TRUE
[12:00:04] ℹ️ [TRADE] ENTRY at $42150.50 - entry_condition
[12:00:04] 🔍 [TRADE] Position size: 0.02371234 (Cost: 1000.00 USDT, Fee: 0.75)

# (More candles processed...)

[12:00:05] 🔍 [CONDITION] Evaluating exit conditions (AND)
[12:00:05] ✅ [CONDITION] RSI(14) > 70: ✓ (RSI(14)=72.3456 > 70)
[12:00:05] ✅ [CONDITION] EXIT result: ✓ TRUE
[12:00:05] ✅ [TRADE] EXIT at $43250.75 - exit_condition (PnL: +25.50 USDT)

[12:00:10] ℹ️ [BACKTEST] ═══════════════════════════════════════
[12:00:10] ✅ [BACKTEST] Backtest completed in 543.21ms
  └─ Data: {totalTrades: 15, finalEquity: 11250.50, totalReturn: '+12.5%', winRate: '60.0%'}
[12:00:10] ✅ [BACKTEST_HOOK] Backtest completed successfully
```

## Modified Files

1. ✅ `src/lib/debug-logger.ts` - New debug logging system
2. ✅ `src/hooks/useDataLoader.ts` - Data loading logs
3. ✅ `src/hooks/useBacktest.ts` - Backtest hook logs
4. ✅ `src/services/backtest/cpuEngine.ts` - Strategy execution logs
5. ✅ `src/app/page.tsx` - UI toggle for debug mode

## Summary

With debug mode enabled, you can now:
- ✅ Verify when Binance data is received
- ✅ See when strategy evaluation is triggered
- ✅ Watch indicator values update in real-time
- ✅ Understand why trades are entered/exited
- ✅ Debug why your strategy isn't working as expected
- ✅ Monitor performance (execution time, trade count)

**The system is working correctly - it was always a backtesting tool, not a live trading system. The logs now make this transparent!**

# backtest-coin: WebGPU 기반 No-Code 백테스팅 서비스

## 🎯 프로젝트 개요

**backtest-coin**은 일반 투자자(Non-coder)가 코딩 없이 직관적으로 트레이딩 전략을 설계하고 백테스팅할 수 있는 웹/앱 서비스입니다.

### 핵심 기술 우위
- **WebGPU 기반 로컬 연산**: 모든 계산이 사용자 브라우저에서 실시간으로 수행
- **극고속 성능**: 파라미터 변경 시 0.1초 내 재계산 (슬라이더로 실시간 튜닝)
- **전전략 보안**: 서버 전송 없음 → 전략 유출 걱정 0%, 오프라인 모드 지원

### 사용자 가치 제안
| 일반 투자자 입장 | 기술적 해석 |
|---|---|
| "복잡한 코딩 없이 전략을 만들고 싶어요" | No-Code 블록/노드 에디터 |
| "데이터를 구해서 업로드하는 게 너무 번거워요" | 거래소 API 원클릭 데이터 로드 |
| "내 전략이 유출될까 봐 불안해요" | 로컬 연산 + 오프라인 모드 |
| "변수를 바꿀 때마다 긴 계산 시간이 싫어요" | 실시간 슬라이더 튜닝 (0.1초 응답) |
| "결과를 커뮤니티에 바로 공유하고 싶어요" | 수익률 인증 카드 자동 생성 |

---

## 📋 핵심 기능 (Priority 정렬)

### P0 (필수) - MVP 단계에서 반드시 구현
| # | 기능 | 설명 | 개발 복잡도 |
|---|---|---|---|
| 1 | **실시간 슬라이더 튜닝** | 전략 변수 변경 시 0.1초 내 재계산 (WebGPU의 Wow Point) | ⭐⭐⭐⭐ |
| 2 | **No-Code 블록 에디터** | Scratch/Blueprint 스타일 드래그앤드롭 전략 작성 | ⭐⭐⭐⭐⭐ |
| 3 | **거래소 데이터 자동 로드** | 바이낸스/업비트 등 공용 데이터 원클릭 로드 | ⭐⭐⭐ |
| 4 | **로컬 프라이버시 보장** | "서버 전송 안 함" 시각적 강조 + 오프라인 모드 | ⭐⭐ |

### P1 (중요) - 첫 런칭 후 추가
| # | 기능 | 설명 |
|---|---|---|
| 5 | **자연어 전략 생성 (AI Assist)** | "비트코인이 20일 이평선 돌파 시 매수" → 자동 로직 생성 |
| 6 | **프리셋 라이브러리** | 골든크로스, 볼린저밴드 등 검증된 템플릿 원클릭 로드 |
| 7 | **기간 설정 슬라이더** | 차트 타임라인에서 드래그로 테스트 구간 선택 |
| 8 | **인터랙티브 차트** | TradingView 스타일 차트 + 매수/매도 포인트 표시 |

### P2 (유용) - 커뮤니티/바이럴
| # | 기능 | 설명 |
|---|---|---|
| 9 | **수익률 인증 카드 생성** | 인스타그램/커뮤니티용 카드뉴스 형식 이미지 자동 생성 |
| 10 | **로컬 스토리지 자동 저장** | 로그인 없이 지난 테스트 기록 브라우저에 저장 |

---

## 🔧 입력 파라미터 (User Input Schema)

사용자가 설정해야 하는 모든 값들. No-Code 방식이므로 직관적인 UI 요소로 표현됩니다.

### A. 기본 환경 설정 (Environment Setup)

```typescript
interface EnvironmentSetup {
  // 대상 자산 선택
  symbol: string;           // 예: "BTC/USDT", "ETH/USDT"
  symbolDisplayName: string; // UI에서 표시할 이름
  
  // 캔들 간격 (드롭다운)
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w" | "1M";
  
  // 테스트 기간 (드래그 슬라이더 또는 날짜 피커)
  dateRange: {
    startDate: string;      // "YYYY-MM-DD"
    endDate: string;        // "YYYY-MM-DD"
  };
  
  // 초기 자본금 (숫자 입력)
  initialCapital: number;   // 기본값: 10,000
  initialCurrency: string;  // "USDT" | "KRW"
  
  // 거래 수수료 (프리셋 선택 또는 커스텀)
  feePreset: {
    name: string;           // "바이낸스 VIP 0등급" | "업비트 일반" | "커스텀"
    makerFee: number;       // % (예: 0.02)
    takerFee: number;       // % (예: 0.04)
  };
  
  // 슬리피지 (숫자 입력)
  slippage: number;         // % (기본값: 0.05)
}
```

### B. 전략 로직 (Strategy Logic)

이것이 가장 중요한 부분입니다. No-Code 블록 에디터로 사용자가 구성합니다.

```typescript
interface StrategyLogic {
  // 진입 조건 (언제 사나?)
  entryCondition: {
    operator: "AND" | "OR";           // 여러 조건 연결 방식
    conditions: Array<{
      type: string;                   // "indicator_compare", "price_action", etc.
      indicator?: string;             // "RSI", "MA", "MACD", "Bollinger", etc.
      indicator_period?: number;      // 기간 (예: RSI 기간 = 14)
      comparison: "<" | ">" | "==" | "<=" | ">="; // 비교 연산자
      value: number;                  // 비교 값 (예: RSI < 30)
      description: string;            // 사용자 친화적 설명
    }>;
  };
  
  // 청산 조건 (언제 팔나?)
  exitCondition: {
    operator: "AND" | "OR";
    conditions: Array<{
      type: string;
      indicator?: string;
      indicator_period?: number;
      comparison: "<" | ">" | "==" | "<=" | ">=";
      value: number;
      description: string;
    }>;
  };
  
  // 손절매 (강제 청산: 손실)
  stopLoss: {
    enabled: boolean;
    percentage: number;               // 진입가 대비 -N% (예: -5)
    description: string;              // "5% 손절"
  };
  
  // 익절매 (강제 청산: 이익)
  takeProfit: {
    enabled: boolean;
    percentage: number;               // 진입가 대비 +N% (예: +10)
    description: string;              // "10% 익절"
  };
}
```

### C. 자금 관리 (Money Management)

```typescript
interface MoneyManagement {
  // 주문 방식
  orderMode: "percentOfBalance" | "fixedAmount";
  
  // 주문 크기
  orderSize: {
    mode: "percentOfBalance" | "fixedAmount";
    value: number;                    // 예: 50 (50%) 또는 1000 (1000 USDT)
    description: string;              // UI 표시용 "잔고의 50%"
  };
  
  // 레버리지 (선물 거래)
  leverage: number;                   // 1~100배 (기본값: 1x)
  leverageEnabled: boolean;
  
  // 포지션 방향
  positionDirection: "long" | "short" | "both";
  positionDirectionLabel: string;     // "매수만" | "공매도만" | "양방향"
}
```

---

## 📊 출력 결과 (Output Metrics)

WebGPU에서 연산 후 반환되는 모든 결과값입니다.

### A. 핵심 요약 (Dashboard Header)
**결과 화면 최상단에 가장 크게 표시**

```typescript
interface DashboardSummary {
  // 최종 수익률 (%)
  totalReturn: {
    value: number;
    percentage: number;
    formatted: string;                // "+25.3%" 또는 "-8.5%"
    color: "green" | "red";           // UI 색상
  };
  
  // 최종 자산 (USDT)
  finalEquity: {
    value: number;
    currency: string;
    formatted: string;                // "12,531 USDT"
  };
  
  // 승률 (%)
  winRate: {
    value: number;
    formatted: string;                // "58.3%"
    totalTrades: number;              // 거래 몇 번 중 이겼나
    winTrades: number;
  };
  
  // 최대 낙폭 (MDD, %) - 가장 중요한 리스크 지표
  maxDrawdown: {
    value: number;
    percentage: number;
    formatted: string;                // "-18.5%"
    peakValue: number;                // 최고 자산
    troughValue: number;              // 최저 자산
  };
}
```

### B. 상세 분석 지표 (Detailed Stats)

```typescript
interface DetailedStats {
  // 거래 통계
  trades: {
    totalTrades: number;              // 총 거래 횟수
    profitableTrades: number;         // 수익 거래 수
    losingTrades: number;             // 손실 거래 수
    consecutiveWins: number;          // 최대 연승
    consecutiveLosses: number;        // 최대 연패
  };
  
  // 수익성 지표
  profitability: {
    averageProfitPerTrade: {
      value: number;
      formatted: string;              // "125.5 USDT"
    };
    profitFactor: number;             // 총이익 / 총손실 (1.5+ 권장)
    payoffRatio: number;              // 평균수익 / 평균손실
  };
  
  // 성장 지표
  growth: {
    cagr: number;                     // 연평균 성장률 (%)
    cagrFormatted: string;            // "23.4% p.a."
    totalProfit: number;              // 순이익 (USDT)
    totalLoss: number;                // 순손실 (USDT)
  };
  
  // 변동성 지표
  volatility: {
    sharpeRatio: number;              // (평균수익률 - 무위험률) / 수익률 표준편차
    sortino Ratio: number;            // Sharpe의 개선 버전 (하방 편차만 고려)
    stdDev: number;                   // 수익률 표준편차
  };
  
  // 기간 정보
  period: {
    startDate: string;                // "2024-01-01"
    endDate: string;                  // "2025-01-31"
    daysCount: number;
    yearsCount: number;
  };
}
```

### C. 시각화 데이터 (Visualization Data)

```typescript
interface VisualizationData {
  // 자산 곡선 (Equity Curve)
  equityCurve: Array<{
    timestamp: number;                // Unix timestamp
    date: string;                     // "2024-01-15"
    equityValue: number;              // 해당 시점 총 자산
    returnPercentage: number;         // 시작 대비 수익률
  }>;
  
  // 드로우다운 차트
  drawdownChart: Array<{
    timestamp: number;
    date: string;
    drawdownPercentage: number;       // 최고점 대비 하락률
    equityValue: number;
  }>;
  
  // 거래 로그 (Trade List)
  trades: Array<{
    tradeId: number;
    entryTime: string;                // "2024-01-15 10:30:00"
    entryPrice: number;
    entryQuantity: number;
    
    exitTime: string;                 // "2024-01-16 14:45:00"
    exitPrice: number;
    exitQuantity: number;
    
    profitLoss: {
      amount: number;                 // USDT
      percentage: number;             // %
    };
    
    fee: {
      entryFee: number;
      exitFee: number;
      totalFee: number;
    };
    
    duration: string;                 // "1일 4시간 15분"
    status: "profit" | "loss";        // 색상 표시용
  }>;
  
  // 월별 수익 (Return by Month)
  monthlyReturns: Array<{
    month: string;                    // "2024-01"
    returnPercentage: number;
    profitLoss: number;
    tradeCount: number;
  }>;
}
```

---

## 🎮 UI/UX 상호작용 흐름

### 1단계: 환경 설정
```
[거래소 선택] → [자산 선택] → [기간 설정 슬라이더] → [수수료 프리셋]
```

### 2단계: 전략 설계
```
[No-Code 블록 에디터]
├─ 진입 조건 설정 (드래그앤드롭)
├─ 청산 조건 설정 (드래그앤드롭)
├─ 손절/익절 설정 (% 슬라이더)
└─ [자동 검증] "조건이 올바르게 설정되었습니다"
```

### 3단계: 자금 관리
```
[주문 방식 선택] → [주문 크기 입력] → [레버리지 설정]
```

### 4단계: 실시간 백테스팅 (핵심 UX!)
```
[데이터 로드 (0.5초)]
↓
[초기 백테스트 실행 (1~5초)]
↓
[결과 표시]
├─ 핵심 요약 (수익률, MDD, 승률, 최종 자산)
├─ 차트 (자산 곡선, 매수/매도 포인트)
└─ 거래 로그 (표)
↓
[실시간 튜닝 시작]
├─ 슬라이더 1 (RSI 기간: 10 → 30) → 0.1초 내 재계산
├─ 슬라이더 2 (이평선 기간: 20 → 50) → 0.1초 내 재계산
└─ 슬라이더 3 (손절: -5% → -10%) → 0.1초 내 재계산
```

**⭐ WebGPU의 Wow Point**: 매번 슬라이더를 움직일 때마다 "다시 실행" 버튼을 누르지 않아도 자동으로 모든 출력값(수익률, 차트, 거래 로그)이 실시간 업데이트됨.

### 5단계: 결과 저장 및 공유
```
[로컬 저장 (자동)] → [카드 이미지 생성] → [공유 (URL/SNS)]
```

---

## 🛠️ 기술 스택 (권장)

### Frontend
- **Framework**: React 18+ / Vue 3+ / Next.js 14+
- **상태관리**: Zustand / Jotai (가볍고 빠름)
- **UI 컴포넌트**: shadcn/ui, Headless UI
- **차트 라이브러리**: Lightweight-charts (TradingView의 오픈소스), Recharts
- **드래그앤드롭**: React Beautiful DnD, dnd-kit

### Backend (WebGPU 핵심)
- **언어**: Rust (성능) 또는 TypeScript/Node.js (개발 속도)
- **WebGPU Runtime**: 
  - [gpu.js](https://gpu.rocks/) - JavaScript GPU 연산
  - [TensorFlow.js](https://www.tensorflow.org/js) - 신경망 필요 시
  - 순수 WebGPU API (최고 성능)
- **데이터 처리**: Polars (Python) 또는 DataFusion (Rust)
- **백테스팅 엔진**: 직접 구현 또는 [backtrader](https://www.backtrader.com/) 개조

### 데이터 소스
- **거래소 API**:
  - Binance REST/WebSocket API
  - Upbit API
  - CoinGecko API (무료, 제한 적음)
- **로컬 캐싱**: IndexedDB (브라우저 DB)

### 배포
- **Frontend**: Vercel, Netlify
- **Backend**: AWS Lambda / Google Cloud Functions (필요 시)
- **CDN**: Cloudflare (캐싱, 엣지 컴퓨팅)

---

## 📐 알고리즘: 백테스팅 연산 로직

### 의사코드 (Pseudocode)

```python
def backtest(
    symbol_data: OHLCV_array,        # 캔들 데이터
    strategy_logic: StrategyLogic,   # 진입/청산 조건
    money_mgmt: MoneyManagement,     # 자금 관리
    env: EnvironmentSetup            # 환경 설정
):
    # 초기화
    equity = env.initialCapital      # 초기 자본금
    cash = equity
    positions = []                   # 현재 포지션 목록
    trades = []                      # 완료된 거래 기록
    equity_curve = []                # 시간별 자산 변화
    
    # 캔들 루프
    for candle_idx, candle in enumerate(symbol_data):
        # 1. 현재 인디케이터 계산 (RSI, MA, MACD, ...)
        rsi = calculate_rsi(symbol_data[:candle_idx+1], period=14)
        ma20 = calculate_moving_average(symbol_data[:candle_idx+1], period=20)
        ma50 = calculate_moving_average(symbol_data[:candle_idx+1], period=50)
        # ... 더 많은 인디케이터
        
        # 2. 기존 포지션 관리 (손절/익절 체크)
        for position in positions:
            pnl_percent = (candle.close - position.entryPrice) / position.entryPrice
            
            # 손절 체크
            if strategy_logic.stopLoss.enabled:
                if pnl_percent <= -strategy_logic.stopLoss.percentage / 100:
                    close_position(position, candle.close, "stop_loss")
                    continue
            
            # 익절 체크
            if strategy_logic.takeProfit.enabled:
                if pnl_percent >= strategy_logic.takeProfit.percentage / 100:
                    close_position(position, candle.close, "take_profit")
                    continue
            
            # 청산 조건 체크
            if evaluate_condition(strategy_logic.exitCondition, current_indicators):
                close_position(position, candle.close, "exit_condition")
        
        # 3. 진입 신호 생성
        if can_enter_position(positions, money_mgmt.positionDirection):
            if evaluate_condition(strategy_logic.entryCondition, current_indicators):
                # 주문 크기 계산
                if money_mgmt.orderMode == "percentOfBalance":
                    order_amount = cash * (money_mgmt.orderSize.value / 100)
                else:
                    order_amount = money_mgmt.orderSize.value
                
                # 진입 수수료 계산
                entry_fee = order_amount * (env.feePreset.takerFee / 100) + \
                            order_amount * (env.slippage / 100)
                
                # 포지션 생성
                position = {
                    entryTime: candle.time,
                    entryPrice: candle.close,
                    quantity: (order_amount - entry_fee) / candle.close,
                    entryFee: entry_fee,
                }
                positions.append(position)
                cash -= order_amount
        
        # 4. 자산 계산 및 기록
        unrealized_pnl = sum([
            p.quantity * (candle.close - p.entryPrice) for p in positions
        ])
        equity = cash + unrealized_pnl
        equity_curve.append({
            time: candle.time,
            equity: equity,
            cash: cash,
            unrealized_pnl: unrealized_pnl
        })
    
    # 결과 계산
    results = calculate_metrics(trades, equity_curve, initial_capital)
    return results
```

### 핵심 지표 계산식

```python
def calculate_metrics(trades, equity_curve, initial_capital):
    # 1. 수익률
    total_return = ((equity_curve[-1].equity - initial_capital) / initial_capital) * 100
    
    # 2. 승률
    profitable_trades = len([t for t in trades if t.pnl > 0])
    win_rate = (profitable_trades / len(trades)) * 100 if trades else 0
    
    # 3. 최대 낙폭 (MDD)
    running_max = initial_capital
    max_drawdown = 0
    for equity_point in equity_curve:
        if equity_point.equity > running_max:
            running_max = equity_point.equity
        drawdown = (running_max - equity_point.equity) / running_max
        max_drawdown = max(max_drawdown, drawdown)
    
    # 4. 손익비 (Profit Factor)
    total_profit = sum([t.pnl for t in trades if t.pnl > 0])
    total_loss = abs(sum([t.pnl for t in trades if t.pnl < 0]))
    profit_factor = total_profit / total_loss if total_loss > 0 else float('inf')
    
    # 5. CAGR (연평균 성장률)
    years = len(equity_curve) * timeframe_hours / (365 * 24)
    final_equity = equity_curve[-1].equity
    cagr = ((final_equity / initial_capital) ** (1 / years) - 1) * 100 if years > 0 else 0
    
    # 6. Sharpe Ratio
    returns = [(equity_curve[i].equity - equity_curve[i-1].equity) / equity_curve[i-1].equity 
               for i in range(1, len(equity_curve))]
    avg_return = sum(returns) / len(returns) if returns else 0
    std_return = sqrt(sum([(r - avg_return)**2 for r in returns]) / len(returns)) if returns else 0
    risk_free_rate = 0.02  # 연 2%
    sharpe_ratio = (avg_return * 252 - risk_free_rate) / (std_return * sqrt(252)) if std_return > 0 else 0
    
    return {
        totalReturn: total_return,
        finalEquity: equity_curve[-1].equity,
        winRate: win_rate,
        maxDrawdown: max_drawdown,
        profitFactor: profit_factor,
        cagr: cagr,
        sharpeRatio: sharpe_ratio,
        ...
    }
```

---

## 📦 데이터 구조 (TypeScript Interfaces)

```typescript
// 캔들 데이터
interface Candle {
  time: number;          // Unix timestamp (ms)
  date: string;          // "2024-01-15"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;        // 거래량
}

// 완료된 거래 기록
interface CompletedTrade {
  tradeId: number;
  entryTime: number;
  entryPrice: number;
  exitTime: number;
  exitPrice: number;
  quantity: number;
  profitLoss: number;    // USDT
  profitLossPercent: number; // %
  entryFee: number;
  exitFee: number;
  totalFee: number;
  duration: number;      // ms
  status: "profit" | "loss";
}

// 인디케이터 값 (캐시용)
interface IndicatorValues {
  timestamp: number;
  rsi?: {
    [period: number]: number;
  };
  ma?: {
    [period: number]: number;
  };
  ema?: {
    [period: number]: number;
  };
  bb?: {
    [period: number]: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
  };
  // ... 더 많은 인디케이터
}

// 전체 백테스트 결과
interface BacktestResult {
  summary: DashboardSummary;
  stats: DetailedStats;
  visualization: VisualizationData;
  timestamp: number;
  config: {
    environment: EnvironmentSetup;
    strategy: StrategyLogic;
    moneyMgmt: MoneyManagement;
  };
}
```

---

## 🔐 보안 및 프라이버시 구현

### 1. "서버 전송 없음" 시각화
- 페이지 헤더에 🔒 아이콘 + "Local Processing" 배지
- 전략 블록 옆에 "이 데이터는 당신의 컴퓨터에만 저장됩니다" 툴팁
- 개인정보처리방침에 명시: "백테스팅 데이터는 서버에 저장되지 않습니다"

### 2. 오프라인 모드
- 페이지 로드 후, 개발자 도구에서 인터넷 끊음
- 백테스팅이 계속 작동함을 사용자가 직접 확인 가능
- "오프라인 모드 확인됨 ✓" 표시

### 3. 로컬 스토리지 활용
```typescript
// IndexedDB에 테스트 기록 저장 (로그인 불필요)
const saveBacktestResult = async (result: BacktestResult) => {
  const db = await openDB('backtestDB');
  await db.add('results', {
    id: Date.now(),
    result,
    createdAt: new Date(),
  });
};

// 불러오기
const loadBacktestHistory = async () => {
  const db = await openDB('backtestDB');
  return await db.getAll('results');
};
```

---

## 📱 화면 구성 (Layout)

### 모바일 최적화
```
┌─────────────────────────┐
│  🔒 Local Processing    │ (헤더)
├─────────────────────────┤
│ 1. 환경 설정             │ (Collapsed by default)
│    [거래소] [자산] [기간] │
├─────────────────────────┤
│ 2. 전략 설계             │ (메인 포커스)
│    [No-Code 에디터]     │
├─────────────────────────┤
│ 3. [실행] 버튼           │
├─────────────────────────┤
│ 4. 결과 (탭)            │
│    [요약] [상세] [차트]  │
├─────────────────────────┤
│ 5. [카드 생성] [저장]   │
└─────────────────────────┘
```

### 데스크톱 (2컬럼 레이아웃)
```
┌──────────────────┬──────────────────┐
│ 좌측: 입력        │ 우측: 실시간 결과 │
├──────────────────┼──────────────────┤
│ 환경 설정        │ 수익률: +25.3%   │
│ 전략 설계        │ 최종 자산: 12.5K │
│ 자금 관리        │ 승률: 58.3%      │
│ 슬라이더 튜닝    │ MDD: -18.5%      │
│ [실행] [저장]    │                  │
│                  │ [차트 탭들]      │
└──────────────────┴──────────────────┘
```

---

## 🎬 개발 마일스톤

### Phase 1: MVP (2주)
- [ ] 기본 UI 레이아웃 (React)
- [ ] 환경 설정 입력 폼
- [ ] No-Code 블록 에디터 (간단한 버전)
- [ ] WebGPU 백테스팅 엔진 (단순 RSI + MA)
- [ ] 결과 요약 화면

### Phase 2: Core Features (2주)
- [ ] 거래소 API 데이터 로드
- [ ] 실시간 슬라이더 튜닝
- [ ] 상세 지표 계산
- [ ] 차트 시각화
- [ ] 거래 로그 테이블

### Phase 3: Polish (1주)
- [ ] UI/UX 개선
- [ ] 성능 최적화 (WebGPU 병렬화)
- [ ] 오프라인 모드 테스트
- [ ] 모바일 반응형 완성

### Phase 4: Launch (1주)
- [ ] 버그 수정
- [ ] 배포 (Vercel)
- [ ] 사용 문서 작성
- [ ] 커뮤니티 피드백 수집

---

## 🚀 핵심 성공 지표 (KPI)

| 지표 | 목표 |
|---|---|
| **슬라이더 응답 시간** | < 0.1초 (WebGPU 장점) |
| **초기 로딩 시간** | < 2초 |
| **복잡한 전략 백테스트** | < 5초 (1년 데이터, 1시간 캔들) |
| **모바일 호환성** | iOS Safari, Android Chrome |
| **사용자 만족도** | 4.5/5.0 이상 (초기) |

---

## 📝 참고 자료

- [WebGPU Specification](https://gpuweb.github.io/types/learn)
- [gpu.js 공식 문서](https://gpu.rocks/)
- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [Backtrader 아키텍처](https://www.backtrader.com/docu/)
- [FinTA 기술 지표 라이브러리](https://github.com/pmorissette/finta)

---

**작성일**: 2025-01-31  
**버전**: 1.0 MVP Draft  
**다음 단계**: Claude Code 개발 시작 (Phase 1 구현)

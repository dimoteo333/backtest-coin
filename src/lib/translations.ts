// Korean translations for the application
// 애플리케이션 한국어 번역

export const t = {
    // App Header
    appName: 'BacktestCoin',
    localProcessing: '로컬 처리',

    // Data Controls
    data: '데이터',
    candles: '캔들',
    mock: '모의 데이터',
    reload: '새로고침',
    executedIn: '실행 시간',

    // Environment Setup
    environmentSetup: '환경 설정',
    tradingPair: '거래 쌍',
    selectTradingPair: '거래 쌍 선택',
    timeframe: '타임프레임',
    selectTimeframe: '타임프레임 선택',
    dateRange: '기간 설정',
    startDate: '시작일',
    endDate: '종료일',
    to: '~',
    initialCapital: '초기 자본금',
    feePreset: '수수료 설정',
    selectFeePreset: '수수료 설정 선택',
    makerFee: '메이커 수수료 (%)',
    takerFee: '테이커 수수료 (%)',
    slippage: '슬리피지 (%)',

    // Strategy Logic
    strategyLogic: '전략 설정',
    entryConditions: '진입 조건 (매수 시점)',
    exitConditions: '청산 조건 (매도 시점)',
    addCondition: '조건 추가',
    indicator: '지표',
    period: '기간',
    operator: '연산자',
    value: '값',
    stopLoss: '손절매',
    takeProfit: '익절매',
    lossLimit: '손실 한도',
    profitTarget: '목표 수익',
    enabled: '활성화',

    // Money Management
    moneyManagement: '자금 관리',
    orderSize: '주문 크기',
    percentOfBalance: '잔고 비율 (%)',
    fixedAmount: '고정 금액',
    allocation: '배분율',
    enterAmountUsdt: 'USDT 금액 입력',
    positionDirection: '포지션 방향',
    longOnly: '롱만 (상승 베팅)',
    shortOnly: '숏만 (하락 베팅)',
    bothDirections: '양방향',
    leverage: '레버리지',
    multiplier: '배율',

    // Results Dashboard
    backtestResults: '백테스트 결과',
    totalReturn: '총 수익률',
    finalEquity: '최종 자산',
    winRate: '승률',
    maxDrawdown: '최대 낙폭',
    trades: '거래',
    profitFactor: '수익 팩터',
    sharpeRatio: '샤프 비율',
    cagr: '연평균 수익률',
    totalTrades: '총 거래 수',

    // Tabs
    charts: '차트',
    details: '상세 정보',
    tradesTab: '거래 내역',

    // Charts
    priceChart: '가격 차트',
    equityCurve: '자산 곡선',
    drawdownChart: '낙폭 차트',

    // Trade Details
    entryDate: '진입일',
    exitDate: '청산일',
    entryPrice: '진입가',
    exitPrice: '청산가',
    profit: '수익',
    loss: '손실',
    direction: '방향',
    long: '롱',
    short: '숏',

    // Indicators
    indicators: {
        RSI: 'RSI (상대강도지수)',
        SMA: 'SMA (단순이동평균)',
        EMA: 'EMA (지수이동평균)',
        MACD: 'MACD',
        MACD_SIGNAL: 'MACD 시그널',
        MACD_HISTOGRAM: 'MACD 히스토그램',
        BB_UPPER: '볼린저밴드 상단',
        BB_MIDDLE: '볼린저밴드 중앙',
        BB_LOWER: '볼린저밴드 하단',
        PRICE: '현재가',
    },

    // Comparison Operators
    comparisonOperators: {
        '<': '보다 작음',
        '>': '보다 큼',
        '<=': '이하',
        '>=': '이상',
        '==': '같음',
        'crosses_above': '상향 돌파',
        'crosses_below': '하향 돌파',
    },

    // Timeframes
    timeframes: {
        '1m': '1분',
        '5m': '5분',
        '15m': '15분',
        '30m': '30분',
        '1h': '1시간',
        '4h': '4시간',
        '1d': '1일',
        '1w': '1주',
    },

    // Common
    remove: '삭제',
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    warning: '경고',

    // Help tooltips title prefix
    helpPrefix: '도움말:',
} as const;

export type TranslationKey = keyof typeof t;

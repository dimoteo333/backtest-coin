import type { ReactNode } from 'react';

// 지표 도움말 내용
export const INDICATOR_HELP: Record<string, { title: string; content: ReactNode }> = {
    RSI: {
        title: 'RSI (상대강도지수)',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 가격이 얼마나 &quot;지쳤는지&quot; 보여주는 지표예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>30 이하</strong> = 많이 떨어져서 &quot;과매도&quot; 상태 → 반등 가능성 📈</li>
                    <li><strong>70 이상</strong> = 많이 올라서 &quot;과매수&quot; 상태 → 하락 가능성 📉</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 마라톤 선수가 지치면 속도가 줄듯이, 가격도 힘이 빠지면 방향이 바뀔 수 있어요.
                </p>
            </div>
        ),
    },
    SMA: {
        title: 'SMA (단순이동평균)',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 일정 기간 동안의 평균 가격을 선으로 보여줘요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>가격이 SMA 위</strong> = 상승 추세일 가능성</li>
                    <li><strong>가격이 SMA 아래</strong> = 하락 추세일 가능성</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 시험 점수 평균처럼, 전체적인 방향을 파악하는 데 좋아요.
                </p>
            </div>
        ),
    },
    EMA: {
        title: 'EMA (지수이동평균)',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> SMA와 비슷하지만 최근 가격에 더 비중을 두는 평균이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>최근 움직임에 더 민감하게 반응</li>
                    <li>빠른 추세 변화를 포착하기 좋음</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 SMA보다 &quot;빠른 반응&quot;이 필요할 때 사용해요.
                </p>
            </div>
        ),
    },
    MACD: {
        title: 'MACD',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 두 이동평균의 차이를 보여주는 지표예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>MACD가 0 위로</strong> = 상승 모멘텀</li>
                    <li><strong>MACD가 0 아래로</strong> = 하락 모멘텀</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 추세의 &quot;힘&quot;과 &quot;방향&quot;을 동시에 볼 수 있어요.
                </p>
            </div>
        ),
    },
    MACD_SIGNAL: {
        title: 'MACD 시그널선',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> MACD의 이동평균으로, 매매 타이밍을 잡는 데 사용해요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>MACD가 시그널 위로</strong> = 매수 신호</li>
                    <li><strong>MACD가 시그널 아래로</strong> = 매도 신호</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 신호등 같은 역할을 해요 - 교차점이 매매 타이밍!
                </p>
            </div>
        ),
    },
    MACD_HISTOGRAM: {
        title: 'MACD 히스토그램',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> MACD와 시그널선의 차이를 막대그래프로 보여줘요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>막대가 커지면</strong> = 추세가 강해지는 중</li>
                    <li><strong>막대가 작아지면</strong> = 추세가 약해지는 중</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 추세의 &quot;강도&quot;를 한눈에 볼 수 있어요.
                </p>
            </div>
        ),
    },
    BB_UPPER: {
        title: '볼린저밴드 상단',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 가격이 움직이는 범위의 &quot;천장&quot;이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>가격이 상단에 닿으면</strong> = &quot;비싸다&quot;는 신호</li>
                    <li>되돌림(하락)이 올 수 있음</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 고무줄이 너무 늘어나면 되돌아오듯, 가격도 마찬가지예요.
                </p>
            </div>
        ),
    },
    BB_MIDDLE: {
        title: '볼린저밴드 중앙',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 20일 이동평균으로, 밴드의 중심선이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>가격의 &quot;정상 수준&quot;을 나타냄</li>
                    <li>지지선/저항선 역할을 할 수 있음</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 가격이 돌아오려는 &quot;평균 위치&quot;라고 생각하세요.
                </p>
            </div>
        ),
    },
    BB_LOWER: {
        title: '볼린저밴드 하단',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 가격이 움직이는 범위의 &quot;바닥&quot;이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>가격이 하단에 닿으면</strong> = &quot;싸다&quot;는 신호</li>
                    <li>반등(상승)이 올 수 있음</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 세일 기간처럼, 싸게 살 수 있는 타이밍일 수 있어요.
                </p>
            </div>
        ),
    },
    PRICE: {
        title: '현재가',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 지금 거래되고 있는 가격이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>다른 지표와 비교할 때 사용</li>
                    <li>특정 가격에서 매매할 때 유용</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 &quot;가격이 100,000원을 넘으면 매수&quot; 같은 조건에 사용해요.
                </p>
            </div>
        ),
    },
};

// 결과 지표 도움말 내용
export const METRIC_HELP = {
    totalReturn: {
        title: '총 수익률',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 투자해서 얼마나 벌었는지(또는 잃었는지) 퍼센트로 보여줘요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><span className="text-green-500">+25%</span> = 투자금의 25%를 벌었어요</li>
                    <li><span className="text-red-500">-10%</span> = 투자금의 10%를 잃었어요</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 1,000만원으로 시작해서 +25%면, 지금 1,250만원이 있는 거예요.
                </p>
            </div>
        ),
    },
    finalEquity: {
        title: '최종 자산',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 백테스트가 끝났을 때 총 자산이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>시작 자본금 + 수익(또는 - 손실)</li>
                    <li>전략의 최종 성과를 보여줌</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 &quot;이 전략으로 거래했다면 지금 얼마가 있을까?&quot;에 대한 답이에요.
                </p>
            </div>
        ),
    },
    winRate: {
        title: '승률',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 전체 거래 중 수익이 난 거래의 비율이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>60%</strong> = 10번 중 6번 수익</li>
                    <li>높을수록 좋지만, 100%는 거의 불가능</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 야구 타율처럼 생각하세요. 3할이면 좋은 타자듯, 50% 이상이면 나쁘지 않아요.
                </p>
            </div>
        ),
    },
    maxDrawdown: {
        title: '최대 낙폭 (MDD)',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 전략 운용 중 가장 크게 떨어졌던 순간이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>-20%</strong> = 한때 자산이 20% 줄었던 적이 있음</li>
                    <li>낮을수록 안정적인 전략</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 롤러코스터에서 가장 무서운 하강 구간이라고 생각하세요. 이걸 버틸 수 있어야 해요!
                </p>
            </div>
        ),
    },
    profitFactor: {
        title: '수익 팩터',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 총 이익을 총 손실로 나눈 값이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>2.0</strong> = 1원 잃을 때마다 2원을 벌었다는 뜻</li>
                    <li><strong>1.0 이하</strong> = 손실이 이익보다 큼 (나쁨)</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 1.5 이상이면 괜찮고, 2.0 이상이면 아주 좋은 전략이에요.
                </p>
            </div>
        ),
    },
    sharpeRatio: {
        title: '샤프 비율',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 위험 대비 수익률을 보여주는 지표예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>1.0 이상</strong> = 감수한 위험 대비 수익이 좋음</li>
                    <li><strong>2.0 이상</strong> = 매우 우수한 위험 대비 수익</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 같은 수익이라도 덜 불안하게 벌었다면 더 좋은 전략이에요.
                </p>
            </div>
        ),
    },
    cagr: {
        title: '연평균 수익률 (CAGR)',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 1년 기준으로 환산한 평균 수익률이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>15%</strong> = 매년 평균 15%씩 자산이 늘었다는 뜻</li>
                    <li>장기 투자 성과를 비교할 때 유용</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 은행 예금 이자와 비교해보세요. 예금보다 높아야 의미가 있어요.
                </p>
            </div>
        ),
    },
    totalTrades: {
        title: '총 거래 수',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 백테스트 기간 동안 발생한 총 거래 횟수예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>너무 적으면 통계적 신뢰도가 낮음</li>
                    <li>너무 많으면 수수료 비용이 커짐</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 최소 30회 이상의 거래가 있어야 전략의 성과를 신뢰할 수 있어요.
                </p>
            </div>
        ),
    },
};

// 환경 설정 도움말
export const ENVIRONMENT_HELP = {
    symbol: {
        title: '거래 쌍',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 어떤 암호화폐를 테스트할지 선택해요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>BTC/USDT</strong> = 비트코인을 달러로 거래</li>
                    <li><strong>ETH/USDT</strong> = 이더리움을 달러로 거래</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 가장 익숙한 코인부터 시작해보세요. 비트코인이 좋은 출발점이에요.
                </p>
            </div>
        ),
    },
    timeframe: {
        title: '타임프레임',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 차트에서 캔들 하나가 나타내는 시간이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>1시간</strong> = 캔들 하나가 1시간 동안의 가격</li>
                    <li><strong>1일</strong> = 캔들 하나가 하루 동안의 가격</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 짧을수록 잦은 거래, 길수록 장기 투자에 적합해요.
                </p>
            </div>
        ),
    },
    dateRange: {
        title: '기간 설정',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 과거 어느 기간의 데이터로 테스트할지 정해요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>최소 6개월~1년 이상 권장</li>
                    <li>상승장과 하락장 모두 포함하면 좋음</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 여러 시장 상황을 겪어봐야 진짜 실력을 알 수 있어요.
                </p>
            </div>
        ),
    },
    initialCapital: {
        title: '초기 자본금',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 가상으로 투자를 시작하는 금액이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>실제로 투자할 금액과 비슷하게 설정</li>
                    <li>수익률은 금액과 상관없이 동일</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 실제 투자할 금액을 넣어야 현실적인 결과를 볼 수 있어요.
                </p>
            </div>
        ),
    },
    feePreset: {
        title: '수수료 설정',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 거래소에서 거래할 때 내는 수수료예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>메이커</strong> = 주문장에 주문을 거는 경우</li>
                    <li><strong>테이커</strong> = 즉시 체결되는 주문의 경우</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 수수료를 무시하면 실제 수익이 훨씬 적을 수 있어요. 반드시 포함하세요!
                </p>
            </div>
        ),
    },
    slippage: {
        title: '슬리피지',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 주문한 가격과 실제 체결 가격의 차이예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>시장이 빠르게 움직일 때 발생</li>
                    <li>보통 0.05%~0.1% 정도 설정</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 마트에서 가격표랑 계산대 가격이 다른 것처럼, 실제 거래에서도 차이가 나요.
                </p>
            </div>
        ),
    },
};

// 전략 설정 도움말
export const STRATEGY_HELP = {
    entryCondition: {
        title: '진입 조건 (매수)',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> &quot;언제 사야 할까?&quot;를 정하는 규칙이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>조건이 충족되면 자동으로 매수</li>
                    <li>여러 조건을 AND/OR로 조합 가능</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 &quot;RSI가 30 아래면 사라&quot; 같은 규칙을 만들 수 있어요.
                </p>
            </div>
        ),
    },
    exitCondition: {
        title: '청산 조건 (매도)',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> &quot;언제 팔아야 할까?&quot;를 정하는 규칙이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>조건이 충족되면 자동으로 매도</li>
                    <li>진입 조건과 별개로 설정</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 &quot;RSI가 70 위면 팔아라&quot; 같은 규칙을 만들 수 있어요.
                </p>
            </div>
        ),
    },
    andOr: {
        title: 'AND / OR 조건',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 여러 조건을 어떻게 조합할지 정해요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>AND</strong> = 모든 조건이 다 맞아야 실행</li>
                    <li><strong>OR</strong> = 하나만 맞아도 실행</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 AND는 신중하게, OR은 적극적으로 거래하게 만들어요.
                </p>
            </div>
        ),
    },
    stopLoss: {
        title: '손절매',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 손실이 이 이상 커지면 자동으로 파는 안전장치예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>-5%</strong> = 5% 손실에서 자동 청산</li>
                    <li>더 큰 손실을 막아줌</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 &quot;여기까지만 잃겠다&quot;는 마지노선이에요. 꼭 설정하세요!
                </p>
            </div>
        ),
    },
    takeProfit: {
        title: '익절매',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 이만큼 벌면 자동으로 파는 기능이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>+10%</strong> = 10% 수익에서 자동 청산</li>
                    <li>욕심으로 수익을 놓치는 것 방지</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 &quot;이 정도면 충분해!&quot;하는 목표 수익을 정해두세요.
                </p>
            </div>
        ),
    },
    period: {
        title: '기간 (Period)',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 지표를 계산할 때 사용하는 캔들 개수예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>14</strong> = 최근 14개 캔들 기준</li>
                    <li>작을수록 민감, 클수록 둔감</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 기본값부터 시작해서 조금씩 조절해보세요.
                </p>
            </div>
        ),
    },
};

// 자금 관리 도움말
export const MONEY_HELP = {
    orderSize: {
        title: '주문 크기',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 한 번 거래할 때 얼마를 투자할지 정해요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>잔고 비율</strong> = 전체 자산의 몇 %를 투자</li>
                    <li><strong>고정 금액</strong> = 항상 같은 금액을 투자</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 한 번에 전부 투자하지 마세요. 1~5%씩 나눠서 투자하는 게 안전해요.
                </p>
            </div>
        ),
    },
    positionDirection: {
        title: '포지션 방향',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 어떤 방향으로 베팅할지 정해요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>롱 (Long)</strong> = 가격이 오르면 수익</li>
                    <li><strong>숏 (Short)</strong> = 가격이 내리면 수익</li>
                    <li><strong>양방향</strong> = 둘 다 가능</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 초보자는 롱만 하는 게 더 안전해요. 숏은 위험이 커요!
                </p>
            </div>
        ),
    },
    leverage: {
        title: '레버리지',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 가진 돈보다 더 큰 금액으로 거래하는 기능이에요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>10x</strong> = 100만원으로 1,000만원어치 거래</li>
                    <li>수익도 10배, 손실도 10배! ⚠️</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 ⚠️ 매우 위험해요! 초보자는 레버리지 없이(1x) 시작하세요.
                </p>
            </div>
        ),
    },
};

// 차트 도움말
export const CHART_HELP = {
    priceChart: {
        title: '가격 차트',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 시간에 따른 가격 변화를 보여주는 차트예요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><span className="text-green-500">녹색 표시</span> = 매수 시점</li>
                    <li><span className="text-red-500">빨간 표시</span> = 매도 시점</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 전략이 언제 사고팔았는지 눈으로 확인할 수 있어요.
                </p>
            </div>
        ),
    },
    equityCurve: {
        title: '자산 곡선',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 시간에 따라 자산이 어떻게 변했는지 보여줘요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>우상향</strong> = 돈을 벌고 있는 중 📈</li>
                    <li><strong>우하향</strong> = 돈을 잃고 있는 중 📉</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 부드럽게 우상향하는 곡선이 이상적이에요.
                </p>
            </div>
        ),
    },
    drawdownChart: {
        title: '낙폭 차트',
        content: (
            <div className="space-y-2">
                <p>
                    <strong>이게 뭐예요?</strong> 고점 대비 얼마나 떨어졌는지 보여줘요.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>0%</strong> = 신고점 상태</li>
                    <li><strong>-20%</strong> = 고점 대비 20% 하락</li>
                </ul>
                <p className="text-muted-foreground/80 italic">
                    💡 깊이가 얕고, 금방 회복하는 전략이 좋은 전략이에요.
                </p>
            </div>
        ),
    },
};

// 지표 이름 한국어 매핑 함수
export function getIndicatorHelp(indicatorType: string) {
    return INDICATOR_HELP[indicatorType] || null;
}

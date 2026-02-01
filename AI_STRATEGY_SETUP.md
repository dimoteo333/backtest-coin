# AI-Powered Trading Strategy Configuration

AI를 활용한 자동 트레이딩 전략 생성 기능입니다. 자연어로 전략을 설명하면 AI가 자동으로 구조화된 전략 설정을 생성합니다.

## 설정 방법

### 1. OpenAI API 키 설정

1. [OpenAI Platform](https://platform.openai.com/api-keys)에서 API 키를 발급받습니다
2. 프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
cp .env.local.example .env.local
```

3. `.env.local` 파일에 API 키를 입력합니다:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열고 전략 설정 탭에서 "AI 생성"을 선택합니다.

## 사용 방법

### 1. 투자 성향 선택

- **안정형**: 보수적인 전략 (SMA 장기 추세, AND 로직)
- **공격형**: 적극적인 전략 (MACD/EMA 모멘텀, OR 로직)

### 2. 리스크 관리 설정

- **손절매**: 최대 손실 비율 (1-50%)
- **익절매**: 목표 수익률 (1-100%)

### 3. 전략 설명 입력

자연어로 매매 전략을 설명합니다. 예시:

```
RSI가 30 이하일 때 매수하고 70 이상일 때 매도
```

```
골든크로스 발생 시 매수, 데드크로스 시 매도
```

```
볼린저 밴드 하단 돌파 시 매수, 상단 돌파 시 매도
```

```
MACD가 시그널선을 상향 돌파할 때 진입하고 하향 돌파할 때 청산
```

### 4. 전략 생성 및 확인

1. "전략 생성" 버튼 클릭
2. AI가 생성한 전략 미리보기 확인
3. 검증 경고 확인 (있는 경우)
4. "적용하기" 버튼으로 전략 적용

## 기술 스택

- **AI Model**: OpenAI GPT-4o-mini
- **Validation**: 스키마 검증 + 7일 드라이런 백테스트
- **Frontend**: React + Zustand + Tailwind CSS
- **Backend**: Next.js API Routes

## API 비용

GPT-4o-mini 가격: $0.15/1M 토큰

평균 요청당:
- 입력: ~500 토큰
- 출력: ~300 토큰
- **비용: ~$0.0001/요청** (0.01원/요청)

## 아키텍처

```
사용자 입력 (성향 + 리스크 + 전략 설명)
    ↓
API Route (/api/strategy/generate)
    ↓
OpenAI GPT-4o-mini (시스템 프롬프트 + 사용자 입력)
    ↓
JSON 전략 응답
    ↓
검증 파이프라인 (스키마 + 드라이런 + 경고)
    ↓
미리보기 UI
    ↓
사용자 확인 → Zustand 스토어 업데이트
```

## 지원 지표

- **RSI** (Relative Strength Index): 0-100 범위, 과매수/과매도 판단
- **SMA/EMA** (Moving Averages): 추세 추종
- **MACD** (Moving Average Convergence Divergence): 모멘텀 분석
- **Bollinger Bands**: 변동성 기반 진입/청산

## 검증 규칙

### 스키마 검증
- RSI 값 범위 (0-100)
- 지표 기간 양수
- 조건 ID 고유성
- 필수 필드 존재

### 드라이런 검증
- 7일 데이터로 테스트 실행
- 거래 발생 여부 확인
- 거래 빈도 경고 (100건 초과 시)

## 문제 해결

### API 키 오류
```
서버 설정 오류: OpenAI API 키가 설정되지 않았습니다
```
→ `.env.local` 파일에 `OPENAI_API_KEY` 설정 확인

### Rate Limit 오류
```
요청이 너무 많습니다. 잠시 후 다시 시도해주세요
```
→ 자동 재시도 (3회) 후에도 실패 시 잠시 대기

### 파싱 오류
```
AI 응답을 처리할 수 없습니다
```
→ "다시 생성" 버튼으로 재시도

## 개발

### 주요 파일

**Backend**:
- `src/app/api/strategy/generate/route.ts` - API 엔드포인트
- `src/services/ai/openai-client.ts` - OpenAI 통합
- `src/services/validation/schema-validator.ts` - 스키마 검증
- `src/services/validation/dry-run-validator.ts` - 드라이런 검증

**Frontend**:
- `src/components/strategy/AIStrategyForm.tsx` - 메인 폼
- `src/components/strategy/InvestmentProfileSelector.tsx` - 성향 선택
- `src/components/strategy/StrategyPreview.tsx` - 미리보기
- `src/components/strategy/ValidationWarnings.tsx` - 경고 표시

**Types**:
- `src/types/ai-strategy.ts` - AI 관련 타입
- `src/types/strategy.ts` - 전략 타입 (기존)

### 테스트

```bash
# API 엔드포인트 테스트
curl -X POST http://localhost:3000/api/strategy/generate \
  -H "Content-Type: application/json" \
  -d '{
    "profile": "stable",
    "stopLossPercent": 5,
    "takeProfitPercent": 10,
    "description": "RSI가 30 이하일 때 매수하고 70 이상일 때 매도"
  }'
```

## 라이선스

MIT

# BacktestCoin

**WebGPU 기반 초고속 암호화폐 백테스팅 플랫폼**

BacktestCoin은 코딩 지식 없이도 누구나 자신의 트레이딩 전략을 만들고, 검증하고, 공유할 수 있는 웹 서비스입니다. 모든 연산은 사용자의 브라우저에서 WebGPU를 통해 로컬로 수행되어, **전략 유출 걱정 없이** 안전하고 빠르게 실행됩니다.

![BacktestCoin Hero](./public/placeholder.svg)

## ✨ 주요 기능

### 🚀 0.1초 실시간 튜닝 (Instant Feedback)
WebGPU의 강력한 연산 능력을 활용하여, 슬라이더로 파라미터를 조절하는 즉시 백테스트 결과(수익률, 승률, MDD)가 업데이트됩니다. 기다림 없는 튜닝 경험을 제공합니다.

### 🧩 No-Code 전략 에디터 (Visual Strategy Builder)
복잡한 파이썬 코드를 짤 필요가 없습니다. 블록을 조립하듯 직관적인 UI로 진입/청산 조건, 손절매, 익절매 로직을 설계하세요.

### 🛡️ 완벽한 프라이버시 (Privacy First)
여러분의 소중한 매매 전략은 서버로 전송되지 않습니다. 모든 백테스팅 연산은 브라우저 내에서 로컬로 처리되며, 데이터는 오직 여러분의 기기에만 저장됩니다.

### 📊 다양한 데이터 소스
- **Binance:** 글로벌 최대 거래소 데이터
- **Upbit:** 국내 거래소 원화(KRW) 마켓 데이터
- **Mock Data:** 전략 테스트를 위한 가상 데이터 생성 기능

### 📱 모바일 최적화
모바일에서도 완벽하게 동작하는 반응형 차트와 UI를 제공합니다. 언제 어디서나 아이디어가 떠오르면 바로 테스트해보세요.

---

## 🛠️ 기술 스택

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Shadcn/ui
- **State Management:** Zustand
- **Charting:** Lightweight-charts (TradingView)
- **Database (Local):** IndexedDB (Dexie.js)
- **Authentication:** Clerk (Google/Apple SSO)

---

## 🚦 시작하기

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/dimoteo333/backtest-coin.git
cd backtest-coin

# 2. 패키지 설치
npm install

# 3. 환경 변수 설정 (.env.local 생성)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
# CLERK_SECRET_KEY=...

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

---

## 📈 로드맵 (Roadmap)

### ✅ Phase 1: MVP (완료)
- [x] 기본 UI/UX 및 테마 적용
- [x] 환경 설정 및 전략 입력 폼 구현
- [x] WebGPU 기반 백테스팅 엔진 (CPU Fallback 포함)
- [x] 결과 대시보드 (수익률, 자산 곡선, 로그)

### ✅ Phase 2: Core Features (완료)
- [x] Binance 데이터 연동
- [x] Upbit 데이터 연동 (KRW 마켓)
- [x] 모바일 차트 반응형 개선
- [x] Clerk 기반 Seamless Auth (SSO)

### 🚧 Phase 3: Advanced Features (진행 중)
- [ ] 기술적 지표 추가 (Bollinger Bands, MACD 등)
- [ ] 전략 공유 및 커뮤니티 기능
- [ ] AI 기반 자연어 전략 생성 (OpenAI API 연동)

---

## 🤝 기여하기

이 프로젝트는 오픈 소스입니다. 버그 리포트, 기능 제안, PR은 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

Distributed under the MIT License. See `LICENSE` for more information.

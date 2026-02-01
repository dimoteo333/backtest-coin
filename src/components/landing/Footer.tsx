import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative pt-32 pb-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tighter mb-6 block">
              Backtest<span className="text-blue-400">Coin</span>
            </Link>
            <p className="text-white/50 leading-relaxed">
              WebGPU 기반의 고성능 암호화폐 백테스팅 플랫폼.
              전략을 테스트하고 최적화하세요.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6">제품</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link href="#features" className="hover:text-white transition-colors">기능</Link></li>
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">작동방식</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">가격</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">시작하기</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">리소스</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link href="#" className="hover:text-white transition-colors">문서</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">지표 가이드</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">전략 예제</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">문의</h4>
            <p className="text-white/60 mb-4">질문이 있으신가요?</p>
            <a
              href="mailto:support@backtestcoin.com"
              className="text-xl font-medium hover:text-blue-400 transition-colors"
            >
              support@backtestcoin.com
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-white/40">
          <p>&copy; 2025 BacktestCoin. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="#" className="hover:text-white transition-colors">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

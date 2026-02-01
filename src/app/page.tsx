'use client';

import Link from 'next/link';
import { Navbar, Hero, Features, HowItWorks, Footer } from '@/components/landing';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            지금 바로 <br />
            <span className="text-gradient">시작하세요</span>
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            무료로 시작하고 전략을 테스트해보세요.
            <br className="hidden md:block" />
            모든 핵심 기능을 제한 없이 사용할 수 있습니다.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            무료로 시작하기
          </Link>
        </div>

        {/* Background Gradient for CTA */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
      </section>

      <Footer />
    </main>
  );
}

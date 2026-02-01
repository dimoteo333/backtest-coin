"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"

const steps = [
  {
    step: "01",
    title: "환경 설정",
    description: "거래 페어, 시간대, 기간, 초기 자본을 설정합니다. 바이낸스와 업비트에서 실제 데이터를 불러옵니다.",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    step: "02",
    title: "전략 구성",
    description: "진입/청산 조건을 직접 설정하거나, AI에게 자연어로 설명하여 자동 생성할 수 있습니다.",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    step: "03",
    title: "백테스트 실행",
    description: "WebGPU 가속 엔진이 수만 개의 캔들 데이터를 분석하고 모든 거래를 시뮬레이션합니다.",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    step: "04",
    title: "결과 분석",
    description: "수익률, 승률, MDD, 샤프비율 등 상세한 성과 지표와 시각화된 차트를 확인합니다.",
    color: "from-green-500/20 to-emerald-500/20",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            간단한 4단계
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-md mx-auto"
          >
            복잡한 설정 없이 바로 시작하세요
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <GlassCard className="h-full group">
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl`} />
                <div className="relative z-10">
                  <span className="text-6xl font-bold text-white/10 group-hover:text-white/20 transition-colors">
                    {step.step}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {step.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

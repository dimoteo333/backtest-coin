"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { motion } from "framer-motion"
import { Cpu, LineChart, Shield, Zap, Brain, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    title: "WebGPU 가속",
    description: "GPU를 활용한 병렬 처리로 수만 개의 캔들 데이터를 밀리초 단위로 분석합니다.",
  },
  {
    icon: <Shield className="w-8 h-8 text-green-400" />,
    title: "100% 로컬 처리",
    description: "모든 전략과 데이터가 브라우저 내에서 처리되어 서버에 저장되지 않습니다.",
  },
  {
    icon: <LineChart className="w-8 h-8 text-blue-400" />,
    title: "실시간 시각화",
    description: "인터랙티브 차트로 진입/청산 포인트, 손익 곡선, 드로우다운을 시각화합니다.",
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-400" />,
    title: "AI 전략 생성",
    description: "자연어로 전략을 설명하면 AI가 자동으로 백테스트 가능한 전략으로 변환합니다.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
    title: "다양한 지표",
    description: "RSI, MACD, 볼린저밴드, 이동평균 등 15개 이상의 기술적 지표를 지원합니다.",
  },
  {
    icon: <Cpu className="w-8 h-8 text-orange-400" />,
    title: "리스크 관리",
    description: "손절/익절, 레버리지, 포지션 사이징 등 정교한 리스크 관리 도구를 제공합니다.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            강력한 기능
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            프로페셔널 트레이더를 위한 모든 도구가 준비되어 있습니다
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100px" }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-8"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col justify-between group">
                <div>
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:bg-white/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

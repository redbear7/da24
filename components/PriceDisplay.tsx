"use client";

import { Plan, PROVIDERS, ProviderKey } from "@/lib/types";
import { Receipt, Gift, ArrowRight } from "lucide-react";

interface Props {
  plan: Plan | null;
  provider: ProviderKey;
}

export default function PriceDisplay({ plan, provider }: Props) {
  const providerInfo = PROVIDERS.find((p) => p.key === provider);

  if (!plan) return null;

  return (
    <section className="max-w-[480px] mx-auto px-5 py-4">
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${providerInfo?.color}CC 0%, ${providerInfo?.color} 100%)`,
        }}
      >
        {/* Decorative */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />

        <p className="text-sm font-medium text-white/80 mb-3">예상 요금 안내</p>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Receipt className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70">월 요금</span>
            </div>
            <p className="text-3xl font-extrabold">
              {plan.monthlyPrice.toLocaleString()}
              <span className="text-sm font-medium ml-1">원/월</span>
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 mb-1 justify-end">
              <Gift className="w-4 h-4 text-yellow-300" />
              <span className="text-xs text-white/70">지원금</span>
            </div>
            <p className="text-2xl font-extrabold text-yellow-300">
              {plan.subsidy.toLocaleString()}
              <span className="text-sm font-medium ml-1">원</span>
            </p>
          </div>
        </div>

        <div className="bg-white/15 rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70">
              {plan.name} · {plan.speed} · {plan.contractMonths}개월
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              설치비 {plan.installFee.toLocaleString()}원 (방문 시 결제)
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/50" />
        </div>

        <p className="text-[10px] text-white/50 mt-2 text-center">
          * 본 요금은 다이사에서 추정한 금액이며, 실제 요금과 차이가 있을 수 있습니다
        </p>
      </div>
    </section>
  );
}

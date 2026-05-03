"use client";

import { Plan, ProviderKey, PlanType, PROVIDERS } from "@/lib/types";

const PROVIDER_COLOR_VAR: Record<ProviderKey, string> = {
  kt: "var(--provider-kt)",
  lg: "var(--provider-lg)",
  sk: "var(--provider-sk)",
  other: "var(--muted-foreground)",
};
import { Zap, Check, Star } from "lucide-react";

interface Props {
  plans: Plan[];
  provider: ProviderKey;
  planType: PlanType;
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
}

export default function PlanComparison({
  plans,
  provider,
  planType,
  selectedPlan,
  onSelectPlan,
}: Props) {
  const filtered = plans.filter(
    (p) => p.providerKey === provider && p.planType === planType
  );
  const providerInfo = PROVIDERS.find((p) => p.key === provider);

  // 지원금 최대 플랜 ID
  const maxSubsidyId = filtered.length > 0
    ? filtered.reduce((a, b) => (a.subsidy >= b.subsidy ? a : b)).id
    : null;

  if (provider === "other" || filtered.length === 0) {
    return (
      <section className="apple-container py-4">
        <div className="rounded-[1.5rem] border border-border bg-white/70 p-8 text-center backdrop-blur-xl">
          <p className="text-text-muted text-[15px] leading-relaxed">
            {provider === "other"
              ? "알뜰 인터넷 요금제는 준비 중입니다."
              : "해당 조건의 요금제가 준비 중입니다."}
            <br />
            무료 상담을 통해 맞춤 안내를 받아보세요!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="apple-container py-4">
      <h2 className="mb-1 text-[24px] font-semibold tracking-tight text-foreground">요금제 비교</h2>
      <p className="text-[14px] text-text-muted mb-4">
        <span style={{ color: providerInfo ? PROVIDER_COLOR_VAR[providerInfo.key] : undefined }} className="font-bold">
          {providerInfo?.name}
        </span>{" "}
        요금제를 비교해 보세요
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`relative rounded-[1.5rem] bg-white/75 p-5 text-left backdrop-blur-xl transition-all border ${
                isSelected
                  ? "border-foreground shadow-sm"
                  : "border-border hover:bg-white"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                  <Star className="w-3 h-3 fill-current" /> BEST
                </div>
              )}
              {!plan.isPopular && plan.id === maxSubsidyId && (
                <div className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                  최대현금지원
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="text-[16px] font-bold text-foreground">{plan.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                    <span className="text-[13px] font-semibold text-text-secondary">
                      {plan.speed}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      / {plan.contractMonths}개월 약정
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[20px] font-extrabold text-primary leading-none">
                    {plan.monthlyPrice.toLocaleString()}
                  </p>
                  <span className="text-[12px] text-text-muted">원/월</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {plan.benefits.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[12px] text-text-secondary bg-muted px-2 py-0.5 rounded-md"
                  >
                    <Check className="w-3 h-3 text-green-500 shrink-0" />
                    {b}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <span className="text-[13px] text-text-muted">
                  설치비 {plan.installFee.toLocaleString()}원
                </span>
                <span className="text-[13px] text-accent font-bold">
                  지원금 최대 {plan.subsidy.toLocaleString()}원
                </span>
              </div>

              {isSelected && (
                <div className="absolute right-3.5 top-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
                  <Check className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

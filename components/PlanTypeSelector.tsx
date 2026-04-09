"use client";

import { PlanType, PLAN_TYPE_LABELS, PLAN_TYPE_DESCRIPTIONS } from "@/lib/types";

interface Props {
  selected: PlanType;
  onChange: (type: PlanType) => void;
}

export default function PlanTypeSelector({ selected, onChange }: Props) {
  const types: PlanType[] = ["new", "change", "renew", "move"];

  return (
    <section id="plan-selector" className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-4">가입 유형 선택</h2>

      {/* Tab row - matches original: bordered tabs, active has blue text + bottom border feel */}
      <div className="grid grid-cols-4 border border-border rounded-xl overflow-hidden">
        {types.map((type) => {
          const isActive = selected === type;
          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`py-3.5 text-[13px] sm:text-[14px] font-semibold text-center transition-colors border-r last:border-r-0 border-border ${
                isActive
                  ? "bg-card text-primary"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {PLAN_TYPE_LABELS[type]}
            </button>
          );
        })}
      </div>

      {/* Description box */}
      <div className="mt-4 px-4 py-4 bg-card border border-border rounded-xl">
        <p className="text-[14px] font-bold text-foreground">
          {PLAN_TYPE_LABELS[selected]}이란?
        </p>
        <p className="text-[13px] text-text-secondary mt-1.5 leading-relaxed">
          {PLAN_TYPE_DESCRIPTIONS[selected]}
        </p>
      </div>
    </section>
  );
}

"use client";

import { PlanType, PLAN_TYPE_LABELS, PLAN_TYPE_DESCRIPTIONS } from "@/lib/types";

interface Props {
  selected: PlanType;
  onChange: (type: PlanType) => void;
}

export default function PlanTypeSelector({ selected, onChange }: Props) {
  const types: PlanType[] = ["new", "change", "renew", "move"];

  return (
    <section id="plan-selector" className="apple-container pb-6">
      <h2 className="mb-4 text-[24px] font-semibold tracking-tight text-foreground">가입 유형 선택</h2>

      <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] border border-border bg-white/55 p-1.5 backdrop-blur-xl sm:grid-cols-4">
        {types.map((type) => {
          const isActive = selected === type;
          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`min-h-11 rounded-full px-3 text-center text-[14px] font-semibold transition-all sm:text-[15px] ${
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-white hover:text-foreground"
              }`}
            >
              {PLAN_TYPE_LABELS[type]}
            </button>
          );
        })}
      </div>

      {/* Description box */}
      <div className="mt-4 rounded-[1.25rem] border border-border bg-white/70 px-5 py-4 backdrop-blur-xl">
        <p className="text-[15px] font-bold text-foreground">
          {PLAN_TYPE_LABELS[selected]}이란?
        </p>
        <p className="text-[14px] text-text-secondary mt-1.5 leading-relaxed">
          {PLAN_TYPE_DESCRIPTIONS[selected]}
        </p>
      </div>
    </section>
  );
}

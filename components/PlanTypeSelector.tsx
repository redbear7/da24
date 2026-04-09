"use client";

import { PlanType, PLAN_TYPE_LABELS, PLAN_TYPE_DESCRIPTIONS } from "@/lib/types";
import { UserPlus, RefreshCw, FileCheck, Truck } from "lucide-react";

const ICONS: Record<PlanType, typeof UserPlus> = {
  new: UserPlus,
  change: RefreshCw,
  renew: FileCheck,
  move: Truck,
};

interface Props {
  selected: PlanType;
  onChange: (type: PlanType) => void;
}

export default function PlanTypeSelector({ selected, onChange }: Props) {
  const types: PlanType[] = ["new", "change", "renew", "move"];

  return (
    <section id="plan-selector" className="max-w-[480px] mx-auto px-5 pt-8 pb-4">
      <h2 className="text-lg font-bold text-text-primary mb-1">가입유형 선택</h2>
      <p className="text-sm text-text-muted mb-4">해당하는 가입 유형을 선택해 주세요</p>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {types.map((type) => {
          const Icon = ICONS[type];
          const isActive = selected === type;
          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`flex flex-col items-center gap-1.5 py-3.5 px-1 rounded-xl text-center transition-all active:scale-[0.97] ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-text-secondary border border-border-main hover:border-primary/30"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-text-muted"}`} />
              <span className="text-[11px] font-semibold leading-tight">
                {PLAN_TYPE_LABELS[type]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <div className="bg-secondary rounded-xl px-4 py-3">
        <p className="text-xs text-primary font-medium">
          <span className="font-bold">{PLAN_TYPE_LABELS[selected]}</span>이란?
        </p>
        <p className="text-xs text-text-secondary mt-1">
          {PLAN_TYPE_DESCRIPTIONS[selected]}
        </p>
      </div>
    </section>
  );
}

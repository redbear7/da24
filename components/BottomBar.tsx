"use client";

import { Plan } from "@/lib/types";

interface Props {
  plan: Plan | null;
  onConsultClick: () => void;
}

export default function BottomBar({ plan, onConsultClick }: Props) {
  const monthlyPrice = plan?.monthlyPrice ?? 35200;
  const subsidy = plan?.subsidy ?? 450000;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-bottom-bar-bg backdrop-blur-2xl safe-bottom">
      <div className="apple-container grid gap-3 py-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid gap-1 sm:grid-cols-2 sm:gap-6">
          <div className="flex items-center justify-between gap-4 sm:block">
            <span className="text-[13px] text-bottom-bar-text/60">
            예상 요금(결합할인)
            </span>
            <span className="block text-[20px] font-semibold text-bottom-bar-text">
            {monthlyPrice.toLocaleString()}원{" "}
            <span className="text-[15px] font-medium">/ 월</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 sm:block">
            <span className="text-[13px] text-bottom-bar-text/60">
            법정 지원금 + 다이사 혜택
            </span>
            <span className="block text-[20px] font-semibold text-bottom-bar-text">
              {subsidy.toLocaleString()}원 + ?
            </span>
          </div>
        </div>

        <button
          onClick={onConsultClick}
          className="min-h-12 rounded-full bg-white px-8 text-[16px] font-semibold text-foreground transition-transform active:scale-[0.98] md:min-w-[220px]"
        >
          무료 상담 신청
        </button>
      </div>
    </div>
  );
}

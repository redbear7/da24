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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bottom-bar-bg safe-bottom">
      <div className="max-w-[640px] mx-auto px-5 pt-4 pb-3">
        {/* Price info rows */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] text-bottom-bar-text/70">
            예상 요금(결합할인)
          </span>
          <span className="text-[20px] font-extrabold text-bottom-bar-text">
            {monthlyPrice.toLocaleString()}원{" "}
            <span className="text-[14px] font-medium">/ 월</span>
          </span>
        </div>

        <div className="flex items-center justify-between mb-1">
          <span className="text-[13px] text-bottom-bar-text/70">
            법정 지원금 + 다이사 혜택
          </span>
          <div className="text-right">
            <span className="text-[20px] font-extrabold text-bottom-bar-text">
              {subsidy.toLocaleString()}원 + ?
            </span>
          </div>
        </div>

        <p className="text-[10px] text-bottom-bar-text/40 text-right mb-3">
          설치 다음날 바로 지급
        </p>

        {/* CTA Button - matches original: white bg, blue text, full width */}
        <button
          onClick={onConsultClick}
          className="w-full py-4 bg-white text-primary font-bold rounded-xl text-[16px] hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          무료 상담 신청하기
        </button>
      </div>
    </div>
  );
}

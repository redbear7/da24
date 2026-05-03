"use client";

import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    headline: "인터넷 선택을 더 가볍게.",
    sublines: ["통신사별 요금과 혜택을 한 화면에서", "상담 전 필요한 정보만 먼저 확인하세요"],
    note: "설치 일정과 지원금은 상담 후 확정됩니다",
  },
  {
    headline: "혜택은 크게, 과정은 단순하게.",
    sublines: ["신규 가입, 변경, 재약정까지", "상황에 맞는 선택지를 정리해드립니다"],
    note: "복잡한 약정 조건을 보기 쉽게 비교합니다",
  },
  {
    headline: "모바일에서도 한 손으로 비교.",
    sublines: ["요금제 선택부터 상담 신청까지", "끊김 없는 흐름으로 설계했습니다"],
    note: "DA24 홈서비스와 함께 묶어 상담할 수 있어요",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="apple-container pt-10 pb-8">
      <div className="apple-card overflow-hidden rounded-[2rem] px-6 py-9 sm:px-10 sm:py-12">
        <p className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1 text-[12px] font-semibold text-secondary-foreground">
          Internet concierge
        </p>
        <h1 className="min-h-[90px] max-w-3xl text-[34px] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-[44px] lg:text-[56px]">
          {slide.headline}
        </h1>

        <div className="mt-5 min-h-[62px] space-y-1">
          {slide.sublines.map((line, i) => (
            <p key={i} className="text-[16px] font-medium text-text-secondary sm:text-[20px]">
              {line}
            </p>
          ))}
        </div>

        <p className="mt-5 text-[14px] font-medium text-primary">
          {slide.note}
        </p>

        <div className="mt-8 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-primary" : "w-1.5 bg-border"
            }`}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
        <span className="ml-auto text-[12px] text-text-muted tabular-nums">
          {current + 1}/{SLIDES.length}
        </span>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    headline: "통신사, 오래 쓴다고 좋은 게 아닙니다",
    sublines: ["최대 48만 원 + 비밀 혜택까지", "잠자는 내 지원금 확인해 보세요!"],
    note: "*당일 접수 빠른 설치 가능",
  },
  {
    headline: "3분 간편 상담으로 현금 혜택 확인",
    sublines: ["설치 다음날 지원금 바로 입금", "다이사에서만 받는 비밀지원금 혜택"],
    note: "*설치 완료 후 익일 현금 지급",
  },
  {
    headline: "780만 고객이 선택한 인터넷 비교",
    sublines: ["통신사별 최적 상품 1:1 맞춤 추천", "복잡한 요금제, 한눈에 비교하세요"],
    note: "*지급 보증 서비스 제공",
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
    <section className="max-w-[640px] mx-auto px-5 pt-10 pb-6">
      {/* Slide content */}
      <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground leading-snug tracking-tight min-h-[68px]">
        {slide.headline}
      </h1>

      <div className="mt-3 space-y-0.5 min-h-[56px]">
        {slide.sublines.map((line, i) => (
          <p key={i} className="text-[16px] sm:text-[19px] font-medium text-primary">
            {line}
          </p>
        ))}
      </div>

      <p className="mt-3 text-[14px] text-accent font-medium">
        {slide.note}
      </p>

      {/* 페이지 인디케이터 */}
      <div className="flex items-center gap-2 mt-5">
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
    </section>
  );
}

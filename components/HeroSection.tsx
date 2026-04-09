"use client";

import { Wifi, Zap, Gift } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #3B6DF5 100%)" }}
    >
      <div className="max-w-[480px] mx-auto px-5 py-8 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <span className="text-xs font-medium text-white/90">
            빠른 설치 가능 지역 확인
          </span>
        </div>

        {/* Main Copy */}
        <h1 className="text-[26px] font-extrabold text-white leading-tight mb-2">
          통신사, 오래 쓴다고
          <br />
          좋은 게 아닙니다
        </h1>
        <p className="text-sm text-blue-100 mb-6 leading-relaxed">
          지금 갈아타면 더 빠르고 더 싸게!
          <br />
          숨어있는 지원금까지 확인해 보세요.
        </p>

        {/* Benefit Cards */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
            <Gift className="w-5 h-5 text-yellow-300 mb-2" />
            <p className="text-[22px] font-extrabold text-white">최대 48만원</p>
            <p className="text-xs text-blue-200 mt-0.5">현금 지원금</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
            <Wifi className="w-5 h-5 text-green-300 mb-2" />
            <p className="text-[22px] font-extrabold text-white">+ 비밀 혜택</p>
            <p className="text-xs text-blue-200 mt-0.5">추가 사은품</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            document.getElementById("plan-selector")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full py-3.5 bg-white text-primary font-bold rounded-xl text-[15px] hover:bg-blue-50 active:scale-[0.98] transition-all shadow-lg"
        >
          잠자는 내 지원금 확인해 보세요!
        </button>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
    </section>
  );
}

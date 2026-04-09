"use client";

import { Wifi, Zap, Gift } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #3B6DF5 100%)" }}
    >
      <div className="max-w-[480px] mx-auto px-5 pt-7 pb-8 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <span className="text-xs font-semibold text-white/90">
            빠른 설치 가능 지역 확인
          </span>
        </div>

        {/* Main Copy */}
        <h1 className="text-[27px] font-extrabold text-white leading-[1.3] mb-2 tracking-tight">
          통신사, 오래 쓴다고
          <br />
          좋은 게 아닙니다
        </h1>
        <p className="text-[13px] text-blue-100/90 mb-6 leading-relaxed">
          지금 갈아타면 더 빠르고 더 싸게!
          <br />
          숨어있는 지원금까지 확인해 보세요.
        </p>

        {/* Benefit Cards */}
        <div className="flex gap-2.5 mb-6">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
            <Gift className="w-5 h-5 text-yellow-300 mb-2" />
            <p className="text-[23px] font-extrabold text-white leading-none">최대 48만원</p>
            <p className="text-[11px] text-blue-200 mt-1">현금 지원금</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
            <Wifi className="w-5 h-5 text-green-300 mb-2" />
            <p className="text-[23px] font-extrabold text-white leading-none">+ 비밀 혜택</p>
            <p className="text-[11px] text-blue-200 mt-1">추가 사은품</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            document.getElementById("plan-selector")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full py-4 bg-white text-primary font-bold rounded-2xl text-[15px] hover:bg-blue-50 active:scale-[0.98] transition-all shadow-lg"
        >
          잠자는 내 지원금 확인해 보세요!
        </button>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-white/5 rounded-full" />
    </section>
  );
}

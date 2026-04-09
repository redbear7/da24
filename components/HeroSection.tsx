"use client";

export default function HeroSection() {
  return (
    <section className="max-w-[640px] mx-auto px-5 pt-10 pb-6">
      {/* Main Copy - matches da24 original: simple bold text, no gradient bg */}
      <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground leading-snug tracking-tight">
        통신사, 오래 쓴다고 좋은 게 아닙니다
      </h1>

      <div className="mt-3 space-y-0.5">
        <p className="text-[16px] sm:text-[19px] font-medium text-primary">
          최대 48만 원 + 비밀 혜택까지
        </p>
        <p className="text-[16px] sm:text-[19px] font-medium text-primary">
          잠자는 내 지원금 확인해 보세요!
        </p>
      </div>

      <p className="mt-3 text-[14px] text-accent font-medium">
        *당일 접수 빠른 설치 가능
      </p>
    </section>
  );
}

export default function CtaCards() {
  return (
    <section className="apple-container grid gap-4 py-4 md:grid-cols-2">
      <div className="rounded-[1.5rem] border border-border bg-white/75 p-6 backdrop-blur-xl">
        <h3 className="mb-2 text-[22px] font-semibold leading-tight tracking-tight text-foreground">
          인터넷 새로 필요하시거나<br />약정 끝나셨다면,
        </h3>
        <p className="mb-5 text-[14px] leading-relaxed text-text-secondary">
          3분 간편 상담으로 바로 드리는<br />
          현금 혜택 확인해 보세요
        </p>
        <button className="min-h-12 w-full rounded-full bg-foreground px-5 text-[15px] font-semibold text-background transition-transform active:scale-[0.98]">
          최대 혜택 확인하기
        </button>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-white/75 p-6 backdrop-blur-xl">
        <h3 className="mb-2 text-[22px] font-semibold leading-tight tracking-tight text-foreground">
          경제적인 요금제를<br />찾으신다면,
        </h3>
        <p className="mb-5 text-[14px] leading-relaxed text-text-secondary">
          오늘 날짜 기준으로 가장 저렴한<br />
          요금제 + 사은품까지 확인해 보세요
        </p>
        <button className="min-h-12 w-full rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-transform active:scale-[0.98]">
          최저 요금 알아보기
        </button>
      </div>
    </section>
  );
}

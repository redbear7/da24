export default function CtaCards() {
  return (
    <section className="max-w-[640px] mx-auto px-5 py-4 flex flex-col gap-4">
      {/* Card 1: New subscription / contract end */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-[17px] font-bold text-foreground leading-snug mb-2">
          인터넷 새로 필요하시거나<br />약정 끝나셨다면,
        </h3>
        <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
          3분 간편 상담으로 바로 드리는<br />
          현금 혜택 확인해 보세요
        </p>
        <button className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-[15px] font-bold transition-transform active:scale-[0.98]">
          최대 혜택 확인하기
        </button>
      </div>

      {/* Card 2: Budget plan */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-[17px] font-bold text-foreground leading-snug mb-2">
          경제적인 요금제를<br />찾으신다면,
        </h3>
        <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
          오늘 날짜 기준으로 가장 저렴한<br />
          요금제 + 사은품까지 확인해 보세요
        </p>
        <button className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-[15px] font-bold transition-transform active:scale-[0.98]">
          최저 요금 알아보기
        </button>
      </div>
    </section>
  );
}

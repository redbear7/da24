import { Gift, TrendingDown, Users, LayoutList } from "lucide-react";

const BENEFITS = [
  {
    icon: Gift,
    title: "최대 48만 원 + 비밀 지원금 혜택",
    description:
      "법정 지원금 최대한도 지원금 설치 당일 입금,\n특별한 신규 가입 혜택까지 아낌없이 드려요.",
  },
  {
    icon: TrendingDown,
    title: "합리적인 요금 설계",
    description:
      "다이사에선 통신사별 최적 상품 추천으로\n월평균 23% 금액 절감이 가능해요.",
  },
  {
    icon: Users,
    title: "780만 고객의 선택",
    description:
      "설치 당일 연락 두절되는 업체와 분쟁 걱정 끝!\n780만 고객이 이용한 다이사에서 지급을 보증해요.",
  },
  {
    icon: LayoutList,
    title: "복잡한 비교를 한눈에",
    description:
      "1:1 맞춤 상담, 요금 및 혜택 자동 계산으로\n복잡한 요금제를 쉽게 비교하고 선택하세요.",
  },
];

export default function Benefits() {
  return (
    <section className="max-w-[640px] mx-auto px-5 py-2 flex flex-col gap-3">
      {BENEFITS.map((b) => {
        const Icon = b.icon;
        return (
          <div key={b.title} className="bg-muted rounded-xl p-4 flex gap-3">
            <div className="shrink-0 w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-foreground mb-0.5">{b.title}</p>
              <p className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-line">
                {b.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

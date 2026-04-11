"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Home, Building2, Sparkles, Wifi, AirVent, Star, ChevronRight, ChevronLeft, X } from "lucide-react";

/* ─── 이사 카테고리 ─── */
const MOVING_CATEGORIES = [
  {
    title: "가정이사",
    desc: "3룸, 15평대 이상",
    sub: "아파트 · 빌라 · 주택",
    icon: Truck,
    type: "household",
    href: "/moving?type=household",
    modalTitle: "전문 포장이사 업체를 통한\n쉽고 안전한 가정이사!",
    modalItems: [
      "3룸, 15평대 이상 아파트, 빌라, 주택 거주중이신 분",
      "전문 포장과 안전한 이사가 필요하신 분",
      "가구, 가전이 많아 전문 인력이 필요하신 분",
    ],
  },
  {
    title: "소형이사",
    desc: "15평대 미만",
    sub: "원룸 · 투룸 · 오피스텔",
    icon: Home,
    type: "small",
    href: "/moving?type=small",
    modalTitle: "합리적인 비용의\n빠르고 간편한 소형이사!",
    modalItems: [
      "15평 미만 원룸, 투룸, 오피스텔 거주중이신 분",
      "짐이 적어 간편하게 이사하고 싶으신 분",
      "합리적인 비용으로 이사하고 싶으신 분",
    ],
  },
  {
    title: "사무실이사",
    desc: "1톤 초과 짐량",
    sub: "빌딩 · 공장 · 상가 등",
    icon: Building2,
    type: "office",
    href: "/moving?type=office",
    modalTitle: "전문 업체의 체계적인\n사무실 · 상가 이사!",
    modalItems: [
      "1톤 초과 짐량의 빌딩, 공장, 상가 이사",
      "사무 장비와 서류를 안전하게 옮기고 싶으신 분",
      "업무 중단 없이 빠르게 이사를 완료하고 싶으신 분",
    ],
  },
];

/* ─── 부가 서비스 ─── */
const SERVICES = [
  { title: "입주청소", badge: "BEST", badgeType: "accent", icon: Sparkles, href: "/clean" },
  { title: "인터넷", badge: "최대 현금 지원", badgeType: "primary", icon: Wifi, href: "/internet" },
  { title: "에어컨", badge: null, badgeType: null, icon: AirVent, href: "/aircon" },
];

/* ─── 프로모 배너 ─── */
const BANNERS = [
  {
    eyebrow: "이사 지원금 당첨 확률 2배!",
    title: "인터넷 가입 지원금 추가 지급!",
    bg: "bg-primary",
  },
  {
    eyebrow: "에어컨 설치 비가지 요금?",
    title: "의심, 걱정 없이 끝!",
    bg: "bg-foreground",
  },
  {
    eyebrow: "780만 고객이 선택한 다이사",
    title: "이사업체 비교의 새로운 기준",
    bg: "bg-primary",
  },
];

/* ─── 고객 리뷰 ─── */
const REVIEWS = [
  {
    area: "서울시 강서구",
    company: "업체 한******",
    rating: 5,
    text: "골목이라는 열악한 조건의 이사였음에도 불구하고 끝까지 처리해 주셨어요~",
    id: "591423",
    period: "1개월 내 이사",
  },
  {
    area: "인천시 남동구",
    company: "업체 아********",
    rating: 5,
    text: "이분들께는 안되는건 없으신거같아요!! 정말 최고의 이사였습니다",
    id: "591332",
    period: "2개월 내 이사",
  },
  {
    area: "수원시",
    company: "업체 대***",
    rating: 3,
    text: "전반적으로 괜찮았는데 좀 더 꼼꼼하게 해주셨으면 했습니다",
    id: "591206",
    period: "1개월 내 이사",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [selectedMove, setSelectedMove] = useState<typeof MOVING_CATEGORIES[number] | null>(null);

  const nextBanner = useCallback(() => {
    setBannerIdx((i) => (i + 1) % BANNERS.length);
  }, []);

  const prevBanner = useCallback(() => {
    setBannerIdx((i) => (i - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    const t = setInterval(nextBanner, 4000);
    return () => clearInterval(t);
  }, [nextBanner]);

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header />

      {/* ─── 이사 카테고리 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pt-6 pb-2">
        <div className="grid grid-cols-3 gap-3">
          {MOVING_CATEGORIES.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setSelectedMove(cat)}
              className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-colors text-left"
            >
              <cat.icon className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-[15px] font-bold text-foreground leading-tight">{cat.title}</h3>
              <p className="text-[12px] text-text-secondary mt-1">{cat.desc}</p>
              <p className="text-[11px] text-text-muted mt-0.5">{cat.sub}</p>
            </button>
          ))}
        </div>

        {/* 트럭 일러스트 */}
        <div className="flex items-end justify-center gap-2 mt-4 pb-2 select-none">
          {/* 박스 아이템들 */}
          <div className="flex gap-1 items-end mb-1">
            <div className="w-5 h-5 bg-primary/20 border border-primary/30 rounded-sm" />
            <div className="w-4 h-6 bg-primary/15 border border-primary/25 rounded-sm" />
            <div className="w-6 h-4 bg-primary/20 border border-primary/30 rounded-sm" />
          </div>
          {/* 트럭 */}
          <div className="relative">
            <Truck className="w-14 h-14 text-primary/50" />
          </div>
        </div>
      </section>

      {/* ─── 부가 서비스 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {SERVICES.map((svc) => (
            <Link
              key={svc.title}
              href={svc.href}
              className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/40 transition-colors relative"
            >
              {svc.badge && (
                <span
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap ${
                    svc.badgeType === "accent" ? "bg-accent" : "bg-primary"
                  }`}
                >
                  {svc.badge}
                </span>
              )}
              <svc.icon className="w-7 h-7 mx-auto mb-2 text-text-muted" />
              <p className="text-[14px] font-semibold text-foreground">{svc.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 대출 / 렌탈 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pb-5">
        <div className="grid grid-cols-2 border border-border rounded-xl overflow-hidden">
          <Link href="/loan" className="py-3.5 text-center border-r border-border hover:bg-muted transition-colors">
            <span className="text-[15px] font-semibold text-foreground">대출</span>
          </Link>
          <div className="py-3.5 text-center relative">
            <span className="text-[15px] font-semibold text-text-muted">렌탈</span>
            <span className="ml-1.5 text-[10px] font-medium text-text-muted bg-muted px-1.5 py-0.5 rounded-full">준비 중</span>
          </div>
        </div>
      </section>

      {/* ─── 프로모 배너 슬라이더 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pb-6">
        <div
          className={`${BANNERS[bannerIdx].bg} rounded-2xl px-5 py-5 text-white relative overflow-hidden min-h-[88px] transition-colors duration-500`}
        >
          <p className="text-[13px] text-white/70">{BANNERS[bannerIdx].eyebrow}</p>
          <p className="text-[17px] font-bold mt-0.5 pr-16">{BANNERS[bannerIdx].title}</p>

          {/* 좌우 화살표 */}
          <button
            onClick={prevBanner}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/20 rounded-full hover:bg-black/30 transition-colors"
            aria-label="이전 배너"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/20 rounded-full hover:bg-black/30 transition-colors"
            aria-label="다음 배너"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          {/* 인디케이터 dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === bannerIdx ? "w-4 bg-white" : "w-1.5 bg-white/40"
                }`}
                aria-label={`배너 ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 이사업체 고객 평가 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-foreground">이사업체 고객 평가</h2>
          <Link
            href="#"
            className="text-[13px] text-text-muted flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            더보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 가로 스크롤 리뷰 카드 */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-4 min-w-[268px] snap-start shrink-0"
            >
              {/* 별점 */}
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < r.rating ? "text-primary fill-primary" : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[14px] font-bold text-foreground mb-1">
                {r.area} {r.company}
              </p>
              <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-3 mb-3">
                {r.text}
              </p>
              <p className="text-[12px] text-text-muted">
                {r.id}님 · {r.period}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 해피이사 캠페인 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pb-8">
        <p className="text-[12px] text-text-muted font-medium uppercase tracking-wide mb-1">
          다이사의 사회 공헌 활동
        </p>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-bold text-foreground">해피이사 캠페인</h2>
          <Link
            href="#"
            className="text-[13px] text-text-muted flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            자세히 보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-secondary rounded-2xl overflow-hidden">
          {/* 캠페인 배너 이미지 영역 */}
          <div className="h-[140px] bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center gap-2 border border-primary/10 rounded-2xl">
            <Truck className="w-10 h-10 text-primary/40" />
            <div className="text-center">
              <p className="text-[14px] font-bold text-foreground">해피이사 캠페인</p>
              <p className="text-[12px] text-text-muted mt-0.5">어려운 이웃의 이사를 지원합니다</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ─── 이사 유형 안내 모달 ─── */}
      {selectedMove && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMove(null)} />
          <div className="relative bg-card w-full max-w-[400px] rounded-2xl p-6 animate-slide-up">
            {/* 닫기 */}
            <button
              onClick={() => setSelectedMove(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* 제목 */}
            <h2 className="text-[20px] font-bold text-foreground leading-snug whitespace-pre-line">
              <span className="text-primary">전문 {selectedMove.title.replace("이사", "")}이사 업체</span>를 통한{"\n"}
              쉽고 안전한 {selectedMove.title}!
            </h2>

            {/* 안내 박스 */}
            <div className="mt-5 bg-muted rounded-xl p-4">
              <p className="text-[14px] font-bold text-foreground mb-3">이런분들께 적합해요!</p>
              <ol className="space-y-2">
                {selectedMove.modalItems.map((item, i) => (
                  <li key={i} className="text-[13px] text-text-secondary leading-relaxed flex gap-1.5">
                    <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                    <span dangerouslySetInnerHTML={{
                      __html: item.replace(
                        /^([^가-힣]*[가-힣]+(?:,\s*[가-힣0-9]+)*\s*(?:이상|미만|초과)?)/,
                        '<strong class="text-primary">$1</strong>'
                      )
                    }} />
                  </li>
                ))}
              </ol>
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={() => {
                setSelectedMove(null);
                router.push(selectedMove.href);
              }}
              className="w-full mt-5 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[18px] hover:opacity-90 active:scale-[0.98] transition-all"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

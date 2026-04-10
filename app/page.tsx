"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Home, Building2, Sparkles, Wifi, AirVent, Star, ChevronRight, ChevronLeft } from "lucide-react";

/* ─── 이사 카테고리 ─── */
const MOVING_CATEGORIES = [
  {
    title: "가정이사",
    desc: "3룸, 15평대 이상",
    sub: "아파트 · 빌라 · 주택",
    icon: Truck,
    href: "/moving?type=household",
  },
  {
    title: "소형이사",
    desc: "15평대 미만",
    sub: "원룸 · 투룸 · 오피스텔",
    icon: Home,
    href: "/moving?type=small",
  },
  {
    title: "사무실이사",
    desc: "1톤 초과 짐량",
    sub: "빌딩 · 공장 · 상가 등",
    icon: Building2,
    href: "/moving?type=office",
  },
];

/* ─── 부가 서비스 ─── */
const SERVICES = [
  { title: "입주청소", badge: "BEST", icon: Sparkles, href: "/clean" },
  { title: "인터넷", badge: "최대 현금 지원", icon: Wifi, href: "/internet" },
  { title: "에어컨", badge: null, icon: AirVent, href: "/aircon" },
];

/* ─── 프로모 배너 ─── */
const BANNERS = [
  { text: "이사 지원금 당첨 확률 2배!", sub: "인터넷 가입 지원금 추가 지급!", bg: "bg-primary" },
  { text: "에어컨 설치 비가지 요금?", sub: "의심, 걱정 없이 끝!", bg: "bg-foreground" },
  { text: "780만 고객이 선택한 다이사", sub: "이사업체 비교의 새로운 기준", bg: "bg-primary" },
];

/* ─── 고객 리뷰 ─── */
const REVIEWS = [
  { area: "서울시 강서구", company: "업체 한******", rating: 5, text: "골목이라는 열악한 조건의 이사였음에도 불구하고 끝까지 처리해 주셨어요~", id: "591423", period: "1개월 내 이사" },
  { area: "인천시 남동구", company: "업체 아********", rating: 5, text: "이분들께는 안되는건 없으신거같아요!! 정말 최고의 이사였습니다", id: "591332", period: "2개월 내 이사" },
  { area: "수원시", company: "업체 대***", rating: 3, text: "전반적으로 괜찮았는데 좀 더 꼼꼼하게 해주셨으면 했습니다", id: "591206", period: "1개월 내 이사" },
];

export default function HomePage() {
  const [bannerIdx, setBannerIdx] = useState(0);

  const nextBanner = useCallback(() => {
    setBannerIdx((i) => (i + 1) % BANNERS.length);
  }, []);

  useEffect(() => {
    const t = setInterval(nextBanner, 4000);
    return () => clearInterval(t);
  }, [nextBanner]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ─── 이사 카테고리 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pt-8 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {MOVING_CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-[16px] font-bold text-foreground">{cat.title}</h3>
              <p className="text-[13px] text-text-secondary mt-1">{cat.desc}</p>
              <p className="text-[12px] text-text-muted mt-0.5">{cat.sub}</p>
            </Link>
          ))}
        </div>

        {/* 트럭 일러스트 영역 */}
        <div className="flex justify-center mt-2">
          <div className="flex items-end gap-1 opacity-30">
            <Truck className="w-16 h-16 text-foreground" />
            <div className="w-8 h-6 border-2 border-foreground/30 rounded-sm" />
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
              className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/30 transition-colors relative"
            >
              {svc.badge && (
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                  svc.badge === "BEST" ? "bg-accent" : "bg-primary"
                }`}>
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
      <section className="max-w-[640px] mx-auto px-5 pb-6">
        <div className="grid grid-cols-2 border border-border rounded-xl overflow-hidden">
          <Link href="#" className="py-3.5 text-center text-[15px] font-semibold text-foreground hover:bg-muted transition-colors border-r border-border">
            대출
          </Link>
          <Link href="#" className="py-3.5 text-center text-[15px] font-semibold text-foreground hover:bg-muted transition-colors">
            렌탈
          </Link>
        </div>
      </section>

      {/* ─── 프로모 배너 슬라이더 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pb-6">
        <div className={`${BANNERS[bannerIdx].bg} rounded-2xl px-5 py-5 text-white relative overflow-hidden min-h-[88px] transition-colors duration-500`}>
          <p className="text-[13px] text-white/70">{BANNERS[bannerIdx].text}</p>
          <p className="text-[17px] font-bold mt-0.5">{BANNERS[bannerIdx].sub}</p>

          {/* 인디케이터 */}
          <div className="absolute bottom-3 right-4 bg-black/30 px-2 py-0.5 rounded-full text-[11px] text-white/80">
            {bannerIdx + 1}/{BANNERS.length}
          </div>
        </div>
      </section>

      {/* ─── 이사업체 고객 평가 ─── */}
      <section className="max-w-[640px] mx-auto px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-foreground">이사업체 고객 평가</h2>
          <Link href="#" className="text-[13px] text-text-muted flex items-center gap-0.5 hover:text-foreground transition-colors">
            더보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 가로 스크롤 리뷰 카드 */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 min-w-[280px] snap-start shrink-0">
              {/* 별점 */}
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < r.rating ? "text-primary fill-primary" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="text-[14px] font-bold text-foreground mb-0.5">
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
        <p className="text-[13px] text-text-muted">다이사의 사회 공헌 활동</p>
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-[18px] font-bold text-foreground">해피이사 캠페인</h2>
          <Link href="#" className="text-[13px] text-text-muted flex items-center gap-0.5 hover:text-foreground transition-colors">
            자세히 보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-3 bg-muted rounded-2xl h-[160px] flex items-center justify-center">
          <p className="text-[14px] text-text-muted">캠페인 이미지 영역</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

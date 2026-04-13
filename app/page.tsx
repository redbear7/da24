"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
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

/* ─── 프로모 배너 (fallback) ─── */
const DEFAULT_BANNERS = [
  { eyebrow: "이사 지원금 당첨 확률 2배!", title: "인터넷 가입 지원금 추가 지급!", bg: "bg-primary" },
  { eyebrow: "에어컨 설치 비가지 요금?", title: "의심, 걱정 없이 끝!", bg: "bg-foreground" },
  { eyebrow: "780만 고객이 선택한 다이사", title: "이사업체 비교의 새로운 기준", bg: "bg-primary" },
];

/* ─── 고객 리뷰 fallback (⛔ 수정 금지: 창원시 5개) ─── */
const DEFAULT_REVIEWS = [
  { area: "창원시 성산구", company: "업체 한*****", rating: 5, text: "용지동에서 상남동으로 이사했는데, 사다리차 작업도 완벽했고 가격도 합리적이었습니다.", id: "591423", period: "1개월 내 이사" },
  { area: "창원시 마산합포구", company: "업체 으*****", rating: 5, text: "비 오는 날이었는데도 방수 포장까지 해주시고 정말 감동이었습니다.", id: "591332", period: "2개월 내 이사" },
  { area: "창원시 진해구", company: "업체 스****", rating: 5, text: "원룸 이사인데도 매우 친절하고 빠르게 진행해주셨어요. 1시간 만에 끝!", id: "591287", period: "1개월 내 이사" },
  { area: "창원시 의창구", company: "업체 새****", rating: 4, text: "팔용동에서 봉곡동으로 이사했어요. 5톤 트럭으로 한 번에 다 옮겨주셨습니다.", id: "591206", period: "3주 내 이사" },
  { area: "창원시 마산회원구", company: "업체 굿***", rating: 5, text: "양덕동 신축 아파트로 이사했는데 바닥 보양 작업까지 꼼꼼하게 해주셨어요.", id: "591189", period: "1개월 내 이사" },
];

export default function HomePage() {
  const router = useRouter();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [selectedMove, setSelectedMove] = useState<typeof MOVING_CATEGORIES[number] | null>(null);
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);

  // Supabase에서 배너 + 리뷰 가져오기
  useEffect(() => {
    supabase.from("banners").select("eyebrow,title,bg_class").eq("is_active", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setBanners(data.map((b: { eyebrow: string; title: string; bg_class: string }) => ({ eyebrow: b.eyebrow, title: b.title, bg: b.bg_class })));
      }
    });
    supabase.from("reviews").select("name,rating,text,region,service_type,date").order("created_at", { ascending: false }).limit(5).then(({ data }) => {
      if (data && data.length > 0) {
        setReviews(data.map((r: { name: string; rating: number; text: string; region: string; date: string }) => ({
          area: r.region, company: `업체 ${r.name}`, rating: r.rating, text: r.text, id: "", period: r.date,
        })));
      }
    });
  }, []);

  const nextBanner = useCallback(() => {
    setBannerIdx((i) => (i + 1) % banners.length);
  }, []);

  const prevBanner = useCallback(() => {
    setBannerIdx((i) => (i - 1 + banners.length) % banners.length);
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

        {/* 트럭 달리는 애니메이션 */}
        <div className="relative h-24 mt-4 mb-2 overflow-hidden select-none">
          {/* 배경 도시 건물 (고정) */}
          <div className="absolute bottom-3 left-0 right-0 flex items-end justify-center gap-3 opacity-15">
            <div className="w-6 h-10 bg-primary rounded-sm" />
            <div className="w-5 h-14 bg-primary rounded-sm" />
            <div className="w-7 h-8 bg-primary rounded-sm" />
            <div className="w-4 h-12 bg-primary rounded-sm" />
            <div className="w-24" />
            <div className="w-5 h-11 bg-primary rounded-sm" />
            <div className="w-7 h-16 bg-primary rounded-sm" />
            <div className="w-4 h-9 bg-primary rounded-sm" />
            <div className="w-6 h-13 bg-primary rounded-sm" />
          </div>

          {/* 도로 라인 */}
          <div className="absolute bottom-2 left-0 right-0 h-px bg-border" />
          <div className="absolute bottom-2 left-0 right-0 flex gap-3 animate-road-slow">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-6 h-px bg-text-muted/30 shrink-0" />
            ))}
          </div>

          {/* 트럭 (천천히 바운스) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-[14px] animate-truck-slow">
            <Truck className="w-20 h-20 text-primary/50" />
          </div>

          {/* 바퀴 먼지 */}
          <div className="absolute bottom-3 left-1/2 -translate-x-[55px]">
            <div className="flex gap-1 animate-dust-slow">
              <div className="w-1.5 h-1.5 rounded-full bg-text-muted/15" />
              <div className="w-1 h-1 rounded-full bg-text-muted/10" />
            </div>
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
          className={`${banners[bannerIdx].bg} rounded-2xl px-5 py-5 text-white relative overflow-hidden min-h-[88px] transition-colors duration-500`}
        >
          <p className="text-[13px] text-white/70">{banners[bannerIdx].eyebrow}</p>
          <p className="text-[17px] font-bold mt-0.5 pr-16">{banners[bannerIdx].title}</p>

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
            {banners.map((_, i) => (
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

      {/* ─── 이사업체 고객 평가 (자동 슬라이드) ─── */}
      <section className="max-w-[640px] mx-auto px-5 pb-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-foreground">이사업체 고객 평가</h2>
          <Link
            href="/review"
            className="text-[13px] text-text-muted flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            더보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <ReviewAutoSlider reviews={reviews} />
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

      {/* ─── 이사 멀티스텝 모달 ─── */}
      {selectedMove && <MovingModal move={selectedMove} onClose={() => setSelectedMove(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  이사 멀티스텝 모달                            */
/* ═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════ */
/*  고객 평가 자동 슬라이드                         */
/* ═══════════════════════════════════════════ */

function ReviewAutoSlider({ reviews }: { reviews: typeof REVIEWS }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const GAP = 12;

  const getCardWidth = () => {
    if (typeof window === "undefined") return 280;
    const vw = Math.min(window.innerWidth, 640);
    return Math.floor((vw - 40 - GAP) / 2); // 2장 보이게 (px-5 양쪽 = 40)
  };

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!scrollRef.current || isDragging.current) return;
      const el = scrollRef.current;
      const cardW = getCardWidth();
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + cardW + GAP;
      el.scrollTo({ left: next > max ? 0 : next, behavior: "smooth" });
    }, 6000);
  }, []);

  useEffect(() => {
    startAuto();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startAuto]);

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    startX.current = pageX;
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    const walk = pageX - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onUp = () => {
    isDragging.current = false;
    // 드래그 후 3초 뒤에 자동 슬라이드 재시작
    setTimeout(() => startAuto(), 3000);
  };

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide cursor-grab active:cursor-grabbing"
      style={{ scrollSnapType: "x proximity" }}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
    >
      {reviews.map((r, i) => (
        <Link
          key={i}
          href="/review"
          className="bg-card border border-border rounded-2xl p-4 shrink-0"
          style={{ width: "calc(50% - 6px)", minWidth: 220, scrollSnapAlign: "start" }}
          onClick={(e) => { if (Math.abs((scrollRef.current?.scrollLeft || 0) - scrollLeft.current) > 5) e.preventDefault(); }}
        >
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className={`w-4 h-4 ${j < r.rating ? "text-primary fill-primary" : "text-border"}`} />
            ))}
          </div>
          <p className="text-[14px] font-bold text-foreground truncate">{r.area} {r.company}</p>
          <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2 mt-1">{r.text}</p>
          <p className="text-[12px] text-text-muted mt-2">{r.id}님 · {r.period}</p>
        </Link>
      ))}
    </div>
  );
}

import { openPostcode } from "@/lib/daum-postcode";

const FLOOR_OPTS = ["1층", "2~5층", "6~10층", "11~20층", "21층 이상", "엘리베이터 없음"];

const MOVE_METHODS = [
  { key: "full", title: "포장이사", desc: "업체에게 모든 걸 맡기세요!", steps: ["포장", "운반", "이동", "운반", "뒷정리"], highlight: [0, 1, 2, 3, 4] },
  { key: "half", title: "반포장이사", desc: "잔짐 포장은 내가, 큰 짐은 업체가!", steps: ["포장", "운반", "이동", "운반", "뒷정리"], highlight: [1, 2, 3] },
  { key: "basic", title: "일반이사", desc: "업체가 짐 운반만 도와드려요!", steps: ["포장", "운반", "이동", "운반", "뒷정리"], highlight: [2] },
];

const LUGGAGE_FURNITURE = [
  { key: "bed", label: "침대", icon: "🛏️" },
  { key: "wardrobe", label: "옷장", icon: "🚪" },
  { key: "bookshelf", label: "책장", icon: "📚" },
  { key: "desk", label: "책상", icon: "🪑" },
  { key: "chair", label: "의자", icon: "💺" },
  { key: "table", label: "테이블", icon: "🪵" },
  { key: "sofa", label: "소파", icon: "🛋️" },
  { key: "dresser", label: "화장대", icon: "🪞" },
  { key: "cabinet", label: "수납장", icon: "🗄️" },
  { key: "drawer", label: "서랍장", icon: "📦" },
];

const LUGGAGE_APPLIANCE = [
  { key: "tv", label: "TV/모니터", icon: "📺" },
  { key: "washer", label: "세탁기", icon: "🫧" },
  { key: "dryer", label: "건조기", icon: "♨️" },
  { key: "aircon", label: "에어컨", icon: "❄️" },
  { key: "fridge", label: "냉장고", icon: "🧊" },
  { key: "clothcare", label: "의류관리기", icon: "👔" },
];

type ModalStep = "intro" | "method" | "luggage" | "from" | "to" | "date" | "done";

function MovingModal({ move, onClose }: { move: typeof MOVING_CATEGORIES[number]; onClose: () => void }) {
  const [step, setStep] = useState<ModalStep>("intro");
  const [moveMethod, setMoveMethod] = useState<string | null>(null);
  const [luggage, setLuggage] = useState<Record<string, number>>({});
  const [fromAddr, setFromAddr] = useState("");
  const [fromDetail, setFromDetail] = useState("");
  const [fromFloor, setFromFloor] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [toDetail, setToDetail] = useState("");
  const [toFloor, setToFloor] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const needsMethod = move.type === "small";

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "이사 견적 요청",
          phone: "",
          planType: "moving",
          provider: move.type,
          planName: move.title,
          address: `출발: ${fromAddr} ${fromDetail} (${fromFloor}) → 도착: ${toAddr} ${toDetail} (${toFloor})`,
          memo: `이사 날짜: ${moveDate}`,
        }),
      });
    } catch {}
    setIsSubmitting(false);
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[480px] rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* 핸들바 */}
        <div className="flex justify-center pt-3 sm:hidden"><div className="w-10 h-1 bg-border rounded-full" /></div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-[18px] font-bold text-foreground">
            {step === "intro" && move.title}
            {step === "method" && "이사 방식 선택"}
            {step === "luggage" && "짐량 선택"}
            {step === "from" && "출발지를 검색해주세요"}
            {step === "to" && "도착지를 검색해주세요"}
            {step === "date" && "이사 날짜"}
            {step === "done" && "신청 완료"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 pb-6">

          {/* Step 1: 안내 */}
          {step === "intro" && (
            <>
              <h3 className="text-[18px] font-bold text-foreground leading-snug mt-2">
                <span className="text-primary">전문 포장이사 업체</span>를 통한{"\n"}
                쉽고 안전한 {move.title}!
              </h3>
              <div className="mt-5 bg-muted rounded-xl p-4">
                <p className="text-[14px] font-bold text-foreground mb-3">이런분들께 적합해요!</p>
                <ol className="space-y-2">
                  {move.modalItems.map((item, i) => (
                    <li key={i} className="text-[13px] text-text-secondary leading-relaxed flex gap-1.5">
                      <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
              <button onClick={() => setStep(needsMethod ? "method" : "from")} className="w-full mt-5 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[18px] hover:opacity-90 active:scale-[0.98] transition-all">
                다음
              </button>
            </>
          )}

          {/* Step 1.5: 이사 방식 선택 (소형이사만) */}
          {step === "method" && (
            <>
              <div className="mt-2">
                <h3 className="text-[20px] font-bold text-foreground leading-snug">
                  원하시는 이사 방식을<br />선택해 주세요
                </h3>
              </div>

              <div className="mt-5 space-y-3">
                {MOVE_METHODS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMoveMethod(m.key)}
                    className={`w-full text-left bg-card border-2 rounded-xl p-4 transition-all ${
                      moveMethod === m.key ? "border-primary" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <p className="text-[16px] font-bold text-foreground">{m.title}</p>
                    <p className="text-[13px] text-text-secondary mt-0.5">{m.desc}</p>
                    {/* 단계 바 */}
                    <div className="flex items-center mt-3 gap-0">
                      {m.steps.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div className="flex items-center w-full">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.highlight.includes(i) ? "bg-primary" : "bg-border"}`} />
                            {i < m.steps.length - 1 && (
                              <div className={`flex-1 h-0.5 ${m.highlight.includes(i) && m.highlight.includes(i + 1) ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                          <span className={`text-[11px] mt-1 ${m.highlight.includes(i) ? "text-foreground font-medium" : "text-text-muted"}`}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setStep("intro")}
                  className="px-6 py-4 border border-border rounded-xl text-[16px] font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  이전
                </button>
                <button
                  onClick={() => setStep("luggage")}
                  disabled={!moveMethod}
                  className="flex-1 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[18px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  다음
                </button>
              </div>
            </>
          )}

          {/* Step 2: 짐량 선택 (소형이사) */}
          {step === "luggage" && (
            <>
              <div className="mt-2">
                <h3 className="text-[20px] font-bold text-primary leading-snug">
                  내 짐량에 맞는 이사, 고민하지 마세요!
                </h3>
                <p className="text-[13px] text-text-secondary mt-2">
                  선택하신 짐량이 원룸 규모면 소형이사, 그 이상은 가정이사로 자동 접수해드려요.
                </p>
                <p className="text-[12px] text-text-muted mt-1">
                  *짐량 선택 시 버리고 갈 짐은 제외하고 입력해 주세요.
                </p>
              </div>

              {/* 가구 */}
              <div className="mt-5">
                <h4 className="text-[16px] font-bold text-foreground mb-3">가구</h4>
                <div className="grid grid-cols-3 gap-2">
                  {LUGGAGE_FURNITURE.map((item) => {
                    const count = luggage[item.key] || 0;
                    return (
                      <div
                        key={item.key}
                        className={`border rounded-xl p-3 text-center transition-all ${
                          count > 0 ? "border-primary bg-secondary/50" : "border-border bg-card"
                        }`}
                      >
                        <span className="text-[24px]">{item.icon}</span>
                        <p className="text-[13px] font-medium text-foreground mt-1">{item.label}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <button
                            onClick={() => setLuggage((prev) => ({ ...prev, [item.key]: Math.max(0, (prev[item.key] || 0) - 1) }))}
                            className="w-7 h-7 rounded-full border border-border text-foreground text-[16px] flex items-center justify-center hover:bg-muted"
                          >
                            −
                          </button>
                          <span className="text-[15px] font-bold text-foreground w-6 text-center">{count}</span>
                          <button
                            onClick={() => setLuggage((prev) => ({ ...prev, [item.key]: (prev[item.key] || 0) + 1 }))}
                            className="w-7 h-7 rounded-full border border-primary text-primary text-[16px] flex items-center justify-center hover:bg-secondary"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 가전 */}
              <div className="mt-5">
                <h4 className="text-[16px] font-bold text-foreground mb-3">가전</h4>
                <div className="grid grid-cols-3 gap-2">
                  {LUGGAGE_APPLIANCE.map((item) => {
                    const count = luggage[item.key] || 0;
                    return (
                      <div
                        key={item.key}
                        className={`border rounded-xl p-3 text-center transition-all ${
                          count > 0 ? "border-primary bg-secondary/50" : "border-border bg-card"
                        }`}
                      >
                        <span className="text-[24px]">{item.icon}</span>
                        <p className="text-[13px] font-medium text-foreground mt-1">{item.label}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <button
                            onClick={() => setLuggage((prev) => ({ ...prev, [item.key]: Math.max(0, (prev[item.key] || 0) - 1) }))}
                            className="w-7 h-7 rounded-full border border-border text-foreground text-[16px] flex items-center justify-center hover:bg-muted"
                          >
                            −
                          </button>
                          <span className="text-[15px] font-bold text-foreground w-6 text-center">{count}</span>
                          <button
                            onClick={() => setLuggage((prev) => ({ ...prev, [item.key]: (prev[item.key] || 0) + 1 }))}
                            className="w-7 h-7 rounded-full border border-primary text-primary text-[16px] flex items-center justify-center hover:bg-secondary"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setStep("method")}
                  className="px-6 py-4 border border-border rounded-xl text-[16px] font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  이전
                </button>
                <button
                  onClick={() => setStep("from")}
                  className="flex-1 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[18px] hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  다음
                </button>
              </div>
            </>
          )}

          {/* Step 3: 출발지 */}
          {step === "from" && (
            <>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fromAddr}
                    readOnly
                    onClick={() => openPostcode(setFromAddr)}
                    placeholder="도로명, 지번, 건물명 (2글자 이상)"
                    className="flex-1 px-4 py-3.5 bg-muted border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted cursor-pointer"
                  />
                  <button onClick={() => openPostcode(setFromAddr)} className="px-4 bg-muted border border-border rounded-xl hover:bg-border transition-colors">
                    🔍
                  </button>
                </div>
                <input
                  type="text"
                  value={fromDetail}
                  onChange={(e) => setFromDetail(e.target.value)}
                  placeholder="상세 주소 (동/호수)"
                  className="w-full px-4 py-3.5 bg-muted border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted"
                />

                {/* 주소검색 Tip */}
                {!fromAddr && (
                  <div className="mt-4">
                    <p className="text-[14px] font-bold text-foreground mb-2">주소검색 Tip</p>
                    <ul className="space-y-2 text-[13px] text-text-secondary">
                      <li>• 도로명 + 건물번호<br /><span className="text-text-muted ml-3">(예 : 테헤란로7길 12)</span></li>
                      <li>• 지번(동/읍.면/리) + 번지수<br /><span className="text-text-muted ml-3">(예 : 역삼동 648)</span></li>
                      <li>• 건물명, 아파트명<br /><span className="text-text-muted ml-3">(예 : 동궁빌딩)</span></li>
                    </ul>
                  </div>
                )}

                {/* 층수 선택 */}
                {fromAddr && (
                  <div className="mt-3">
                    <p className="text-[13px] font-semibold text-foreground mb-2">층수 선택</p>
                    <div className="grid grid-cols-3 gap-2">
                      {FLOOR_OPTS.map((f) => (
                        <button key={f} onClick={() => setFromFloor(f)} className={`py-2.5 rounded-xl border text-[13px] font-medium transition-all ${fromFloor === f ? "border-primary bg-secondary text-primary" : "border-border bg-card text-foreground"}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep("to")}
                disabled={!fromAddr}
                className="w-full mt-5 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[18px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                다음
              </button>
            </>
          )}

          {/* Step 3: 도착지 */}
          {step === "to" && (
            <>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={toAddr}
                    readOnly
                    onClick={() => openPostcode(setToAddr)}
                    placeholder="도로명, 지번, 건물명 (2글자 이상)"
                    className="flex-1 px-4 py-3.5 bg-muted border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted cursor-pointer"
                  />
                  <button onClick={() => openPostcode(setToAddr)} className="px-4 bg-muted border border-border rounded-xl hover:bg-border transition-colors">
                    🔍
                  </button>
                </div>
                <input
                  type="text"
                  value={toDetail}
                  onChange={(e) => setToDetail(e.target.value)}
                  placeholder="상세 주소 (동/호수)"
                  className="w-full px-4 py-3.5 bg-muted border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted"
                />

                {!toAddr && (
                  <div className="mt-4">
                    <p className="text-[14px] font-bold text-foreground mb-2">주소검색 Tip</p>
                    <ul className="space-y-2 text-[13px] text-text-secondary">
                      <li>• 도로명 + 건물번호<br /><span className="text-text-muted ml-3">(예 : 테헤란로7길 12)</span></li>
                      <li>• 지번(동/읍.면/리) + 번지수<br /><span className="text-text-muted ml-3">(예 : 역삼동 648)</span></li>
                      <li>• 건물명, 아파트명<br /><span className="text-text-muted ml-3">(예 : 동궁빌딩)</span></li>
                    </ul>
                  </div>
                )}

                {toAddr && (
                  <div className="mt-3">
                    <p className="text-[13px] font-semibold text-foreground mb-2">층수 선택</p>
                    <div className="grid grid-cols-3 gap-2">
                      {FLOOR_OPTS.map((f) => (
                        <button key={f} onClick={() => setToFloor(f)} className={`py-2.5 rounded-xl border text-[13px] font-medium transition-all ${toFloor === f ? "border-primary bg-secondary text-primary" : "border-border bg-card text-foreground"}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep("date")}
                disabled={!toAddr}
                className="w-full mt-5 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[18px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                다음
              </button>
            </>
          )}

          {/* Step 4: 이사 날짜 */}
          {step === "date" && (
            <>
              <div className="mt-4 space-y-4">
                {/* 요약 */}
                <div className="bg-muted rounded-xl p-4 space-y-2 text-[13px]">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold shrink-0">출발</span>
                    <span className="text-foreground">{fromAddr} {fromDetail} {fromFloor && `(${fromFloor})`}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent font-bold shrink-0">도착</span>
                    <span className="text-foreground">{toAddr} {toDetail} {toFloor && `(${toFloor})`}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-foreground mb-2">이사 희망일을 선택해주세요</p>
                  <input
                    type="date"
                    value={moveDate}
                    min={today}
                    onChange={(e) => setMoveDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-muted border border-border rounded-xl text-[15px] text-foreground"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  <span className="text-[13px] text-text-secondary">보관이사 필요</span>
                  <span className="text-[11px] text-text-muted">ⓘ</span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!moveDate || isSubmitting}
                className="w-full mt-5 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[18px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {isSubmitting ? "신청 중..." : "추천업체 바로 신청하기"}
              </button>
            </>
          )}

          {/* Step 5: 완료 */}
          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[28px]">✅</span>
              </div>
              <h3 className="text-[20px] font-bold text-foreground">견적 요청 완료!</h3>
              <p className="text-[14px] text-text-secondary mt-2 leading-relaxed">
                추천 업체에서 곧 연락드릴 예정입니다.<br />
                채팅내역에서 진행 상황을 확인하세요.
              </p>
              <button onClick={onClose} className="w-full mt-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all">
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

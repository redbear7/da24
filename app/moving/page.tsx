"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Home,
  Building2,
  MapPin,
  CalendarDays,
  User,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle,
  X,
  ChevronRight,
  Star,
  Shield,
  Clock,
  Award,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────

type MoveType = "household" | "small" | "office";

const MOVE_TYPES: { key: MoveType; label: string; desc: string; sub: string; icon: React.ElementType }[] = [
  {
    key: "household",
    label: "가정이사",
    desc: "3룸, 15평대 이상",
    sub: "아파트 · 빌라 · 주택",
    icon: Truck,
  },
  {
    key: "small",
    label: "소형이사",
    desc: "15평대 미만",
    sub: "원룸 · 투룸 · 오피스텔",
    icon: Home,
  },
  {
    key: "office",
    label: "사무실이사",
    desc: "1톤 초과 짐량",
    sub: "빌딩 · 공장 · 상가 등",
    icon: Building2,
  },
];

const SIZE_OPTIONS = [
  "10평 이하", "11~15평", "16~20평", "21~25평",
  "26~30평", "31~40평", "41~50평", "51평 이상",
];

const FLOOR_OPTIONS = ["1층", "2~5층", "6~10층", "11~20층", "21층 이상"];

const REVIEWS = [
  {
    name: "김*수",
    score: 5,
    date: "2026.03.20",
    type: "가정이사",
    body: "32평 아파트 이사인데 포장부터 정리까지 완벽했어요. 가구 하나 흠집 없이 안전하게 옮겨주셨습니다!",
  },
  {
    name: "이*현",
    score: 5,
    date: "2026.03.12",
    type: "소형이사",
    body: "원룸 이사인데도 매우 친절하고 빠르게 진행해주셨어요. 짐이 많았는데 꼼꼼하게 포장해주셨습니다.",
  },
  {
    name: "박*민",
    score: 4,
    date: "2026.02.28",
    type: "사무실이사",
    body: "사무실 이사 맡겼는데 장비 손상 없이 안전하게 완료했습니다. 시간도 딱 맞춰 주셔서 업무에 차질이 없었어요.",
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function MoveTypeSelector({
  selected,
  onChange,
}: {
  selected: MoveType;
  onChange: (t: MoveType) => void;
}) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pt-6 pb-4">
      <h2 className="text-[16px] font-bold text-foreground mb-3">이사 유형 선택</h2>
      <div className="grid grid-cols-3 gap-3">
        {MOVE_TYPES.map(({ key, label, desc, sub, icon: Icon }) => {
          const isActive = selected === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={[
                "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left",
                isActive
                  ? "border-primary bg-secondary/50 shadow-sm"
                  : "border-border bg-card hover:border-primary/20",
              ].join(" ")}
            >
              <Icon className={`w-6 h-6 mb-2 ${isActive ? "text-primary" : "text-text-muted"}`} />
              <p className="text-[15px] font-bold text-foreground">{label}</p>
              <p className="text-[12px] text-text-secondary mt-0.5">{desc}</p>
              <p className="text-[11px] text-text-muted mt-0.5">{sub}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: { address: string; zonecode: string; buildingName?: string }) => void;
      }) => { open: () => void };
    };
  }
}

function openPostcode(onComplete: (addr: string) => void) {
  if (typeof window === "undefined" || !window.daum?.Postcode) {
    alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }
  new window.daum.Postcode({
    oncomplete: (data) => {
      const full = data.buildingName
        ? `${data.address} (${data.buildingName})`
        : data.address;
      onComplete(full);
    },
  }).open();
}

function AddressSection({
  fromAddr,
  fromDetail,
  toAddr,
  toDetail,
  onFromChange,
  onFromDetailChange,
  onToChange,
  onToDetailChange,
}: {
  fromAddr: string;
  fromDetail: string;
  toAddr: string;
  toDetail: string;
  onFromChange: (v: string) => void;
  onFromDetailChange: (v: string) => void;
  onToChange: (v: string) => void;
  onToDetailChange: (v: string) => void;
}) {
  const inputBase = "w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition-all";

  return (
    <section className="max-w-[640px] mx-auto px-5 pb-4">
      <h2 className="text-[16px] font-bold text-foreground mb-3">출발지 / 도착지</h2>
      <div className="space-y-3">
        {/* 출발지 */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[12px] font-semibold text-primary mb-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> 출발지
          </p>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={fromAddr}
              readOnly
              onClick={() => openPostcode(onFromChange)}
              placeholder="주소 검색을 눌러주세요"
              className={`${inputBase} flex-1 cursor-pointer`}
            />
            <button
              type="button"
              onClick={() => openPostcode(onFromChange)}
              className="px-4 py-2.5 bg-primary text-primary-foreground text-[13px] font-semibold rounded-lg hover:opacity-90 active:scale-[0.97] transition-all shrink-0"
            >
              주소 검색
            </button>
          </div>
          <input
            type="text"
            value={fromDetail}
            onChange={(e) => onFromDetailChange(e.target.value)}
            placeholder="상세 주소 (동/호수)"
            className={inputBase}
          />
        </div>

        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[16px] text-primary font-bold">↓</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* 도착지 */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[12px] font-semibold text-accent mb-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> 도착지
          </p>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={toAddr}
              readOnly
              onClick={() => openPostcode(onToChange)}
              placeholder="주소 검색을 눌러주세요"
              className={`${inputBase} flex-1 cursor-pointer`}
            />
            <button
              type="button"
              onClick={() => openPostcode(onToChange)}
              className="px-4 py-2.5 bg-primary text-primary-foreground text-[13px] font-semibold rounded-lg hover:opacity-90 active:scale-[0.97] transition-all shrink-0"
            >
              주소 검색
            </button>
          </div>
          <input
            type="text"
            value={toDetail}
            onChange={(e) => onToDetailChange(e.target.value)}
            placeholder="상세 주소 (동/호수)"
            className={inputBase}
          />
        </div>
      </div>
    </section>
  );
}

function SizeFloorSelector({
  selectedSize,
  onSizeChange,
  selectedFloor,
  onFloorChange,
}: {
  selectedSize: number | null;
  onSizeChange: (i: number) => void;
  selectedFloor: number | null;
  onFloorChange: (i: number) => void;
}) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-4">
      <h2 className="text-[16px] font-bold text-foreground mb-3">평수 / 층수</h2>

      <div className="mb-4">
        <p className="text-[13px] text-text-secondary mb-2">평수를 선택해 주세요</p>
        <div className="grid grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((s, i) => (
            <button
              key={s}
              onClick={() => onSizeChange(i)}
              className={[
                "py-3 rounded-xl border text-[13px] font-medium transition-all",
                selectedSize === i
                  ? "border-primary bg-secondary text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[13px] text-text-secondary mb-2">층수를 선택해 주세요</p>
        <div className="grid grid-cols-5 gap-2">
          {FLOOR_OPTIONS.map((f, i) => (
            <button
              key={f}
              onClick={() => onFloorChange(i)}
              className={[
                "py-3 rounded-xl border text-[12px] font-medium transition-all",
                selectedFloor === i
                  ? "border-primary bg-secondary text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MoveDateSelector({
  selectedDate,
  onChange,
}: {
  selectedDate: string;
  onChange: (d: string) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">이사 희망일</h2>
      <div className="relative">
        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3.5 bg-card border border-border rounded-xl text-[15px] text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>
      {selectedDate && (
        <p className="text-[13px] text-text-secondary mt-2 ml-1">
          선택하신 날짜:{" "}
          <span className="font-semibold text-primary">{selectedDate.replace(/-/g, ".")}</span>
        </p>
      )}
    </section>
  );
}

function BenefitsSection() {
  const items = [
    { icon: <Shield className="w-5 h-5 text-primary" />, title: "실시간 업체 비교", desc: "다수 이사업체의 견적을 한눈에 비교하세요." },
    { icon: <Award className="w-5 h-5 text-primary" />, title: "검증된 업체만", desc: "엄격한 심사를 통과한 안전한 업체만 제공합니다." },
    { icon: <Clock className="w-5 h-5 text-primary" />, title: "빠른 매칭", desc: "신청 후 30분 내 견적을 받아보실 수 있어요." },
    { icon: <Star className="w-5 h-5 text-primary" />, title: "780만 이용 고객", desc: "누적 이사 건수 780만 이상의 신뢰 플랫폼입니다." },
  ];
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">다이사 이용 혜택</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.title} className="bg-card border border-border rounded-xl p-4">
            <div className="mb-2">{item.icon}</div>
            <p className="text-[14px] font-semibold text-foreground mb-1">{item.title}</p>
            <p className="text-[12px] text-text-secondary leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-8">
      <h2 className="text-[16px] font-bold text-foreground mb-3">고객 후기</h2>
      <div className="space-y-3">
        {REVIEWS.map((r) => (
          <div key={r.name + r.date} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-foreground">{r.name}</span>
                <span className="text-[12px] bg-secondary text-primary px-2 py-0.5 rounded-full font-medium">
                  {r.type}
                </span>
              </div>
              <span className="text-[12px] text-text-muted">{r.date}</span>
            </div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < r.score ? "text-yellow-400 fill-yellow-400" : "text-border"}`}
                />
              ))}
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Consultation Form Modal
// ─────────────────────────────────────────────

function MoveConsultationForm({
  isOpen,
  onClose,
  moveType,
  fromAddr,
  toAddr,
  size,
  date,
}: {
  isOpen: boolean;
  onClose: () => void;
  moveType: MoveType;
  fromAddr: string;
  toAddr: string;
  size: string | null;
  date: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const typeName = MOVE_TYPES.find((t) => t.key === moveType)?.label ?? "";

  const formatPhone = (val: string) => {
    const nums = val.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setName(""); setPhone(""); setMemo("");
    }, 2000);
  };

  if (!isOpen) return null;

  const inputCls =
    "w-full px-4 py-3 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[480px] rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-lg font-bold text-foreground">무료 견적 신청</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mx-5 mb-4 bg-secondary rounded-xl px-4 py-3">
          <p className="text-[13px] font-semibold text-primary mb-1">{typeName}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-text-secondary">
            {size && <span>· {size}</span>}
            {date && <span>· 희망일 {date.replace(/-/g, ".")}</span>}
            {fromAddr && <span>· {fromAddr.slice(0, 12)}{fromAddr.length > 12 ? "..." : ""} → {toAddr.slice(0, 12)}{toAddr.length > 12 ? "..." : ""}</span>}
          </div>
        </div>

        {isSuccess ? (
          <div className="px-5 py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-bold text-foreground">신청이 완료되었습니다!</p>
            <p className="text-sm text-text-muted mt-2">전문 상담사가 곧 연락드릴 예정입니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 pb-8">
            <label className="block mb-4">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <User className="w-4 h-4 text-muted-foreground" />
                이름 <span className="text-accent">*</span>
              </span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" required className={inputCls} />
            </label>
            <label className="block mb-4">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <Phone className="w-4 h-4 text-muted-foreground" />
                연락처 <span className="text-accent">*</span>
              </span>
              <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="010-1234-5678" required className={inputCls} />
            </label>
            <label className="block mb-6">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                요청사항
              </span>
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="특이사항이 있으면 알려주세요" rows={3} className={`${inputCls} resize-none`} />
            </label>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !phone.trim()}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "무료 견적 신청하기"}
            </button>
            <p className="text-[11px] text-text-muted text-center mt-3">
              신청 시 개인정보 수집·이용에 동의한 것으로 간주됩니다.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Bottom Bar
// ─────────────────────────────────────────────

function MoveBottomBar({ onConsultClick }: { onConsultClick: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bottom-bar-bg safe-bottom">
      <div className="max-w-[640px] mx-auto px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] text-bottom-bar-text/70">업체 비교 견적</span>
          <span className="text-[16px] font-bold text-bottom-bar-text">무료로 받아보세요!</span>
        </div>
        <button
          onClick={onConsultClick}
          className="w-full py-4 bg-white text-primary font-bold rounded-xl text-[18px] hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          무료 견적 신청하기
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────

function MoveHeroSection() {
  return (
    <section className="max-w-[640px] mx-auto px-5 pt-6 pb-5">
      <p className="text-[13px] font-semibold text-primary mb-2">가정이사 · 소형이사 · 사무실이사</p>
      <h1 className="text-[24px] font-bold text-foreground leading-snug mb-2">
        이사업체 비교는<br />
        <span className="text-primary">다이사에서 한번에</span>
      </h1>
      <p className="text-[14px] text-text-secondary leading-relaxed">
        780만 고객이 선택한 이사 비교 플랫폼. 유형과 주소를 입력하면 검증된 업체의 견적을 한눈에 비교할 수 있어요.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function MovingPage() {
  const [moveType, setMoveType] = useState<MoveType>("household");
  const [fromAddr, setFromAddr] = useState("");
  const [fromDetail, setFromDetail] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [toDetail, setToDetail] = useState("");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MoveHeroSection />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <MoveTypeSelector selected={moveType} onChange={(t) => { setMoveType(t); setSelectedSize(null); setSelectedFloor(null); }} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <AddressSection fromAddr={fromAddr} fromDetail={fromDetail} toAddr={toAddr} toDetail={toDetail} onFromChange={setFromAddr} onFromDetailChange={setFromDetail} onToChange={setToAddr} onToDetailChange={setToDetail} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <SizeFloorSelector
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        selectedFloor={selectedFloor}
        onFloorChange={setSelectedFloor}
      />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <MoveDateSelector selectedDate={selectedDate} onChange={setSelectedDate} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <BenefitsSection />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <ReviewsSection />

      <Footer />

      <MoveBottomBar onConsultClick={() => setIsFormOpen(true)} />

      <MoveConsultationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        moveType={moveType}
        fromAddr={fromAddr}
        toAddr={toAddr}
        size={selectedSize !== null ? SIZE_OPTIONS[selectedSize] : null}
        date={selectedDate}
      />
    </div>
  );
}

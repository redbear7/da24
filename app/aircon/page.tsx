"use client";

import { useState } from "react";
import {
  AirVent,
  Wrench,
  RotateCcw,
  Trash2,
  MapPin,
  CalendarDays,
  User,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle,
  X,
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

type ServiceType = "install" | "repair" | "clean" | "remove";
type AirconType = "wall" | "standing" | "ceiling" | "multi";

const SERVICE_TYPES: { key: ServiceType; label: string; desc: string; icon: React.ElementType }[] = [
  { key: "install", label: "설치", desc: "신규 에어컨 설치", icon: Wrench },
  { key: "repair", label: "수리", desc: "고장 수리·점검", icon: RotateCcw },
  { key: "clean", label: "청소", desc: "내부 세척·살균", icon: AirVent },
  { key: "remove", label: "철거", desc: "기존 에어컨 제거", icon: Trash2 },
];

const AIRCON_TYPES: { key: AirconType; label: string; desc: string }[] = [
  { key: "wall", label: "벽걸이형", desc: "가정용 일반형" },
  { key: "standing", label: "스탠드형", desc: "대형 원룸·거실" },
  { key: "ceiling", label: "천장형", desc: "업소·사무실용" },
  { key: "multi", label: "멀티형", desc: "2대 이상 연결" },
];

const PRICE_TABLE: Record<ServiceType, Record<AirconType, string>> = {
  install: { wall: "80,000원~", standing: "120,000원~", ceiling: "200,000원~", multi: "문의" },
  repair:  { wall: "50,000원~", standing: "70,000원~",  ceiling: "100,000원~", multi: "문의" },
  clean:   { wall: "60,000원~", standing: "90,000원~",  ceiling: "130,000원~", multi: "문의" },
  remove:  { wall: "40,000원~", standing: "60,000원~",  ceiling: "90,000원~",  multi: "문의" },
};

const REVIEWS = [
  {
    name: "최*영",
    score: 5,
    date: "2026.03.22",
    type: "설치",
    body: "벽걸이 에어컨 설치인데 배관 구멍부터 마감까지 정말 깔끔하게 해주셨어요. 가격도 합리적이었습니다!",
  },
  {
    name: "홍*동",
    score: 5,
    date: "2026.03.15",
    type: "청소",
    body: "스탠드형 에어컨 청소인데 곰팡이 냄새가 완전히 없어졌어요. 전문 장비로 꼼꼼히 세척해주셨습니다.",
  },
  {
    name: "송*아",
    score: 4,
    date: "2026.02.20",
    type: "수리",
    body: "냉각이 안 되는 문제 빠르게 진단해서 수리해주셨어요. 당일 방문해주셔서 정말 도움이 됐습니다.",
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function ServiceTypeSelector({
  selected,
  onChange,
}: {
  selected: ServiceType;
  onChange: (t: ServiceType) => void;
}) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pt-6 pb-4">
      <h2 className="text-[16px] font-bold text-foreground mb-3">서비스 유형</h2>
      <div className="grid grid-cols-4 border border-border rounded-xl overflow-hidden">
        {SERVICE_TYPES.map(({ key, label, desc, icon: Icon }, i) => {
          const isActive = selected === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={[
                "py-3 text-center transition-colors",
                i > 0 ? "border-l border-border" : "",
                isActive ? "bg-card text-primary" : "bg-muted text-muted-foreground",
              ].join(" ")}
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className="block text-[14px] font-semibold">{label}</span>
              <span className="block text-[11px] mt-0.5 opacity-70">{desc}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AirconTypeSelector({
  selected,
  onChange,
}: {
  selected: AirconType | null;
  onChange: (t: AirconType) => void;
}) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-4">
      <h2 className="text-[16px] font-bold text-foreground mb-3">에어컨 종류</h2>
      <div className="grid grid-cols-2 gap-3">
        {AIRCON_TYPES.map(({ key, label, desc }) => {
          const isActive = selected === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={[
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                isActive ? "border-primary bg-secondary/50 shadow-sm" : "border-border bg-card hover:border-primary/20",
              ].join(" ")}
            >
              <AirVent className={`w-6 h-6 shrink-0 ${isActive ? "text-primary" : "text-text-muted"}`} />
              <div>
                <p className="text-[15px] font-bold text-foreground">{label}</p>
                <p className="text-[12px] text-text-secondary">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PriceEstimateBox({
  serviceType,
  airconType,
}: {
  serviceType: ServiceType;
  airconType: AirconType | null;
}) {
  const serviceLabel = SERVICE_TYPES.find((s) => s.key === serviceType)?.label ?? "";
  const airconLabel = AIRCON_TYPES.find((a) => a.key === airconType)?.label ?? "";

  if (!airconType) {
    return (
      <section className="max-w-[640px] mx-auto px-5 pb-6">
        <div className="bg-secondary rounded-xl px-5 py-4 text-center">
          <p className="text-[14px] text-text-secondary">에어컨 종류를 선택하면 예상 견적을 안내해 드려요</p>
        </div>
      </section>
    );
  }

  const price = PRICE_TABLE[serviceType][airconType];

  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <div className="bg-secondary rounded-xl px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[14px] text-text-secondary">{serviceLabel} · {airconLabel}</span>
          <span className="text-[11px] text-text-muted">VAT 포함</span>
        </div>
        {price === "문의" ? (
          <p className="text-[20px] font-bold text-primary mt-1">견적 문의</p>
        ) : (
          <div className="flex items-end gap-1.5 mt-1">
            <span className="text-[11px] text-text-muted">예상 견적</span>
            <span className="text-[26px] font-extrabold text-primary leading-none">{price.replace("원~", "")}</span>
            <span className="text-[15px] font-semibold text-foreground mb-0.5">원~</span>
          </div>
        )}
        <p className="text-[11px] text-text-muted mt-2">
          * 현장 상황에 따라 견적이 달라질 수 있습니다.
        </p>
      </div>
    </section>
  );
}

function PriceGuideSection({ serviceType }: { serviceType: ServiceType }) {
  const serviceLabel = SERVICE_TYPES.find((s) => s.key === serviceType)?.label ?? "";

  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">가격 안내</h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <p className="text-[13px] font-semibold text-text-secondary">{serviceLabel} 기준 요금표 (VAT 포함)</p>
        </div>
        {AIRCON_TYPES.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between px-4 py-3 border-b border-border-subtle last:border-b-0">
            <span className="text-[14px] text-foreground">{label}</span>
            <span className="text-[14px] font-semibold text-foreground">{PRICE_TABLE[serviceType][key]}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-text-muted mt-2 ml-1">
        * 현장 상태, 배관 길이 등에 따라 요금이 달라질 수 있습니다.
      </p>
    </section>
  );
}

function DateAddressSection({
  selectedDate,
  onDateChange,
  address,
  onAddressChange,
}: {
  selectedDate: string;
  onDateChange: (d: string) => void;
  address: string;
  onAddressChange: (v: string) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">방문 희망일 · 주소</h2>
      <div className="space-y-3">
        <div className="relative">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="date"
            value={selectedDate}
            min={today}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 bg-card border border-border rounded-xl text-[15px] text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="방문 주소를 입력해 주세요"
            className="w-full pl-10 pr-4 py-3.5 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const items = [
    { icon: <Shield className="w-5 h-5 text-primary" />, title: "전문 기사 파견", desc: "공조 전문 자격 보유 기사가 방문합니다." },
    { icon: <Award className="w-5 h-5 text-primary" />, title: "품질 보증", desc: "시공 후 1개월 무상 AS를 제공합니다." },
    { icon: <Clock className="w-5 h-5 text-primary" />, title: "당일 방문 가능", desc: "오전 접수 시 당일 방문 서비스를 제공합니다." },
    { icon: <Star className="w-5 h-5 text-primary" />, title: "투명한 견적", desc: "숨은 비용 없이 사전 견적을 안내합니다." },
  ];
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">다이사 에어컨 서비스 혜택</h2>
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
                <span className="text-[12px] bg-secondary text-primary px-2 py-0.5 rounded-full font-medium">{r.type}</span>
              </div>
              <span className="text-[12px] text-text-muted">{r.date}</span>
            </div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < r.score ? "text-yellow-400 fill-yellow-400" : "text-border"}`} />
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

function AirconConsultationForm({
  isOpen,
  onClose,
  serviceType,
  airconType,
  date,
  address,
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  airconType: AirconType | null;
  date: string;
  address: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const serviceLabel = SERVICE_TYPES.find((s) => s.key === serviceType)?.label ?? "";
  const airconLabel = AIRCON_TYPES.find((a) => a.key === airconType)?.label ?? "";

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
          <h2 className="text-lg font-bold text-foreground">무료 상담 신청</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mx-5 mb-4 bg-secondary rounded-xl px-4 py-3">
          <p className="text-[13px] font-semibold text-primary mb-1">{serviceLabel}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-text-secondary">
            {airconLabel && <span>· {airconLabel}</span>}
            {date && <span>· {date.replace(/-/g, ".")}</span>}
            {address && <span>· {address.slice(0, 15)}{address.length > 15 ? "..." : ""}</span>}
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
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="에어컨 모델명, 증상 등 알려주세요" rows={3} className={`${inputCls} resize-none`} />
            </label>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !phone.trim()}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "무료 상담 신청하기"}
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

function AirconBottomBar({
  onConsultClick,
  serviceType,
  airconType,
}: {
  onConsultClick: () => void;
  serviceType: ServiceType;
  airconType: AirconType | null;
}) {
  const price = airconType ? PRICE_TABLE[serviceType][airconType] : null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bottom-bar-bg safe-bottom">
      <div className="max-w-[640px] mx-auto px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] text-bottom-bar-text/70">예상 견적</span>
          {price ? (
            <span className="text-[20px] font-extrabold text-bottom-bar-text">{price}</span>
          ) : (
            <span className="text-[16px] font-bold text-bottom-bar-text/60">종류를 선택해 주세요</span>
          )}
        </div>
        <button
          onClick={onConsultClick}
          className="w-full py-4 bg-white text-primary font-bold rounded-xl text-[18px] hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          무료 상담 신청하기
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function AirconPage() {
  const [serviceType, setServiceType] = useState<ServiceType>("install");
  const [airconType, setAirconType] = useState<AirconType | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [address, setAddress] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="max-w-[640px] mx-auto px-5 pt-6 pb-5">
        <p className="text-[13px] font-semibold text-primary mb-2">설치 · 수리 · 청소 · 철거</p>
        <h1 className="text-[24px] font-bold text-foreground leading-snug mb-2">
          에어컨, 전문가에게<br />
          <span className="text-primary">믿고 맡기세요</span>
        </h1>
        <p className="text-[14px] text-text-secondary leading-relaxed">
          공조 전문 자격 보유 기사가 투명한 가격으로 빠르게 서비스합니다. 당일 방문도 가능합니다.
        </p>
      </section>

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <ServiceTypeSelector selected={serviceType} onChange={(t) => { setServiceType(t); setAirconType(null); }} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <AirconTypeSelector selected={airconType} onChange={setAirconType} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <PriceEstimateBox serviceType={serviceType} airconType={airconType} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <PriceGuideSection serviceType={serviceType} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <DateAddressSection
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        address={address}
        onAddressChange={setAddress}
      />

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

      <AirconBottomBar onConsultClick={() => setIsFormOpen(true)} serviceType={serviceType} airconType={airconType} />

      <AirconConsultationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        serviceType={serviceType}
        airconType={airconType}
        date={selectedDate}
        address={address}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { openPostcode } from "@/lib/daum-postcode";
import {
  X,
  Phone,
  User,
  CalendarDays,
  MapPin,
  MessageSquare,
  Loader2,
  CheckCircle,
  Sparkles,
  Shield,
  Clock,
  Star,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────

type CleanType = "movein" | "moving" | "regular" | "partial";

const CLEAN_TYPES: { key: CleanType; label: string; desc: string }[] = [
  { key: "movein", label: "입주청소", desc: "새 집 입주 전 전체 청소" },
  { key: "moving", label: "이사청소", desc: "이사 후 기존 거주지 청소" },
  { key: "regular", label: "거주청소", desc: "생활공간 정기 청소" },
  { key: "partial", label: "부분청소", desc: "주방·화장실 부분 청소" },
];

const CLEAN_TYPE_DESCRIPTIONS: Record<CleanType, string> = {
  movein: "입주 전 새 집을 처음부터 끝까지 꼼꼼하게 청소합니다. 화장실·주방·베란다 포함 전체 청소로 완벽하게 준비해 드립니다.",
  moving: "이사 후 비워진 기존 거주지를 깨끗하게 청소합니다. 보증금 반환에 유리하도록 원상복구 수준으로 청소해 드립니다.",
  regular: "생활하는 공간을 정기적으로 청소해 드립니다. 바닥·욕실·주방 청소 등 쾌적한 생활환경을 유지합니다.",
  partial: "주방·화장실·베란다 등 특정 공간만 집중적으로 청소합니다. 필요한 부분만 선택해 합리적인 가격으로 이용하세요.",
};

const SIZE_OPTIONS = [
  "10평 이하",
  "11~15평",
  "16~20평",
  "21~25평",
  "26~30평",
  "31~40평",
  "41~50평",
  "51평 이상",
];

const ROOM_OPTIONS = ["원룸/1K", "1.5룸", "2룸", "3룸", "4룸 이상"];
const BATHROOM_OPTIONS = ["1개", "2개", "3개 이상"];

// 가격표 (단위: 원)
const PRICE_TABLE: Record<CleanType, number[]> = {
  movein:  [120000, 160000, 200000, 250000, 300000, 380000, 450000, 0],
  moving:  [100000, 130000, 160000, 200000, 240000, 300000, 360000, 0],
  regular: [70000,  90000,  110000, 140000, 170000, 210000, 260000, 0],
  partial: [50000,  65000,   80000, 100000, 120000, 150000, 180000, 0],
};

function getEstimatedPrice(type: CleanType, sizeIdx: number | null): number | null {
  if (sizeIdx === null) return null;
  return PRICE_TABLE[type][sizeIdx] || null;
}

// ─────────────────────────────────────────────
// Hero Section
// ─────────────────────────────────────────────

function CleanHeroSection() {
  return (
    <section className="max-w-[640px] mx-auto px-5 pt-8 pb-6">
      <p className="text-[13px] font-semibold text-primary mb-2">
        입주청소 · 이사청소 · 거주청소 · 부분청소
      </p>
      <h1 className="text-[24px] font-bold text-foreground leading-snug mb-2">
        새 집처럼 깨끗하게,<br />
        <span className="text-primary">다이사 청소 서비스</span>
      </h1>
      <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
        경력 3년 이상 전문 청소팀이 직접 방문합니다.<br />
        유형과 평수를 선택하면 예상 견적을 바로 확인하세요.
      </p>

      {/* Trust badges */}
      <div className="flex gap-2 flex-wrap">
        {["누적 청소 12,000건+", "당일 예약 가능", "만족 보장"].map((badge) => (
          <span
            key={badge}
            className="text-[12px] font-medium text-primary bg-secondary px-3 py-1 rounded-full"
          >
            {badge}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Clean Type Selector (4 types, 2×2 grid)
// ─────────────────────────────────────────────

function CleanTypeSelector({
  selected,
  onChange,
}: {
  selected: CleanType;
  onChange: (t: CleanType) => void;
}) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pt-4 pb-4">
      <h2 className="text-[16px] font-bold text-foreground mb-3">청소 유형 선택</h2>
      <div className="grid grid-cols-2 gap-2">
        {CLEAN_TYPES.map((t) => {
          const isActive = selected === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={[
                "py-3.5 px-4 rounded-xl border-2 text-left transition-all",
                isActive
                  ? "border-primary bg-secondary"
                  : "border-border bg-card hover:border-primary/40",
              ].join(" ")}
            >
              <span
                className={[
                  "block text-[15px] font-bold mb-0.5",
                  isActive ? "text-primary" : "text-foreground",
                ].join(" ")}
              >
                {t.label}
              </span>
              <span className="block text-[12px] text-text-secondary">{t.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <div className="mt-3 px-4 py-3 bg-muted rounded-xl">
        <p className="text-[13px] text-text-secondary leading-relaxed">
          {CLEAN_TYPE_DESCRIPTIONS[selected]}
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Size, Room & Bathroom Selector
// ─────────────────────────────────────────────

function SizeRoomSelector({
  selectedSize,
  onSizeChange,
  selectedRoom,
  onRoomChange,
  selectedBathroom,
  onBathroomChange,
}: {
  selectedSize: number | null;
  onSizeChange: (i: number) => void;
  selectedRoom: number | null;
  onRoomChange: (i: number) => void;
  selectedBathroom: number | null;
  onBathroomChange: (i: number) => void;
}) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-4">
      <h2 className="text-[16px] font-bold text-foreground mb-3">평수 / 방·화장실 수</h2>

      {/* 평수 */}
      <div className="mb-4">
        <p className="text-[13px] text-text-secondary mb-2">평수를 선택해 주세요</p>
        <div className="grid grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((s, i) => (
            <button
              key={s}
              onClick={() => onSizeChange(i)}
              className={[
                "py-3 rounded-xl border-2 text-[12px] font-medium transition-all text-center leading-tight",
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

      {/* 방 수 */}
      <div className="mb-4">
        <p className="text-[13px] text-text-secondary mb-2">방 수를 선택해 주세요</p>
        <div className="grid grid-cols-5 gap-2">
          {ROOM_OPTIONS.map((r, i) => (
            <button
              key={r}
              onClick={() => onRoomChange(i)}
              className={[
                "py-3 rounded-xl border-2 text-[11px] font-medium transition-all text-center leading-tight",
                selectedRoom === i
                  ? "border-primary bg-secondary text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40",
              ].join(" ")}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 화장실 수 */}
      <div>
        <p className="text-[13px] text-text-secondary mb-2">화장실 수를 선택해 주세요</p>
        <div className="grid grid-cols-3 gap-2">
          {BATHROOM_OPTIONS.map((b, i) => (
            <button
              key={b}
              onClick={() => onBathroomChange(i)}
              className={[
                "py-3 rounded-xl border-2 text-[13px] font-medium transition-all text-center",
                selectedBathroom === i
                  ? "border-primary bg-secondary text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40",
              ].join(" ")}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Date Selector
// ─────────────────────────────────────────────

function DateSelector({
  selectedDate,
  onChange,
}: {
  selectedDate: string;
  onChange: (d: string) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">희망 날짜</h2>
      <div className="relative">
        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-4 bg-card border-2 border-border rounded-xl text-[15px] text-foreground focus:outline-none focus:border-primary transition-all"
        />
      </div>
      {selectedDate && (
        <p className="text-[13px] text-text-secondary mt-2 ml-1">
          선택하신 날짜:{" "}
          <span className="font-semibold text-primary">
            {selectedDate.replace(/-/g, ".")}
          </span>
        </p>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// Address Section (카카오 주소 검색)
// ─────────────────────────────────────────────

function AddressSection({
  address,
  addressDetail,
  onAddressChange,
  onAddressDetailChange,
}: {
  address: string;
  addressDetail: string;
  onAddressChange: (v: string) => void;
  onAddressDetailChange: (v: string) => void;
}) {
  const inputBase =
    "w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition-all";

  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">청소 주소</h2>
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-[12px] font-semibold text-primary mb-2 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> 주소 입력
        </p>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={address}
            readOnly
            onClick={() => openPostcode(onAddressChange)}
            placeholder="주소 검색을 눌러주세요"
            className={`${inputBase} flex-1 cursor-pointer`}
          />
          <button
            type="button"
            onClick={() => openPostcode(onAddressChange)}
            className="px-4 py-2.5 bg-primary text-primary-foreground text-[13px] font-semibold rounded-lg hover:opacity-90 active:scale-[0.97] transition-all shrink-0"
          >
            주소 검색
          </button>
        </div>
        <input
          type="text"
          value={addressDetail}
          onChange={(e) => onAddressDetailChange(e.target.value)}
          placeholder="상세 주소 (동/호수)"
          className={inputBase}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Price Estimate Box
// ─────────────────────────────────────────────

function PriceEstimateBox({
  cleanType,
  sizeIdx,
}: {
  cleanType: CleanType;
  sizeIdx: number | null;
}) {
  const price = getEstimatedPrice(cleanType, sizeIdx);
  const typeName = CLEAN_TYPES.find((t) => t.key === cleanType)?.label ?? "";

  if (sizeIdx === null) {
    return (
      <section className="max-w-[640px] mx-auto px-5 pb-6">
        <div className="bg-secondary rounded-xl px-5 py-5 text-center border border-primary/10">
          <p className="text-[14px] text-text-secondary">
            평수를 선택하면 예상 견적을 안내해 드려요
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <div className="bg-secondary rounded-xl px-5 py-4 border border-primary/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[13px] text-text-secondary">
            {typeName} · {SIZE_OPTIONS[sizeIdx]}
          </span>
          <span className="text-[11px] text-text-muted">VAT 포함</span>
        </div>
        {price ? (
          <div className="flex items-end gap-1.5 mt-2">
            <span className="text-[12px] text-text-muted">예상 견적</span>
            <span className="text-[28px] font-extrabold text-primary leading-none">
              {price.toLocaleString()}
            </span>
            <span className="text-[15px] font-semibold text-foreground mb-0.5">원~</span>
          </div>
        ) : (
          <p className="text-[20px] font-bold text-primary mt-2">견적 문의 (51평 이상)</p>
        )}
        <p className="text-[11px] text-text-muted mt-2">
          * 실제 요금은 오염도·청소 범위에 따라 달라질 수 있으며, 현장 확인 후 최종 안내드립니다.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Price Guide Table
// ─────────────────────────────────────────────

function PriceGuideSection({ cleanType }: { cleanType: CleanType }) {
  const prices = PRICE_TABLE[cleanType];
  const typeName = CLEAN_TYPES.find((t) => t.key === cleanType)?.label ?? "";

  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">가격 안내</h2>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <p className="text-[13px] font-semibold text-text-secondary">
            {typeName} 기준 요금표 (VAT 포함)
          </p>
        </div>
        {SIZE_OPTIONS.map((size, i) => (
          <div
            key={size}
            className="flex items-center justify-between px-4 py-3.5 border-b border-border-subtle last:border-b-0"
          >
            <span className="text-[14px] text-foreground">{size}</span>
            <span className="text-[14px] font-semibold text-foreground">
              {prices[i] === 0 ? "협의" : `${prices[i].toLocaleString()}원~`}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-text-muted mt-2 ml-1">
        * 오염도, 청소 범위에 따라 요금이 달라질 수 있습니다.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────
// Benefits
// ─────────────────────────────────────────────

function BenefitsSection() {
  const items = [
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "전문 청소팀 파견",
      desc: "경력 3년 이상의 검증된 전문가가 직접 방문합니다.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      title: "친환경 세제 사용",
      desc: "인체에 무해한 친환경 세제로 안전하게 청소합니다.",
    },
    {
      icon: <Clock className="w-5 h-5 text-primary" />,
      title: "당일 예약 가능",
      desc: "오전 접수 시 당일 청소 서비스를 제공합니다.",
    },
    {
      icon: <Star className="w-5 h-5 text-primary" />,
      title: "만족 보장",
      desc: "청소 후 불만족 시 재청소 서비스를 제공합니다.",
    },
  ];
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-3">
        다이사 청소 서비스 혜택
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="mb-2">{item.icon}</div>
            <p className="text-[14px] font-semibold text-foreground mb-1">
              {item.title}
            </p>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────

function ReviewsSection() {
  const reviews = [
    {
      name: "박*영",
      score: 5,
      date: "2026.03.15",
      type: "입주청소",
      body: "32평 아파트 입주청소 맡겼는데 정말 깔끔하게 해주셨어요. 화장실 물때도 싹 제거해주셔서 너무 만족합니다!",
    },
    {
      name: "이*준",
      score: 5,
      date: "2026.03.08",
      type: "이사청소",
      body: "이사하고 남은 짐 정리도 해주시고 꼼꼼하게 청소해주셨습니다. 덕분에 깨끗하게 나올 수 있었어요.",
    },
    {
      name: "김*정",
      score: 4,
      date: "2026.02.25",
      type: "거주청소",
      body: "정기 청소 서비스 이용 중인데 매번 친절하고 꼼꼼해서 만족합니다. 주방 기름때도 잘 처리해주세요.",
    },
  ];

  return (
    <section className="max-w-[640px] mx-auto px-5 pb-8">
      <h2 className="text-[16px] font-bold text-foreground mb-3">고객 후기</h2>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.name + r.date}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-foreground">
                  {r.name}
                </span>
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
                  className={`w-3.5 h-3.5 ${
                    i < r.score
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {r.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Bottom Bar
// ─────────────────────────────────────────────

function CleanBottomBar({
  onConsultClick,
  price,
}: {
  onConsultClick: () => void;
  price: number | null | "inquiry";
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bottom-bar-bg safe-bottom">
      <div className="max-w-[640px] mx-auto px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] text-bottom-bar-text/70">예상 견적</span>
          {price === null ? (
            <span className="text-[15px] font-semibold text-bottom-bar-text/60">
              평수를 선택해 주세요
            </span>
          ) : price === "inquiry" ? (
            <span className="text-[20px] font-extrabold text-bottom-bar-text">
              견적 문의
            </span>
          ) : (
            <span className="text-[20px] font-extrabold text-bottom-bar-text">
              {price.toLocaleString()}원 ~
            </span>
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
// Consultation Form Modal
// ─────────────────────────────────────────────

function CleanConsultationForm({
  isOpen,
  onClose,
  cleanType,
  size,
  room,
  bathroom,
  date,
  address,
}: {
  isOpen: boolean;
  onClose: () => void;
  cleanType: CleanType;
  size: string | null;
  room: string | null;
  bathroom: string | null;
  date: string;
  address: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const typeName = CLEAN_TYPES.find((t) => t.key === cleanType)?.label ?? "";

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
    try {
      await fetch("/api/clean-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          cleanType,
          size,
          room,
          bathroom,
          date,
          address: address || undefined,
          memo: memo.trim() || undefined,
        }),
      });
    } catch {
      // MVP: show success regardless
    }
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setName("");
      setPhone("");
      setMemo("");
    }, 2000);
  };

  if (!isOpen) return null;

  const inputCls =
    "w-full px-4 py-3.5 bg-card border-2 border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card w-full max-w-[480px] rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-lg font-bold text-foreground">무료 상담 신청</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Selected info summary */}
        <div className="mx-5 mb-4 bg-secondary rounded-xl px-4 py-3 border border-primary/10">
          <p className="text-[13px] font-semibold text-primary mb-1">{typeName}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-text-secondary">
            {size && <span>· {size}</span>}
            {room && <span>· {room}</span>}
            {bathroom && <span>· 화장실 {bathroom}</span>}
            {date && <span>· 희망일 {date.replace(/-/g, ".")}</span>}
            {address && <span>· {address.slice(0, 20)}{address.length > 20 ? "..." : ""}</span>}
          </div>
        </div>

        {isSuccess ? (
          <div className="px-5 py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-bold text-foreground">신청이 완료되었습니다!</p>
            <p className="text-sm text-text-muted mt-2">
              전문 상담사가 곧 연락드릴 예정입니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 pb-8">
            <label className="block mb-4">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <User className="w-4 h-4 text-muted-foreground" />
                이름 <span className="text-accent">*</span>
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                required
                className={inputCls}
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <Phone className="w-4 h-4 text-muted-foreground" />
                연락처 <span className="text-accent">*</span>
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="010-1234-5678"
                required
                className={inputCls}
              />
            </label>

            <label className="block mb-6">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                요청사항
              </span>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="특이사항이 있으면 알려주세요 (예: 베란다 포함, 냉장고 이동 필요 등)"
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !phone.trim()}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  신청 중...
                </>
              ) : (
                "무료 상담 신청하기"
              )}
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
// Main Page
// ─────────────────────────────────────────────

export default function CleanPage() {
  const [cleanType, setCleanType] = useState<CleanType>("movein");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedBathroom, setSelectedBathroom] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const estimatedPrice = getEstimatedPrice(cleanType, selectedSize);
  const bottomPrice: number | null | "inquiry" =
    selectedSize === null
      ? null
      : estimatedPrice === 0
      ? "inquiry"
      : estimatedPrice;

  const handleTypeChange = (t: CleanType) => {
    setCleanType(t);
    setSelectedSize(null);
  };

  const fullAddress = addressDetail ? `${address} ${addressDetail}`.trim() : address;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <CleanHeroSection />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <CleanTypeSelector selected={cleanType} onChange={handleTypeChange} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <SizeRoomSelector
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        selectedRoom={selectedRoom}
        onRoomChange={setSelectedRoom}
        selectedBathroom={selectedBathroom}
        onBathroomChange={setSelectedBathroom}
      />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <DateSelector selectedDate={selectedDate} onChange={setSelectedDate} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <AddressSection
        address={address}
        addressDetail={addressDetail}
        onAddressChange={setAddress}
        onAddressDetailChange={setAddressDetail}
      />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <PriceEstimateBox cleanType={cleanType} sizeIdx={selectedSize} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <PriceGuideSection cleanType={cleanType} />

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

      <CleanBottomBar
        onConsultClick={() => setIsFormOpen(true)}
        price={bottomPrice}
      />

      <CleanConsultationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        cleanType={cleanType}
        size={selectedSize !== null ? SIZE_OPTIONS[selectedSize] : null}
        room={selectedRoom !== null ? ROOM_OPTIONS[selectedRoom] : null}
        bathroom={selectedBathroom !== null ? BATHROOM_OPTIONS[selectedBathroom] : null}
        date={selectedDate}
        address={fullAddress}
      />
    </div>
  );
}

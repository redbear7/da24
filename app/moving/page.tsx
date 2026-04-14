"use client";

import { useState } from "react";
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
  Star,
  Shield,
  Clock,
  Award,
  ChevronLeft,
  Info,
  Package,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { openPostcode } from "@/lib/daum-postcode";
import UpsellModal, { UpsellBanner } from "@/components/UpsellModal";

// ─────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────

type MoveType = "household" | "small" | "office";

const MOVE_TYPES: { key: MoveType; label: string; desc: string; sub: string; icon: React.ElementType }[] = [
  { key: "household", label: "가정이사", desc: "3룸, 15평대 이상", sub: "아파트 · 빌라 · 주택", icon: Truck },
  { key: "small", label: "소형이사", desc: "15평대 미만", sub: "원룸 · 투룸 · 오피스텔", icon: Home },
  { key: "office", label: "사무실이사", desc: "1톤 초과 짐량", sub: "빌딩 · 공장 · 상가 등", icon: Building2 },
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
// Household Move Modal (5-step flow)
// ─────────────────────────────────────────────

interface AddressData {
  address: string;
  floor: number | null;
  elevator: boolean | null;
}

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center py-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={[
            "h-1.5 rounded-full transition-all duration-300",
            i < current ? "bg-primary w-5" : i === current ? "bg-primary w-8" : "bg-border w-5",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function StorageTooltip({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  if (!visible) return null;
  return (
    <div className="absolute z-10 bottom-full left-0 mb-2 w-72 bg-foreground text-background text-[12px] leading-relaxed rounded-xl p-3 shadow-lg">
      <button onClick={onClose} className="float-right ml-2 opacity-60 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
      <p className="font-semibold mb-1">보관이사란?</p>
      <p>
        이사 날짜가 맞지 않을 때, 이삿짐을 창고에 일정 기간 보관한 후 새 집으로 옮겨드리는 서비스입니다.
        입주일 조율이 어렵거나 임시 거주 중일 때 유용합니다.
      </p>
      <div className="absolute bottom-[-6px] left-5 w-3 h-3 bg-foreground rotate-45" />
    </div>
  );
}

function HouseholdMoveModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const TOTAL_STEPS = 4; // steps 1–4 (excluding intro step 0)
  const [step, setStep] = useState(0);

  const [fromData, setFromData] = useState<AddressData>({ address: "", floor: null, elevator: null });
  const [fromSize, setFromSize] = useState<number | null>(null);
  const [toData, setToData] = useState<AddressData>({ address: "", floor: null, elevator: null });
  const [moveDate, setMoveDate] = useState("");
  const [isStorageMove, setIsStorageMove] = useState(false);
  const [showStorageTooltip, setShowStorageTooltip] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDateBanner, setShowDateBanner] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleClose = () => {
    setStep(0);
    setFromData({ address: "", floor: null, elevator: null });
    setFromSize(null);
    setToData({ address: "", floor: null, elevator: null });
    setMoveDate("");
    setIsStorageMove(false);
    setName(""); setPhone(""); setMemo("");
    setIsSuccess(false);
    setShowUpsell(false);
    setShowDateBanner(false);
    onClose();
  };

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
      setShowUpsell(true);
    }, 1500);
    setTimeout(() => {
      handleClose();
    }, 8000);
  };

  if (!isOpen) return null;

  const inputCls =
    "w-full px-4 py-3 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  const chipCls = (active: boolean) =>
    [
      "py-2.5 rounded-xl border text-[13px] font-medium transition-all",
      active
        ? "border-primary bg-secondary text-primary"
        : "border-border bg-card text-foreground hover:border-primary/40",
    ].join(" ");

  function AddressStep({
    label,
    color,
    data,
    onDataChange,
    withSize,
    size,
    onSizeChange,
  }: {
    label: string;
    color: string;
    data: AddressData;
    onDataChange: (d: AddressData) => void;
    withSize?: boolean;
    size?: number | null;
    onSizeChange?: (i: number) => void;
  }) {
    return (
      <div className="space-y-5">
        {/* 주소 */}
        <div>
          <p className={`text-[12px] font-semibold mb-2 flex items-center gap-1 ${color}`}>
            <MapPin className="w-3.5 h-3.5" /> {label}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.address}
              readOnly
              onClick={() => openPostcode((v) => onDataChange({ ...data, address: v }))}
              placeholder="주소 검색을 눌러주세요"
              className={`${inputCls} flex-1 cursor-pointer`}
            />
            <button
              type="button"
              onClick={() => openPostcode((v) => onDataChange({ ...data, address: v }))}
              className="px-4 py-3 bg-primary text-primary-foreground text-[13px] font-semibold rounded-xl hover:opacity-90 active:scale-[0.97] transition-all shrink-0"
            >
              검색
            </button>
          </div>
        </div>

        {/* 평수 (출발지만) */}
        {withSize && (
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-2">평수를 선택해 주세요</p>
            <div className="grid grid-cols-4 gap-2">
              {SIZE_OPTIONS.map((s, i) => (
                <button key={s} onClick={() => onSizeChange?.(i)} className={chipCls(size === i)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 층수 */}
        <div>
          <p className="text-[13px] font-semibold text-foreground mb-2">층수를 선택해 주세요</p>
          <div className="grid grid-cols-5 gap-2">
            {FLOOR_OPTIONS.map((f, i) => (
              <button
                key={f}
                onClick={() => onDataChange({ ...data, floor: i })}
                className={chipCls(data.floor === i)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 엘리베이터 */}
        <div>
          <p className="text-[13px] font-semibold text-foreground mb-2">엘리베이터가 있나요?</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: true, label: "있음" },
              { val: false, label: "없음" },
            ].map(({ val, label }) => (
              <button
                key={String(val)}
                onClick={() => onDataChange({ ...data, elevator: val })}
                className={chipCls(data.elevator === val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-card w-full max-w-[480px] rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 shrink-0">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <h2 className="text-[17px] font-bold text-foreground">
              {step === 0 && "가정이사 안내"}
              {step === 1 && "출발지 정보"}
              {step === 2 && "도착지 정보"}
              {step === 3 && "이사 날짜 / 옵션"}
              {step === 4 && "추천업체 신청"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {step > 0 && <StepProgress current={step - 1} total={TOTAL_STEPS} />}

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 pb-6">
          {/* ── Step 0: 안내 ── */}
          {step === 0 && (
            <div className="py-4">
              <div className="bg-secondary rounded-2xl p-5 mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-foreground">가정이사 견적 신청</p>
                    <p className="text-[13px] text-text-secondary">3룸 · 15평 이상 · 아파트/빌라/주택</p>
                  </div>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  아래 정보를 순서대로 입력하시면 검증된 이사업체의 무료 견적을 받아보실 수 있습니다.
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  { step: "1단계", text: "출발지 주소 · 층수 · 엘리베이터", icon: MapPin },
                  { step: "2단계", text: "도착지 주소 · 층수 · 엘리베이터", icon: MapPin },
                  { step: "3단계", text: "이사 날짜 · 보관이사 여부", icon: CalendarDays },
                  { step: "4단계", text: "이름 · 연락처 입력", icon: User },
                ].map(({ step: s, text, icon: Icon }) => (
                  <li key={s} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-[12px] text-primary font-semibold">{s}</span>
                      <p className="text-[13px] text-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setStep(1)}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all"
              >
                시작하기
              </button>
            </div>
          )}

          {/* ── Step 1: 출발지 ── */}
          {step === 1 && (
            <div className="py-2">
              <AddressStep
                label="출발지"
                color="text-primary"
                data={fromData}
                onDataChange={setFromData}
                withSize
                size={fromSize}
                onSizeChange={setFromSize}
              />
              <button
                onClick={() => setStep(2)}
                disabled={!fromData.address || fromData.floor === null || fromData.elevator === null || fromSize === null}
                className="w-full mt-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}

          {/* ── Step 2: 도착지 ── */}
          {step === 2 && (
            <div className="py-2">
              <AddressStep
                label="도착지"
                color="text-accent"
                data={toData}
                onDataChange={setToData}
              />
              <button
                onClick={() => setStep(3)}
                disabled={!toData.address || toData.floor === null || toData.elevator === null}
                className="w-full mt-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}

          {/* ── Step 3: 이사 날짜 + 보관이사 ── */}
          {step === 3 && (
            <div className="py-2 space-y-5">
              {/* 이사 날짜 */}
              <div>
                <p className="text-[14px] font-semibold text-foreground mb-2">이사 희망일을 선택해 주세요</p>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={moveDate}
                    min={today}
                    onChange={(e) => { setMoveDate(e.target.value); if (e.target.value) setShowDateBanner(true); }}
                    className="w-full pl-10 pr-4 py-3.5 bg-card border border-border rounded-xl text-[15px] text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                {moveDate && (
                  <p className="text-[13px] text-text-secondary mt-2 ml-1">
                    선택일:{" "}
                    <span className="font-semibold text-primary">{moveDate.replace(/-/g, ".")}</span>
                  </p>
                )}
              </div>

              {/* 보관이사 옵션 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[14px] font-semibold text-foreground">보관이사가 필요하신가요?</p>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowStorageTooltip((v) => !v)}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-muted hover:bg-border transition-all"
                    >
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <StorageTooltip
                      visible={showStorageTooltip}
                      onClose={() => setShowStorageTooltip(false)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: false, label: "필요 없음", desc: "바로 새 집으로 이동" },
                    { val: true, label: "필요함", desc: "짐을 창고에 보관 후 이동" },
                  ].map(({ val, label, desc }) => (
                    <button
                      key={String(val)}
                      onClick={() => setIsStorageMove(val)}
                      className={[
                        "flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all",
                        isStorageMove === val
                          ? "border-primary bg-secondary/60"
                          : "border-border bg-card hover:border-primary/30",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Package className={`w-4 h-4 ${isStorageMove === val ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-[14px] font-semibold ${isStorageMove === val ? "text-primary" : "text-foreground"}`}>
                          {label}
                        </span>
                      </div>
                      <p className="text-[12px] text-text-muted">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                disabled={!moveDate}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          )}

          {/* ── Step 4: 추천업체 신청 ── */}
          {step === 4 && (
            <div className="py-2">
              {isSuccess ? (
                <div className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-[18px] font-bold text-foreground">신청이 완료되었습니다!</p>
                  <p className="text-[14px] text-text-muted mt-2">전문 상담사가 곧 연락드릴 예정입니다.</p>
                </div>
              ) : (
                <>
                  {/* 요약 */}
                  <div className="bg-secondary rounded-xl px-4 py-3 mb-5">
                    <p className="text-[12px] font-semibold text-primary mb-1.5">신청 정보 요약</p>
                    <div className="space-y-0.5 text-[12px] text-text-secondary">
                      {fromData.address && (
                        <p>· 출발 {fromData.address.slice(0, 20)}{fromData.address.length > 20 ? "..." : ""} ({FLOOR_OPTIONS[fromData.floor!]}{fromData.elevator ? " · 엘리베이터 있음" : " · 엘리베이터 없음"})</p>
                      )}
                      {toData.address && (
                        <p>· 도착 {toData.address.slice(0, 20)}{toData.address.length > 20 ? "..." : ""} ({FLOOR_OPTIONS[toData.floor!]}{toData.elevator ? " · 엘리베이터 있음" : " · 엘리베이터 없음"})</p>
                      )}
                      {fromSize !== null && <p>· 평수 {SIZE_OPTIONS[fromSize]}</p>}
                      {moveDate && <p>· 희망일 {moveDate.replace(/-/g, ".")}</p>}
                      {isStorageMove && <p>· 보관이사 포함</p>}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                      <span className="text-[14px] font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
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

                    <label className="block">
                      <span className="text-[14px] font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
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

                    <label className="block">
                      <span className="text-[14px] font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        요청사항
                      </span>
                      <textarea
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="특이사항이 있으면 알려주세요"
                        rows={3}
                        className={`${inputCls} resize-none`}
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting || !name.trim() || !phone.trim()}
                      className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "추천업체 신청하기"}
                    </button>
                    <p className="text-[11px] text-text-muted text-center">
                      신청 시 개인정보 수집·이용에 동의한 것으로 간주됩니다.
                    </p>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* 이사 날짜 선택 시 번들 배너 */}
    <UpsellBanner
      type="moving-date-bundle"
      isOpen={showDateBanner && step === 3}
      onClose={() => setShowDateBanner(false)}
    />

    {/* 견적 신청 완료 후 청소 업셀 모달 */}
    <UpsellModal
      type="moving-to-clean"
      isOpen={showUpsell}
      onClose={() => { setShowUpsell(false); handleClose(); }}
    />
    </>
  );
}

// ─────────────────────────────────────────────
// Simple Consultation Form Modal (소형/사무실)
// ─────────────────────────────────────────────

function MoveConsultationForm({
  isOpen,
  onClose,
  moveType,
}: {
  isOpen: boolean;
  onClose: () => void;
  moveType: MoveType;
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
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="mx-5 mb-4 bg-secondary rounded-xl px-4 py-3">
          <p className="text-[13px] font-semibold text-primary">{typeName} 무료 견적</p>
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
// Page Sections
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

function MoveHeroSection() {
  return (
    <section className="max-w-[640px] mx-auto px-5 pt-6 pb-5">
      <p className="text-[13px] font-semibold text-primary mb-2">가정이사 · 소형이사 · 사무실이사</p>
      <h1 className="text-[24px] font-bold text-foreground leading-snug mb-2">
        이사업체 비교는<br />
        <span className="text-primary">다이사에서 한번에</span>
      </h1>
      <p className="text-[14px] text-text-secondary leading-relaxed">
        780만 고객이 선택한 이사 비교 플랫폼. 유형을 선택하면 검증된 업체의 견적을 한눈에 비교할 수 있어요.
      </p>
    </section>
  );
}

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
// Main Page
// ─────────────────────────────────────────────

export default function MovingPage() {
  const [moveType, setMoveType] = useState<MoveType>("household");
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [isSimpleFormOpen, setIsSimpleFormOpen] = useState(false);

  const handleCtaClick = () => {
    if (moveType === "household") {
      setIsHouseholdModalOpen(true);
    } else {
      setIsSimpleFormOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MoveHeroSection />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <MoveTypeSelector selected={moveType} onChange={setMoveType} />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-6" />

      <BenefitsSection />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <ReviewsSection />

      <Footer />

      <MoveBottomBar onConsultClick={handleCtaClick} />

      {/* 가정이사 5-step modal */}
      <HouseholdMoveModal
        isOpen={isHouseholdModalOpen}
        onClose={() => setIsHouseholdModalOpen(false)}
      />

      {/* 소형/사무실이사 simple modal */}
      <MoveConsultationForm
        isOpen={isSimpleFormOpen}
        onClose={() => setIsSimpleFormOpen(false)}
        moveType={moveType}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Package, Sparkles, Wifi, AirVent, ChevronRight, Check } from "lucide-react";
import { BUNDLES, BundleInfo, BundleType } from "./BundleBanner";

type Step = "select" | "form" | "done";

interface FormData {
  name: string;
  phone: string;
  from: string;
  to: string;
  date: string;
  area: string;
}

const AREA_OPTS = ["10평 미만", "10~15평", "15~20평", "20~25평", "25~30평", "30평 이상"];

interface BundleModalProps {
  initialBundle?: BundleInfo;
  onClose: () => void;
}

export default function BundleModal({ initialBundle, onClose }: BundleModalProps) {
  const [step, setStep] = useState<Step>(initialBundle ? "form" : "select");
  const [selectedBundle, setSelectedBundle] = useState<BundleInfo | null>(initialBundle ?? null);
  const [form, setForm] = useState<FormData>({ name: "", phone: "", from: "", to: "", date: "", area: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSelectBundle = (bundle: BundleInfo) => {
    setSelectedBundle(bundle);
    setStep("form");
  };

  const handleSubmit = async () => {
    if (!selectedBundle) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageType: selectedBundle.type,
          name: form.name,
          phone: form.phone,
          fromAddress: form.from,
          toAddress: form.to,
          moveDate: form.date,
          size: form.area,
        }),
      });
    } catch {}
    setIsSubmitting(false);
    setStep("done");
  };

  const isFormValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.from.trim() &&
    form.to.trim() &&
    form.date &&
    form.area;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[480px] rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* 핸들바 */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-[18px] font-bold text-foreground">
            {step === "select" && "패키지 선택"}
            {step === "form" && "기본 정보 입력"}
            {step === "done" && "신청 완료"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 pb-8">

          {/* ─── Step 1: 패키지 선택 ─── */}
          {step === "select" && (
            <div className="space-y-3 mt-1">
              {BUNDLES.map((bundle) => (
                <button
                  key={bundle.type}
                  onClick={() => handleSelectBundle(bundle)}
                  className="w-full text-left border-2 border-border rounded-2xl p-4 hover:border-primary/40 transition-all active:scale-[0.98] relative"
                >
                  {bundle.badge && (
                    <span className="absolute -top-2.5 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white">
                      {bundle.badge}
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[12px] font-semibold text-primary mb-0.5">{bundle.title}</p>
                      <p className="text-[16px] font-bold text-foreground">{bundle.subtitle}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted mt-1" />
                  </div>

                  {/* 서비스 아이콘 */}
                  <div className="flex items-center gap-2 mt-3 mb-2">
                    {bundle.services.map((svc, i) => (
                      <div key={svc.label} className="flex items-center gap-1">
                        {i > 0 && <span className="text-[11px] text-text-muted">+</span>}
                        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                          <svc.icon className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[12px] text-foreground font-medium">{svc.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[12px] font-semibold px-2.5 py-1 rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                    {bundle.discount}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ─── Step 2: 기본 정보 입력 ─── */}
          {step === "form" && selectedBundle && (
            <>
              {/* 선택된 패키지 요약 */}
              <div className="bg-muted rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-primary">{selectedBundle.title}</p>
                  <p className="text-[14px] font-bold text-foreground">{selectedBundle.subtitle}</p>
                </div>
                <button
                  onClick={() => setStep("select")}
                  className="text-[12px] text-text-muted underline underline-offset-2"
                >
                  변경
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-foreground mb-1 block">이름</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="홍길동"
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-foreground mb-1 block">연락처</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-foreground mb-1 block">출발지</label>
                  <input
                    type="text"
                    value={form.from}
                    onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                    placeholder="현재 주소를 입력하세요"
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-foreground mb-1 block">도착지</label>
                  <input
                    type="text"
                    value={form.to}
                    onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                    placeholder="이사할 주소를 입력하세요"
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-foreground mb-1 block">이사 날짜</label>
                  <input
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-[15px] text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-foreground mb-2 block">평수</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AREA_OPTS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setForm((f) => ({ ...f, area: opt }))}
                        className={`py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                          form.area === opt
                            ? "border-primary bg-secondary text-primary"
                            : "border-border bg-card text-foreground hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setStep("select")}
                  className="px-5 py-4 border border-border rounded-xl text-[16px] font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  이전
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[17px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  {isSubmitting ? "신청 중..." : "패키지 신청하기"}
                </button>
              </div>
            </>
          )}

          {/* ─── Step 3: 완료 ─── */}
          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[28px]">✅</span>
              </div>
              <h3 className="text-[20px] font-bold text-foreground">패키지 신청 완료!</h3>
              <p className="text-[14px] text-text-secondary mt-2 leading-relaxed">
                {selectedBundle?.title} 신청이 접수되었습니다.<br />
                담당자가 곧 연락드릴 예정입니다.
              </p>
              {selectedBundle && (
                <div className="mt-4 bg-muted rounded-xl px-4 py-3 text-left">
                  <p className="text-[12px] font-semibold text-primary mb-0.5">{selectedBundle.title}</p>
                  <p className="text-[14px] font-bold text-foreground">{selectedBundle.subtitle}</p>
                  <p className="text-[13px] text-primary mt-1">{selectedBundle.discount}</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="w-full mt-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

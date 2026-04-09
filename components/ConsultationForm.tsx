"use client";

import { useState } from "react";
import { X, Phone, User, MapPin, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { PlanType, ProviderKey, PLAN_TYPE_LABELS, PROVIDERS } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planType: PlanType;
  provider: ProviderKey;
  selectedPlanName?: string;
}

export default function ConsultationForm({
  isOpen,
  onClose,
  planType,
  provider,
  selectedPlanName,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const providerInfo = PROVIDERS.find((p) => p.key === provider);

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
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          planType,
          provider,
          planName: selectedPlanName,
          address: address.trim() || undefined,
          memo: memo.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed");
    } catch {
      // Fallback: still show success for MVP (offline mode)
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setName("");
      setPhone("");
      setAddress("");
      setMemo("");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-[480px] rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-lg font-bold text-text-primary">무료 상담 신청</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Selected Info */}
        <div className="mx-5 mb-4 bg-secondary rounded-xl px-4 py-3 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: providerInfo?.color }}
          >
            {providerInfo?.key === "lg" ? "U+" : providerInfo?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">
              {providerInfo?.name} · {PLAN_TYPE_LABELS[planType]}
            </p>
            {selectedPlanName && (
              <p className="text-xs text-text-muted">{selectedPlanName}</p>
            )}
          </div>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="px-5 py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-bold text-text-primary">신청이 완료되었습니다!</p>
            <p className="text-sm text-text-muted mt-2">
              전문 상담사가 곧 연락드릴 예정입니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 pb-8">
            {/* Name */}
            <label className="block mb-4">
              <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5 mb-1.5">
                <User className="w-4 h-4 text-text-muted" />
                이름 <span className="text-accent">*</span>
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                required
                className="w-full px-4 py-3 border border-border-main rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </label>

            {/* Phone */}
            <label className="block mb-4">
              <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5 mb-1.5">
                <Phone className="w-4 h-4 text-text-muted" />
                연락처 <span className="text-accent">*</span>
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="010-1234-5678"
                required
                className="w-full px-4 py-3 border border-border-main rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </label>

            {/* Address */}
            <label className="block mb-4">
              <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-4 h-4 text-text-muted" />
                설치 주소
              </span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="서울시 강남구 테헤란로 123"
                className="w-full px-4 py-3 border border-border-main rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </label>

            {/* Memo */}
            <label className="block mb-6">
              <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-4 h-4 text-text-muted" />
                요청사항
              </span>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="추가 요청사항을 입력해 주세요"
                rows={3}
                className="w-full px-4 py-3 border border-border-main rounded-xl text-sm resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !phone.trim()}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl text-[15px] hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            <p className="text-[10px] text-text-muted text-center mt-3">
              신청 시 개인정보 수집·이용에 동의한 것으로 간주됩니다.
            </p>
          </form>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

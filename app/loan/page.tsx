"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LOAN_TYPES, DUMMY_LOANS } from "@/lib/dummy-loans";
import { Landmark, TrendingDown, Percent, ChevronRight, Phone, User, MapPin, Loader2, CheckCircle, X } from "lucide-react";

type LoanType = "mortgage" | "jeonse" | "credit" | "business";

export default function LoanPage() {
  const [loanType, setLoanType] = useState<LoanType>("mortgage");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const filtered = DUMMY_LOANS.filter((l) => l.type === loanType);
  const currentType = LOAN_TYPES.find((t) => t.key === loanType);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* 히어로 */}
      <section className="max-w-[640px] mx-auto px-5 pt-10 pb-6">
        <h1 className="text-[26px] font-bold text-foreground leading-snug">
          대출 금리 비교
        </h1>
        <p className="text-[16px] font-medium text-primary mt-2">
          은행별 최저금리를 한눈에 비교하세요
        </p>
        <p className="text-[14px] text-accent font-medium mt-2">
          *맞춤 상담으로 최적의 대출 상품을 찾아드립니다
        </p>
      </section>

      <div className="max-w-[640px] mx-auto px-5"><hr className="border-border" /></div>

      {/* 대출 유형 선택 */}
      <section className="max-w-[640px] mx-auto px-5 pt-6 pb-4">
        <h2 className="text-[18px] font-bold text-foreground mb-4">대출 유형 선택</h2>
        <div className="grid grid-cols-4 border border-border rounded-xl overflow-hidden">
          {LOAN_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setLoanType(t.key as LoanType)}
              className={`py-3.5 text-center text-[13px] font-semibold border-r last:border-r-0 border-border transition-colors ${
                loanType === t.key
                  ? "bg-card text-primary"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 bg-secondary rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-bold text-foreground">{currentType?.label}</p>
            <p className="text-[13px] text-text-secondary mt-0.5">최저금리부터 비교해 보세요</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-text-muted">최저금리</p>
            <p className="text-[22px] font-extrabold text-primary">{currentType?.minRate}</p>
          </div>
        </div>
      </section>

      {/* 상품 리스트 */}
      <section className="max-w-[640px] mx-auto px-5 pb-6">
        <h2 className="text-[18px] font-bold text-foreground mb-1">금리 비교</h2>
        <p className="text-[13px] text-text-muted mb-4">
          {currentType?.label} 상품을 비교해 보세요
        </p>

        <div className="flex flex-col gap-3">
          {filtered.map((loan) => (
            <button
              key={loan.id}
              onClick={() => { setSelectedBank(loan.bank); setIsFormOpen(true); }}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[12px] text-text-muted">{loan.bank}</p>
                  <h3 className="text-[16px] font-bold text-foreground mt-0.5">{loan.name}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted shrink-0 mt-1" />
              </div>

              <div className="flex items-end gap-4 mb-3">
                <div>
                  <p className="text-[11px] text-text-muted">최저금리</p>
                  <p className="text-[22px] font-extrabold text-primary leading-none">
                    {loan.minRate}%
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-text-muted">최대금리</p>
                  <p className="text-[16px] font-bold text-text-secondary leading-none">
                    {loan.maxRate}%
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[11px] text-text-muted">한도</p>
                  <p className="text-[14px] font-semibold text-foreground">{loan.maxAmount}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {loan.features.map((f, i) => (
                  <span key={i} className="text-[11px] text-text-secondary bg-muted px-2 py-0.5 rounded-md">
                    {f}
                  </span>
                ))}
                <span className="text-[11px] text-text-muted bg-muted px-2 py-0.5 rounded-md">
                  {loan.period}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary safe-bottom">
        <div className="max-w-[640px] mx-auto px-5 py-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full py-4 bg-white text-primary font-bold rounded-xl text-[18px] hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            무료 상담 신청하기
          </button>
        </div>
      </div>

      <div className="pb-32" />
      <Footer />

      {/* 상담 모달 */}
      <LoanConsultModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        loanType={currentType?.label || ""}
        bank={selectedBank}
      />
    </div>
  );
}

/* ─── 대출 상담 모달 ─── */
function LoanConsultModal({
  isOpen, onClose, loanType, bank,
}: {
  isOpen: boolean; onClose: () => void; loanType: string; bank: string | null;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("010-");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const formatPhone = (val: string) => {
    const nums = val.replace(/\D/g, "").slice(0, 11);
    if (nums.length < 3) return "010-";
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const handleSubmit = async () => {
    if (!name.trim() || phone.replace(/\D/g, "").length < 10) return;
    setIsLoading(true);
    try {
      await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), phone, planType: "loan", provider: bank || loanType,
          planName: `${loanType} ${bank || ""}`.trim(),
          memo: `희망 금액: ${amount || "미정"}\n${memo}`.trim(),
        }),
      });
    } catch {}
    setIsLoading(false);
    setIsDone(true);
    setTimeout(() => { setIsDone(false); onClose(); setName(""); setPhone("010-"); setAmount(""); setMemo(""); }, 2000);
  };

  if (!isOpen) return null;

  const inputCls = "w-full px-4 py-3 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[480px] rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-center pt-3 sm:hidden"><div className="w-10 h-1 bg-border rounded-full" /></div>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-lg font-bold text-foreground">대출 상담 신청</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mx-5 mb-4 bg-secondary rounded-xl px-4 py-3">
          <p className="text-sm font-bold text-foreground">{loanType}{bank ? ` · ${bank}` : ""}</p>
        </div>

        {isDone ? (
          <div className="px-5 py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-bold text-foreground">신청이 완료되었습니다!</p>
            <p className="text-sm text-text-muted mt-2">전문 상담사가 곧 연락드립니다.</p>
          </div>
        ) : (
          <div className="px-5 pb-8 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <User className="w-4 h-4 text-muted-foreground" /> 이름 <span className="text-accent">*</span>
              </span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <Phone className="w-4 h-4 text-muted-foreground" /> 연락처 <span className="text-accent">*</span>
              </span>
              <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="010-1234-5678" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                <Landmark className="w-4 h-4 text-muted-foreground" /> 희망 대출 금액
              </span>
              <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="예: 2억원" className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-foreground mb-1.5 block">요청사항</span>
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="추가 요청사항" rows={3} className={`${inputCls} resize-none`} />
            </label>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !name.trim() || phone.replace(/\D/g, "").length < 10}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "무료 상담 신청하기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

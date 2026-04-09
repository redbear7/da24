"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Phone, Loader2, ArrowLeft, RefreshCw, Inbox } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Step = "intro" | "phone" | "code" | "done";

export default function HistoryPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("intro");
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (val: string) => {
    const nums = val.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const handleSendCode = async () => {
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep("code");
  };

  const handleConfirm = async () => {
    if (!code.trim() || code.length < 6) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep("done");
  };

  const handleResend = async () => {
    setCode("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-[400px]">

          {/* 인증 전 */}
          {step === "intro" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-9 h-9 text-primary" />
              </div>
              <h1 className="text-[22px] font-bold text-foreground">
                쉽고, 빠르게 이용하기
              </h1>
              <p className="text-[14px] text-text-secondary mt-3 leading-relaxed">
                최초 1회만 번호 인증을 하시면<br />
                무료 견적 상담 및 내 신청 내역 기능을<br />
                자유롭게 이용하실 수 있어요!
              </p>
              <button
                onClick={() => setStep("phone")}
                className="w-full mt-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all"
              >
                인증하기
              </button>
            </div>
          )}

          {/* 번호 입력 */}
          {step === "phone" && (
            <div>
              <button
                onClick={() => setStep("intro")}
                className="flex items-center gap-1 text-[13px] text-text-secondary mb-6 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                뒤로
              </button>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-[20px] font-bold text-foreground">번호 인증</h1>
                <p className="text-[14px] text-text-secondary mt-2">
                  휴대폰 번호를 입력해 주세요
                </p>
              </div>
              <label className="block mb-4">
                <span className="text-[13px] font-semibold text-foreground mb-1.5 block">
                  휴대폰 번호
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </label>
              <button
                onClick={handleSendCode}
                disabled={isLoading || phone.replace(/\D/g, "").length < 10}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[15px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "인증번호 받기"
                )}
              </button>
            </div>
          )}

          {/* 인증번호 입력 */}
          {step === "code" && (
            <div>
              <button
                onClick={() => { setCode(""); setStep("phone"); }}
                className="flex items-center gap-1 text-[13px] text-text-secondary mb-6 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                뒤로
              </button>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-[20px] font-bold text-foreground">인증번호 입력</h1>
                <p className="text-[14px] text-text-secondary mt-2">
                  <span className="font-semibold text-foreground">{phone}</span>으로<br />
                  발송된 인증번호를 입력해 주세요
                </p>
              </div>
              <label className="block mb-4">
                <span className="text-[13px] font-semibold text-foreground mb-1.5 block">
                  인증번호
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="인증번호 6자리"
                  className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all tracking-widest"
                />
              </label>
              <button
                onClick={handleConfirm}
                disabled={isLoading || code.length < 6}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[15px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "확인"
                )}
              </button>
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-3 text-[13px] text-text-secondary hover:text-foreground transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                인증번호 재발송
              </button>
            </div>
          )}

          {/* 인증 후 - 신청 내역 없음 */}
          {step === "done" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox className="w-9 h-9 text-primary" />
              </div>
              <h1 className="text-[20px] font-bold text-foreground">
                신청 내역이 없습니다
              </h1>
              <p className="text-[14px] text-text-secondary mt-2">
                인터넷 상담을 신청하시면 내역이 표시됩니다.
              </p>
              <Link
                href="/"
                className="inline-block mt-8 px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-[14px] hover:opacity-90 active:scale-[0.98] transition-all"
              >
                인터넷 비교하러 가기
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

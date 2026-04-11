"use client";

import { useState, useEffect } from "react";
import { Shield, Phone, Loader2, MessageCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LS_KEY = "verified_phone";

type Step = "intro" | "phone" | "code" | "done";

export default function ChatPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem(LS_KEY)) {
      setStep("done");
    }
  }, []);

  const formatPhone = (val: string) => {
    const nums = val.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const handleSendCode = async () => {
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "인증번호 발송에 실패했습니다.");
        return;
      }
      setStep("code");
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!code.trim() || code.length < 6) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "인증에 실패했습니다.");
        return;
      }
      localStorage.setItem(LS_KEY, phone.replace(/\D/g, ""));
      setStep("done");
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCode("");
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "재발송에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
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
              <p className="text-[15px] text-text-secondary mt-3 leading-relaxed">
                최초 1회만 번호 인증을 하시면<br />
                무료 견적 상담 및 내 신청 내역 기능을<br />
                자유롭게 이용하실 수 있어요!
              </p>
              <button
                onClick={() => setStep("phone")}
                className="w-full mt-10 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[18px] hover:opacity-90 active:scale-[0.98] transition-all"
              >
                인증하기
              </button>
            </div>
          )}

          {/* 번호 입력 */}
          {step === "phone" && (
            <div>
              <button
                onClick={() => { setError(""); setStep("intro"); }}
                className="flex items-center gap-1 text-[14px] text-text-secondary mb-6 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                뒤로
              </button>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-[20px] font-bold text-foreground">번호 인증</h1>
                <p className="text-[15px] text-text-secondary mt-2">
                  휴대폰 번호를 입력해 주세요
                </p>
              </div>
              <label className="block mb-4">
                <span className="text-[14px] font-semibold text-foreground mb-1.5 block">
                  휴대폰 번호
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(""); }}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-[16px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </label>
              {error && (
                <p className="text-[13px] text-red-500 mb-3">{error}</p>
              )}
              <button
                onClick={handleSendCode}
                disabled={isLoading || phone.replace(/\D/g, "").length < 10}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
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
                onClick={() => { setCode(""); setError(""); setStep("phone"); }}
                className="flex items-center gap-1 text-[14px] text-text-secondary mb-6 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                뒤로
              </button>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-[20px] font-bold text-foreground">인증번호 입력</h1>
                <p className="text-[15px] text-text-secondary mt-2">
                  <span className="font-semibold text-foreground">{phone}</span>으로<br />
                  발송된 인증번호를 입력해 주세요
                </p>
              </div>
              <label className="block mb-4">
                <span className="text-[14px] font-semibold text-foreground mb-1.5 block">
                  인증번호
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                  placeholder="인증번호 6자리"
                  className="w-full px-4 py-3.5 bg-card border border-border rounded-xl text-[16px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all tracking-widest"
                />
              </label>
              {error && (
                <p className="text-[13px] text-red-500 mb-3">{error}</p>
              )}
              <button
                onClick={handleConfirm}
                disabled={isLoading || code.length < 6}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
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
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-3 text-[14px] text-text-secondary hover:text-foreground transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                인증번호 재발송
              </button>
            </div>
          )}

          {/* 인증 후 - 채팅 없음 */}
          {step === "done" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-9 h-9 text-primary" />
              </div>
              <h1 className="text-[20px] font-bold text-foreground">
                채팅 내역이 없습니다
              </h1>
              <p className="text-[15px] text-text-secondary mt-2 leading-relaxed">
                인터넷 상담을 신청하시면<br />
                채팅 내역이 표시됩니다.
              </p>
              <a
                href="/"
                className="block w-full mt-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] text-center hover:opacity-90 active:scale-[0.98] transition-all"
              >
                인터넷 비교하러 가기
              </a>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

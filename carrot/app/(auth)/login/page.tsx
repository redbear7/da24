"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidPhone, normalizePhone } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidPhone(phone)) {
      setError("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    const clean = normalizePhone(phone);
    const res = await fetch("/api/auth/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: clean }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "인증번호 발송에 실패했습니다.");
      return;
    }

    router.push(`/verify?phone=${encodeURIComponent(clean)}`);
  }

  return (
    <main className="min-h-dvh flex flex-col px-6 pt-20">
      <h1 className="text-[24px] font-bold leading-tight">
        안녕하세요!
        <br />
        휴대폰 번호로 로그인해주세요.
      </h1>
      <p className="text-[13px] text-text-muted mt-3">
        번호는 안전하게 보관되며 공개되지 않아요.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3">
        <label className="text-[13px] font-medium">휴대폰 번호</label>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="01012345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-12 px-4 border border-border rounded-lg text-[16px] focus:outline-none focus:border-primary"
          autoFocus
        />
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 h-12 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "발송 중..." : "인증문자 받기"}
        </button>
      </form>
    </main>
  );
}

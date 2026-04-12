"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError("인증번호 6자리를 입력해주세요.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "인증에 실패했습니다.");
      return;
    }

    const { isNew } = await res.json();
    router.push(isNew ? "/neighborhood?onboarding=1" : "/");
  }

  return (
    <main className="min-h-dvh flex flex-col px-6 pt-20">
      <h1 className="text-[24px] font-bold">인증번호를 입력해주세요</h1>
      <p className="text-[13px] text-text-muted mt-3">
        {phone}로 발송된 6자리 숫자를 입력해주세요.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3">
        <input
          type="tel"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="h-12 px-4 border border-border rounded-lg text-[20px] tracking-widest focus:outline-none focus:border-primary"
          autoFocus
        />
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 h-12 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "확인 중..." : "인증 확인"}
        </button>
      </form>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}

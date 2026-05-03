"use client";

import { PROVIDERS, ProviderKey } from "@/lib/types";

interface Props {
  selected: ProviderKey;
  onChange: (provider: ProviderKey) => void;
}

/* KT logo: "kt" 검정 텍스트 + 빨간 빗금 느낌 → 검정 기본
   U+: 마젠타/보라 계열
   SK: 빨강 텍스트 + 오렌지 날개 (텍스트로는 빨강)
   알뜰 인터넷: 회색 */
const LOGO_CONFIG: Record<ProviderKey, {
  text: string;
  style: string;
  color: string;         // 활성 색상
  inactiveColor: string; // 비활성 색상
}> = {
  kt: {
    text: "kt",
    style: "font-[800] text-[28px] tracking-tight",
    color: "#000000",
    inactiveColor: "#C0C0C0",
  },
  lg: {
    text: "U+",
    style: "font-[800] text-[28px] tracking-tight",
    color: "#E6007E",
    inactiveColor: "#E0B0D0",
  },
  sk: {
    text: "SK",
    style: "font-[700] text-[26px] italic tracking-tight",
    color: "#EA002C",
    inactiveColor: "#E0B0B0",
  },
  other: {
    text: "알뜰 인터넷",
    style: "font-[600] text-[15px]",
    color: "#5A6278",
    inactiveColor: "#C0C5D0",
  },
};

export default function ProviderSelector({ selected, onChange }: Props) {
  return (
    <section className="apple-container pb-6">
      <h2 className="mb-4 text-[24px] font-semibold tracking-tight text-foreground">통신사 선택</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PROVIDERS.map((provider) => {
          const isActive = selected === provider.key;
          const cfg = LOGO_CONFIG[provider.key];
          return (
            <button
              key={provider.key}
              onClick={() => onChange(provider.key)}
              className={`flex h-[86px] items-center justify-center rounded-[1.5rem] border transition-all ${
                isActive
                  ? "border-foreground bg-white shadow-sm"
                  : "border-border bg-white/65 backdrop-blur-xl hover:bg-white"
              }`}
            >
              <span
                className={cfg.style}
                style={{ color: isActive ? cfg.color : cfg.inactiveColor }}
              >
                {cfg.text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

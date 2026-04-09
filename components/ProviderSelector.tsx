"use client";

import { PROVIDERS, ProviderKey } from "@/lib/types";

interface Props {
  selected: ProviderKey;
  onChange: (provider: ProviderKey) => void;
}

/* Original da24 uses large text logos, not SVG images — replicate that style */
const LOGO_TEXT: Record<ProviderKey, { text: string; style: string }> = {
  kt: { text: "kt", style: "font-[800] text-[28px] tracking-tight" },
  lg: { text: "U+", style: "font-[800] text-[28px] tracking-tight" },
  sk: { text: "SK", style: "font-[700] text-[26px] tracking-tight italic" },
  other: { text: "알뜰 인터넷", style: "font-[600] text-[14px]" },
};

/* 다크모드 대응 CSS 변수 사용: --provider-kt/lg/sk */
const LOGO_COLOR_VAR: Record<ProviderKey, string> = {
  kt: "var(--provider-kt)",
  lg: "var(--provider-lg)",
  sk: "var(--provider-sk)",
  other: "var(--muted-foreground)",
};

export default function ProviderSelector({ selected, onChange }: Props) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-6">
      <h2 className="text-[16px] font-bold text-foreground mb-4">통신사 선택</h2>

      <div className="grid grid-cols-4 gap-3">
        {PROVIDERS.map((provider) => {
          const isActive = selected === provider.key;
          const logo = LOGO_TEXT[provider.key];
          return (
            <button
              key={provider.key}
              onClick={() => onChange(provider.key)}
              className={`flex items-center justify-center h-[72px] rounded-xl border-2 transition-all ${
                isActive
                  ? "border-primary bg-card shadow-sm"
                  : "border-border bg-card hover:border-border-subtle"
              }`}
            >
              <span
                className={`${logo.style} transition-colors ${
                  isActive ? "" : "opacity-40"
                }`}
                style={{ color: isActive ? LOGO_COLOR_VAR[provider.key] : undefined }}
              >
                {logo.text}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

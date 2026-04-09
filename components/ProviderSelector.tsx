"use client";

import Image from "next/image";
import { PROVIDERS, ProviderKey } from "@/lib/types";
import { Check } from "lucide-react";

const LOGO_MAP: Record<ProviderKey, string> = {
  kt: "/images/logo-kt.svg",
  lg: "/images/logo-lg.svg",
  sk: "/images/logo-sk.svg",
  other: "/images/logo-other.svg",
};

interface Props {
  selected: ProviderKey;
  onChange: (provider: ProviderKey) => void;
}

export default function ProviderSelector({ selected, onChange }: Props) {
  return (
    <section className="max-w-[480px] mx-auto px-5 pb-4">
      <h2 className="text-lg font-bold text-text-primary mb-1">통신사 선택</h2>
      <p className="text-sm text-text-muted mb-4">비교할 통신사를 선택해 주세요</p>

      <div className="grid grid-cols-4 gap-2.5">
        {PROVIDERS.map((provider) => {
          const isActive = selected === provider.key;
          return (
            <button
              key={provider.key}
              onClick={() => onChange(provider.key)}
              className={`relative flex flex-col items-center justify-center py-3.5 px-2 rounded-xl transition-all ${
                isActive
                  ? "bg-white border-2 shadow-md"
                  : "bg-white border border-border-main hover:border-gray-300"
              }`}
              style={{
                borderColor: isActive ? provider.color : undefined,
              }}
            >
              {/* Check badge */}
              {isActive && (
                <div
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: provider.color }}
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Provider Logo */}
              <div className="mb-2">
                <Image
                  src={LOGO_MAP[provider.key]}
                  alt={provider.name}
                  width={56}
                  height={22}
                  className={`transition-opacity ${isActive ? "opacity-100" : "opacity-50"}`}
                  unoptimized
                />
              </div>
              <span
                className={`text-[11px] font-medium ${
                  isActive ? "text-text-primary" : "text-text-muted"
                }`}
              >
                {provider.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

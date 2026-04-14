"use client";

import { Package, Sparkles, Wifi, AirVent, ChevronRight } from "lucide-react";

export type BundleType = "basic" | "allinone" | "premium";

export interface BundleInfo {
  type: BundleType;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  discount: string;
  services: { icon: React.ElementType; label: string }[];
  bgFrom: string;
  bgTo: string;
}

export const BUNDLES: BundleInfo[] = [
  {
    type: "basic",
    title: "기본 패키지",
    subtitle: "이사 + 청소",
    description: "청소비 10% 할인",
    discount: "청소비 10% 할인",
    services: [
      { icon: Package, label: "이사" },
      { icon: Sparkles, label: "청소" },
    ],
    bgFrom: "from-primary/10",
    bgTo: "to-primary/5",
  },
  {
    type: "allinone",
    title: "올인원 패키지",
    subtitle: "이사 + 청소 + 인터넷",
    description: "인터넷 지원금 +5만",
    badge: "인기",
    discount: "인터넷 지원금 +5만원",
    services: [
      { icon: Package, label: "이사" },
      { icon: Sparkles, label: "청소" },
      { icon: Wifi, label: "인터넷" },
    ],
    bgFrom: "from-blue-500/10",
    bgTo: "to-primary/10",
  },
  {
    type: "premium",
    title: "프리미엄 패키지",
    subtitle: "이사 + 청소 + 인터넷 + 에어컨",
    description: "최대 9만원 절약",
    discount: "최대 9만원 절약",
    services: [
      { icon: Package, label: "이사" },
      { icon: Sparkles, label: "청소" },
      { icon: Wifi, label: "인터넷" },
      { icon: AirVent, label: "에어컨" },
    ],
    bgFrom: "from-purple-500/10",
    bgTo: "to-primary/10",
  },
];

interface BundleBannerProps {
  onSelect: (bundle: BundleInfo) => void;
}

export default function BundleBanner({ onSelect }: BundleBannerProps) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[16px] font-bold text-foreground">서비스 번들</h2>
        <span className="text-[12px] text-text-muted">묶어서 더 저렴하게</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {BUNDLES.map((bundle) => (
          <button
            key={bundle.type}
            onClick={() => onSelect(bundle)}
            className={`shrink-0 w-[260px] bg-gradient-to-br ${bundle.bgFrom} ${bundle.bgTo} border border-border rounded-2xl p-4 text-left hover:border-primary/40 transition-all active:scale-[0.98] relative`}
          >
            {bundle.badge && (
              <span className="absolute -top-2.5 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white">
                {bundle.badge}
              </span>
            )}
            <p className="text-[13px] font-semibold text-primary mb-1">{bundle.title}</p>
            <p className="text-[15px] font-bold text-foreground leading-snug mb-2">{bundle.subtitle}</p>

            {/* 서비스 아이콘 */}
            <div className="flex items-center gap-1.5 mb-3">
              {bundle.services.map((svc, i) => (
                <div key={svc.label} className="flex items-center gap-1">
                  {i > 0 && <span className="text-[10px] text-text-muted">+</span>}
                  <svc.icon className="w-4 h-4 text-primary" />
                </div>
              ))}
            </div>

            {/* 혜택 */}
            <div className="bg-card/70 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-primary">{bundle.discount}</span>
              <ChevronRight className="w-3.5 h-3.5 text-primary" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

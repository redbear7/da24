"use client";

import { useRouter } from "next/navigation";
import { X, Sparkles, Wifi, AirVent, Package } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type UpsellType =
  | "moving-to-clean"       // 이사 견적 완료 → 입주청소 제안
  | "clean-to-internet"     // 청소 상담 완료 → 인터넷 가입 제안
  | "internet-to-aircon"    // 인터넷 상담 완료 → 에어컨 설치 제안
  | "moving-date-bundle";   // 이사 날짜 선택 → 청소+인터넷 번들 제안

interface UpsellConfig {
  icon: React.ReactNode;
  badge: string;
  title: string;
  desc: string;
  ctaLabel: string;
  href: string;
  style: "modal" | "banner";
}

const UPSELL_CONFIGS: Record<UpsellType, UpsellConfig> = {
  "moving-to-clean": {
    icon: <Sparkles className="w-7 h-7 text-primary" />,
    badge: "함께하면 더 편해요",
    title: "입주청소도 함께 신청하시겠어요?",
    desc: "이사 후 새 집을 처음부터 끝까지 깨끗하게!\n전문 청소팀이 당일 방문해 드립니다.",
    ctaLabel: "청소 함께 신청하기",
    href: "/clean",
    style: "modal",
  },
  "clean-to-internet": {
    icon: <Wifi className="w-6 h-6 text-primary" />,
    badge: "지원금 혜택",
    title: "인터넷 가입하면 지원금 48만원!",
    desc: "청소와 함께 인터넷도 신청하면 최대 48만원 지원금을 받을 수 있어요.",
    ctaLabel: "인터넷 가입 알아보기",
    href: "/internet",
    style: "banner",
  },
  "internet-to-aircon": {
    icon: <AirVent className="w-6 h-6 text-primary" />,
    badge: "추가 서비스",
    title: "에어컨 설치도 필요하시면?",
    desc: "인터넷 신청 고객 대상 에어컨 설치 특가 혜택을 드려요.",
    ctaLabel: "에어컨 설치 알아보기",
    href: "/aircon",
    style: "banner",
  },
  "moving-date-bundle": {
    icon: <Package className="w-6 h-6 text-primary" />,
    badge: "번들 혜택",
    title: "이사일에 맞춰 청소+인터넷 한번에!",
    desc: "이사 날짜에 청소와 인터넷을 함께 예약하면 더욱 편리해요.",
    ctaLabel: "함께 신청하기",
    href: "/clean",
    style: "banner",
  },
};

// ─────────────────────────────────────────────
// UpsellModal (모달 스타일)
// ─────────────────────────────────────────────

interface UpsellModalProps {
  type: UpsellType;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpsellModal({ type, isOpen, onClose }: UpsellModalProps) {
  const router = useRouter();
  const config = UPSELL_CONFIGS[type];

  if (!isOpen) return null;

  const handleAccept = () => {
    onClose();
    router.push(config.href);
  };

  if (config.style === "banner") {
    return <UpsellBanner type={type} isOpen={isOpen} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[400px] rounded-t-3xl sm:rounded-2xl animate-slide-up overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="px-6 pt-6 pb-8">
          {/* Icon + badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shrink-0">
              {config.icon}
            </div>
            <span className="text-[12px] font-semibold text-primary bg-secondary px-3 py-1 rounded-full">
              {config.badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[20px] font-bold text-foreground mb-2 leading-snug">
            {config.title}
          </h2>

          {/* Desc */}
          <p className="text-[14px] text-text-secondary leading-relaxed mb-6 whitespace-pre-line">
            {config.desc}
          </p>

          {/* CTAs */}
          <div className="space-y-2.5">
            <button
              onClick={handleAccept}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all"
            >
              {config.ctaLabel}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-muted text-text-secondary font-medium rounded-xl text-[15px] hover:bg-border transition-all"
            >
              다음에 할게요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// UpsellBanner (배너 스타일 - 화면 하단 고정)
// ─────────────────────────────────────────────

interface UpsellBannerProps {
  type: UpsellType;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsellBanner({ type, isOpen, onClose }: UpsellBannerProps) {
  const router = useRouter();
  const config = UPSELL_CONFIGS[type];

  if (!isOpen) return null;

  const handleAccept = () => {
    onClose();
    router.push(config.href);
  };

  return (
    <div className="fixed bottom-[88px] left-0 right-0 z-[150] px-4 animate-slide-up">
      <div className="max-w-[640px] mx-auto bg-card border border-primary/20 rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-start gap-3 px-4 pt-4 pb-3">
          {/* Icon */}
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0 mt-0.5">
            {config.icon}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-primary mb-0.5">{config.badge}</p>
            <p className="text-[14px] font-bold text-foreground leading-snug">{config.title}</p>
            <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">{config.desc}</p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-[13px] hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {config.ctaLabel}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-muted text-text-secondary font-medium rounded-xl text-[13px] hover:bg-border transition-all"
          >
            다음에
          </button>
        </div>
      </div>
    </div>
  );
}

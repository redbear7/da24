"use client";

import { useState } from "react";
import { Star, ChevronDown, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ─────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────

type ReviewCategory = "all" | "moving" | "clean" | "internet" | "aircon";

const CATEGORIES: { key: ReviewCategory; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "moving", label: "이사" },
  { key: "clean", label: "청소" },
  { key: "internet", label: "인터넷" },
  { key: "aircon", label: "에어컨" },
];

const REVIEWS = [
  {
    id: 591423,
    area: "서울시 강서구",
    company: "업체 한******",
    category: "moving" as ReviewCategory,
    rating: 5,
    text: "골목이라는 열악한 조건의 이사였음에도 불구하고 끝까지 처리해 주셨어요~",
    period: "1개월 내 이사",
    date: "2026.03.21",
  },
  {
    id: 591332,
    area: "인천시 남동구",
    company: "업체 아********",
    category: "moving" as ReviewCategory,
    rating: 5,
    text: "이분들께는 안되는건 없으신거같아요!! 정말 최고의 이사였습니다",
    period: "2개월 내 이사",
    date: "2026.03.18",
  },
  {
    id: 591206,
    area: "수원시",
    company: "업체 대***",
    category: "moving" as ReviewCategory,
    rating: 3,
    text: "전반적으로 괜찮았는데 좀 더 꼼꼼하게 해주셨으면 했습니다",
    period: "1개월 내 이사",
    date: "2026.03.15",
  },
  {
    id: 591150,
    area: "서울시 마포구",
    company: "업체 클****",
    category: "clean" as ReviewCategory,
    rating: 5,
    text: "입주청소 정말 만족합니다. 욕실 물때도 싹 제거해주셔서 새 집 같아졌어요!",
    period: "입주청소",
    date: "2026.03.10",
  },
  {
    id: 591087,
    area: "부산시 해운대구",
    company: "KT 파트너",
    category: "internet" as ReviewCategory,
    rating: 5,
    text: "인터넷 가입 지원금 정말 바로 입금되더라고요! 다이사 믿고 신청했는데 너무 좋습니다.",
    period: "신규 가입",
    date: "2026.03.08",
  },
  {
    id: 591002,
    area: "대구시 수성구",
    company: "업체 에**",
    category: "aircon" as ReviewCategory,
    rating: 4,
    text: "에어컨 청소 후 냄새가 완전히 없어졌어요. 전문 장비로 꼼꼼하게 세척해주셨습니다.",
    period: "에어컨 청소",
    date: "2026.03.05",
  },
  {
    id: 590950,
    area: "서울시 송파구",
    company: "업체 이****",
    category: "moving" as ReviewCategory,
    rating: 5,
    text: "사무실 이사인데 장비 손상 하나 없이 완벽하게 처리해주셨어요. 직원들도 친절했습니다.",
    period: "사무실이사",
    date: "2026.03.02",
  },
  {
    id: 590888,
    area: "광주시 서구",
    company: "LG U+ 파트너",
    category: "internet" as ReviewCategory,
    rating: 5,
    text: "설치 다음날 바로 지원금 입금됐어요. 약속대로 현금 지급해주셔서 너무 감사합니다!",
    period: "통신사 변경",
    date: "2026.02.28",
  },
];

const RATING_STATS = {
  total: 48329,
  average: 4.8,
  distribution: [
    { stars: 5, count: 38412, pct: 79 },
    { stars: 4, count: 7249, pct: 15 },
    { stars: 3, count: 2416, pct: 5 },
    { stars: 2, count: 145, pct: 0.3 },
    { stars: 1, count: 107, pct: 0.2 },
  ],
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function RatingSummary() {
  return (
    <section className="max-w-[640px] mx-auto px-5 pt-6 pb-4">
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-6">
          {/* 평균 점수 */}
          <div className="text-center shrink-0">
            <p className="text-[48px] font-extrabold text-foreground leading-none">{RATING_STATS.average}</p>
            <div className="flex justify-center gap-0.5 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(RATING_STATS.average) ? "text-yellow-400 fill-yellow-400" : "text-border"}`}
                />
              ))}
            </div>
            <p className="text-[12px] text-text-muted mt-1">{RATING_STATS.total.toLocaleString()}개 리뷰</p>
          </div>

          {/* 분포 바 */}
          <div className="flex-1 space-y-1.5">
            {RATING_STATS.distribution.map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-[12px] text-text-muted w-4 shrink-0">{stars}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[11px] text-text-muted w-8 text-right shrink-0">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryFilter({
  selected,
  onChange,
}: {
  selected: ReviewCategory;
  onChange: (c: ReviewCategory) => void;
}) {
  return (
    <section className="max-w-[640px] mx-auto px-5 pb-4">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={[
              "shrink-0 px-4 py-2 rounded-full text-[14px] font-semibold transition-all",
              selected === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

function ReviewCard({
  review,
}: {
  review: (typeof REVIEWS)[number];
}) {
  const categoryLabel = CATEGORIES.find((c) => c.key === review.category)?.label ?? "";

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-foreground">
            {review.area} {review.company}
          </span>
        </div>
        <span className="text-[12px] text-text-muted shrink-0">{review.date}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-border"}`}
            />
          ))}
        </div>
        <span className="text-[12px] bg-secondary text-primary px-2 py-0.5 rounded-full font-medium">
          {categoryLabel}
        </span>
        <span className="text-[12px] text-text-muted">{review.period}</span>
      </div>
      <p className="text-[14px] text-text-secondary leading-relaxed">{review.text}</p>
      <p className="text-[12px] text-text-muted mt-2">{review.id}님</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function ReviewPage() {
  const [category, setCategory] = useState<ReviewCategory>("all");
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");

  const filtered = REVIEWS.filter((r) => category === "all" || r.category === category);
  const sorted = [...filtered].sort((a, b) =>
    sortBy === "rating" ? b.rating - a.rating : b.id - a.id
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="max-w-[640px] mx-auto px-5 pt-6 pb-5">
        <h1 className="text-[24px] font-bold text-foreground leading-snug mb-2">
          이사업체 고객 평가
        </h1>
        <p className="text-[14px] text-text-secondary leading-relaxed">
          실제 이용 고객의 솔직한 후기를 확인해 보세요.
        </p>
      </section>

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <RatingSummary />

      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-4" />

      <CategoryFilter selected={category} onChange={setCategory} />

      {/* 정렬 */}
      <section className="max-w-[640px] mx-auto px-5 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-text-muted">
            총 <span className="font-semibold text-foreground">{sorted.length}</span>개 리뷰
          </p>
          <div className="flex gap-1">
            {(["recent", "rating"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={[
                  "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all",
                  sortBy === s ? "bg-secondary text-primary" : "text-text-muted hover:text-foreground",
                ].join(" ")}
              >
                {s === "recent" ? "최신순" : "평점순"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 리뷰 목록 */}
      <section className="max-w-[640px] mx-auto px-5 pb-8">
        {sorted.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-[15px] text-text-muted">해당 카테고리의 리뷰가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {sorted.length > 0 && (
          <button className="w-full mt-4 py-3.5 bg-muted rounded-xl text-[14px] font-semibold text-text-secondary hover:text-foreground transition-colors flex items-center justify-center gap-1.5">
            <ChevronDown className="w-4 h-4" />
            더보기
          </button>
        )}
      </section>

      <Footer />
    </div>
  );
}

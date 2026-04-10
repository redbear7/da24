"use client";

import { Star } from "lucide-react";

interface Review {
  name: string;
  date: string;
  subsidy: string;
  rating: number;
  content: string;
  tags: string[];
}

const REVIEWS: Review[] = [
  {
    name: "이** 고객님",
    date: "2026.03.06",
    subsidy: "470,000원 + 비밀지원금",
    rating: 5,
    content:
      "자세한 상담은 물론 친절하시고, 시간맞춰 연락 주셔서 잘 해결 했습니다",
    tags: ["빠른응대", "친절한 상담", "자세한 상담"],
  },
  {
    name: "채** 고객님",
    date: "2026.03.06",
    subsidy: "480,000원 + 비밀지원금",
    rating: 5,
    content:
      "별 기대 안하고 했는데, 상담사분이 너무 친절해서 만족스러웠어요. 다이사 인터넷 추천합니다 ㅋ",
    tags: ["빠른 응대", "친절한 상담", "자세한 상담", "높은 사은품 가격"],
  },
  {
    name: "채** 고객님",
    date: "2026.02.18",
    subsidy: "480,000원 + 비밀지원금",
    rating: 5,
    content: "전반적으로 만족하였습니다",
    tags: ["친절한 상담"],
  },
  {
    name: "조** 고객님",
    date: "2026.02.03",
    subsidy: "480,000원 + 비밀지원금",
    rating: 4,
    content:
      "긴 시간을 두고 천천히 생각할 수 있게끔 해주어 좋았음.",
    tags: ["자세한 상담"],
  },
  {
    name: "이** 고객님",
    date: "2026.02.02",
    subsidy: "480,000원 + 비밀지원금",
    rating: 5,
    content:
      "사은품 최대로 주시고 친절하셔서 대만족이에요! 감사합니다 주변에도 추천할게요",
    tags: ["친절한 상담", "높은 사은품 가격"],
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  return (
    <section className="max-w-[640px] mx-auto py-6">
      <h2 className="text-[18px] font-bold text-foreground mb-4 px-5">고객 후기</h2>

      {/* 가로 스크롤 카드 */}
      <div className="flex gap-3 overflow-x-auto px-5 pb-3 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className="flex-none w-[240px] bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[14px] font-semibold text-foreground">{r.name}</span>
              <span className="text-[11px] text-text-muted">{r.date}</span>
            </div>
            <StarRating rating={r.rating} />
            <p className="text-[12px] font-semibold text-primary mt-2 mb-1.5">
              지원금: {r.subsidy}
            </p>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-2 line-clamp-3">
              {r.content}
            </p>
            <div className="flex flex-wrap gap-1">
              {r.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-text-muted bg-muted px-1.5 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

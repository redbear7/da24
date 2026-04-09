"use client";

import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";

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
      "별 기대 안하고 했는데, 상담사분이 너무 친절해서 만족스러웠어요. 다이사 인터넷 추천합니다 ㅋ 상담해주신 분 감사합니다.!",
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
      "긴 시간을 두고 천천히 생각할 수 있게끔 해주어 좋았음. 향후 알뜰 인터넷 가입이 가능하게끔 진행해주셨으면 함",
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

const INITIAL_VISIBLE = 3;

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
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? REVIEWS : REVIEWS.slice(0, INITIAL_VISIBLE);

  return (
    <section className="max-w-[640px] mx-auto px-5 py-6">
      <h2 className="text-[18px] font-bold text-foreground mb-4">고객 후기</h2>

      <div className="flex flex-col divide-y divide-border">
        {visible.map((r, i) => (
          <div key={i} className="py-4 first:pt-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[15px] font-semibold text-foreground">{r.name}</span>
              <span className="text-[12px] text-text-muted">{r.date}</span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <StarRating rating={r.rating} />
            </div>
            <p className="text-[13px] font-semibold text-primary mb-1.5">
              지원금: {r.subsidy}
            </p>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-2">
              {r.content}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {r.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] text-text-muted bg-muted px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!showAll && REVIEWS.length > INITIAL_VISIBLE && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full flex items-center justify-center gap-1 mt-2 py-3 text-[14px] text-text-secondary border border-border rounded-xl transition-colors hover:border-primary/40"
        >
          고객 후기 더보기
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </section>
  );
}

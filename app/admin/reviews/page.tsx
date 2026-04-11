"use client";

import { useEffect, useState } from "react";
import { Star, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DUMMY_REVIEWS, type Review } from "@/lib/dummy-reviews";

// ─────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────

type ServiceType = Review["serviceType"] | "all";

const SERVICE_TYPES: { key: ServiceType; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "moving", label: "이사" },
  { key: "clean", label: "청소" },
  { key: "internet", label: "인터넷" },
  { key: "aircon", label: "에어컨" },
];

const SERVICE_LABEL: Record<Review["serviceType"], string> = {
  moving: "이사",
  clean: "청소",
  internet: "인터넷",
  aircon: "에어컨",
};

// ─────────────────────────────────────────────
// Add Review Modal
// ─────────────────────────────────────────────

interface AddModalProps {
  onClose: () => void;
  onAdded: (review: Review) => void;
}

function AddReviewModal({ onClose, onAdded }: AddModalProps) {
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    serviceType: "moving" as Review["serviceType"],
    region: "",
    text: "",
    subsidy: "",
    date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim() || !form.region.trim()) {
      setError("이름, 지역, 내용을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError("");

    const newReview: Omit<Review, "id"> = {
      name: form.name.trim(),
      rating: form.rating,
      serviceType: form.serviceType,
      region: form.region.trim(),
      text: form.text.trim(),
      subsidy: form.subsidy.trim(),
      date: form.date,
      tags: [],
    };

    // Supabase에 저장 시도
    const { data, error: dbError } = await supabase
      .from("reviews")
      .insert([newReview])
      .select()
      .single();

    if (dbError) {
      // DB 오류시 더미 ID로 로컬 추가
      const localReview: Review = {
        ...newReview,
        id: `local-${Date.now()}`,
      };
      onAdded(localReview);
    } else {
      onAdded(data as Review);
    }

    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-foreground">리뷰 등록</h2>
          <button onClick={onClose} className="text-text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 + 서비스 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">이름</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="예) 이**"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">서비스 유형</label>
              <select
                value={form.serviceType}
                onChange={(e) => set("serviceType", e.target.value)}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:border-primary"
              >
                {SERVICE_TYPES.filter((s) => s.key !== "all").map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 지역 */}
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">지역</label>
            <input
              type="text"
              value={form.region}
              onChange={(e) => set("region", e.target.value)}
              placeholder="예) 창원시 성산구"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* 별점 */}
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">별점</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("rating", n)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      n <= form.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">리뷰 내용</label>
            <textarea
              value={form.text}
              onChange={(e) => set("text", e.target.value)}
              rows={3}
              placeholder="리뷰 내용을 입력하세요"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* 지원금 (인터넷) + 날짜 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">지원금 (선택)</label>
              <input
                type="text"
                value={form.subsidy}
                onChange={(e) => set("subsidy", e.target.value)}
                placeholder="예) 470,000원"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">날짜</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                placeholder="2026.04.11"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {error && <p className="text-[13px] text-accent">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-muted text-text-secondary rounded-xl text-[14px] font-semibold hover:text-foreground transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold disabled:opacity-60 transition-opacity"
            >
              {saving ? "저장 중..." : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ServiceType>("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 초기 로드: Supabase → 실패 시 더미 데이터
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("date", { ascending: false });

      if (error || !data || data.length === 0) {
        setReviews(DUMMY_REVIEWS);
      } else {
        setReviews(data as Review[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("이 리뷰를 삭제하시겠습니까?")) return;
    setDeletingId(id);

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    // DB 오류나 로컬 ID라도 UI에서 제거
    if (error && !id.startsWith("local-")) {
      alert("삭제 중 오류가 발생했습니다.");
    } else {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
    setDeletingId(null);
  }

  function handleAdded(review: Review) {
    setReviews((prev) => [review, ...prev]);
  }

  const filtered =
    filter === "all" ? reviews : reviews.filter((r) => r.serviceType === filter);

  return (
    <>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-foreground">고객 리뷰 관리</h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            총 {reviews.length}개 리뷰
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          리뷰 등록
        </button>
      </div>

      {/* 서비스 필터 */}
      <div className="flex gap-2 mb-5">
        {SERVICE_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={[
              "px-4 py-2 rounded-lg text-[13px] font-medium transition-colors",
              filter === key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-text-secondary hover:text-foreground",
            ].join(" ")}
          >
            {label}
            {key !== "all" && (
              <span className="ml-1.5 text-[11px] opacity-70">
                {reviews.filter((r) => r.serviceType === key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 리뷰 테이블 */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-text-muted text-[14px]">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-[14px]">리뷰가 없습니다.</div>
        ) : (
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-left px-5 py-3 font-semibold text-text-secondary w-20">별점</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary w-24">이름</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary w-28">서비스</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary w-36">지역</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary">내용</th>
                <th className="text-left px-5 py-3 font-semibold text-text-secondary w-28">날짜</th>
                <th className="text-right px-5 py-3 font-semibold text-text-secondary w-16">삭제</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review, idx) => (
                <tr
                  key={review.id}
                  className={[
                    "border-b border-border-subtle last:border-0 hover:bg-muted/50 transition-colors",
                    idx % 2 === 0 ? "" : "bg-muted/20",
                  ].join(" ")}
                >
                  {/* 별점 */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-foreground">{review.rating}</span>
                    </div>
                  </td>

                  {/* 이름 */}
                  <td className="px-5 py-3 font-medium text-foreground">{review.name}</td>

                  {/* 서비스 유형 */}
                  <td className="px-5 py-3">
                    <span className="inline-block px-2 py-0.5 bg-secondary text-primary text-[12px] font-medium rounded-full">
                      {SERVICE_LABEL[review.serviceType]}
                    </span>
                  </td>

                  {/* 지역 */}
                  <td className="px-5 py-3 text-text-secondary">{review.region}</td>

                  {/* 내용 */}
                  <td className="px-5 py-3 text-text-secondary max-w-0">
                    <p className="truncate">{review.text}</p>
                    {review.subsidy && (
                      <p className="text-[12px] text-primary mt-0.5">지원금: {review.subsidy}</p>
                    )}
                  </td>

                  {/* 날짜 */}
                  <td className="px-5 py-3 text-text-muted">{review.date}</td>

                  {/* 삭제 */}
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="p-1.5 text-text-muted hover:text-accent disabled:opacity-40 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 등록 모달 */}
      {showModal && (
        <AddReviewModal
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
        />
      )}
    </>
  );
}

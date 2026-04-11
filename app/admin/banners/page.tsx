"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, GripVertical, X, Check } from "lucide-react";

/* ─── 타입 ─── */
interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bg_color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const BG_OPTIONS = [
  { value: "bg-primary", label: "Primary (파란색)" },
  { value: "bg-foreground", label: "Foreground (어두운색)" },
  { value: "bg-accent", label: "Accent (빨간색)" },
  { value: "bg-secondary", label: "Secondary (연한색)" },
];

const EMPTY_FORM = { title: "", subtitle: "", bg_color: "bg-primary", is_active: true };

/* ─── 컴포넌트 ─── */
export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* 모달 상태 */
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  /* 삭제 확인 */
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* 드래그 상태 */
  const dragIdx = useRef<number | null>(null);

  /* ─── Fetch ─── */
  async function fetchBanners() {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      setError("배너를 불러오지 못했습니다: " + error.message);
    } else {
      setBanners(data ?? []);
      setError(null);
    }
    setLoading(false);
  }

  useEffect(() => { fetchBanners(); }, []);

  /* ─── 모달 열기 ─── */
  function openCreate() {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setModal("create");
  }

  function openEdit(b: Banner) {
    setForm({ title: b.title, subtitle: b.subtitle, bg_color: b.bg_color, is_active: b.is_active });
    setEditTarget(b);
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditTarget(null);
  }

  /* ─── 저장 ─── */
  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);

    if (modal === "create") {
      const maxOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.sort_order)) : 0;
      const { error } = await supabase.from("banners").insert({
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        bg_color: form.bg_color,
        is_active: form.is_active,
        sort_order: maxOrder + 1,
      });
      if (error) { setError(error.message); } else { await fetchBanners(); closeModal(); }
    } else if (modal === "edit" && editTarget) {
      const { error } = await supabase
        .from("banners")
        .update({
          title: form.title.trim(),
          subtitle: form.subtitle.trim(),
          bg_color: form.bg_color,
          is_active: form.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editTarget.id);
      if (error) { setError(error.message); } else { await fetchBanners(); closeModal(); }
    }

    setSaving(false);
  }

  /* ─── 삭제 ─── */
  async function handleDelete(id: string) {
    setSaving(true);
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) { setError(error.message); } else { await fetchBanners(); }
    setDeleteId(null);
    setSaving(false);
  }

  /* ─── 활성/비활성 토글 ─── */
  async function toggleActive(b: Banner) {
    await supabase.from("banners").update({ is_active: !b.is_active }).eq("id", b.id);
    setBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, is_active: !x.is_active } : x));
  }

  /* ─── 드래그 정렬 ─── */
  function onDragStart(idx: number) {
    dragIdx.current = idx;
  }

  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const newList = [...banners];
    const [moved] = newList.splice(dragIdx.current, 1);
    newList.splice(idx, 0, moved);
    dragIdx.current = idx;
    setBanners(newList);
  }

  async function onDragEnd() {
    dragIdx.current = null;
    // sort_order 일괄 업데이트
    const updates = banners.map((b, i) =>
      supabase.from("banners").update({ sort_order: i + 1 }).eq("id", b.id)
    );
    await Promise.all(updates);
  }

  /* ─── 렌더 ─── */
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-foreground">배너 관리</h1>
          <p className="text-[13px] text-text-muted mt-0.5">메인홈 프로모 배너를 관리합니다. 드래그하여 순서를 변경하세요.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          배너 추가
        </button>
      </div>

      {/* 에러 */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-accent/10 border border-accent/20 rounded-xl text-[13px] text-accent">
          {error}
        </div>
      )}

      {/* 로딩 */}
      {loading ? (
        <div className="text-center py-20 text-text-muted text-[14px]">불러오는 중...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <p className="text-[15px] font-semibold text-foreground mb-1">배너가 없습니다</p>
          <p className="text-[13px] text-text-muted">위의 배너 추가 버튼으로 첫 배너를 등록해보세요.</p>
        </div>
      ) : (
        /* 배너 리스트 */
        <div className="space-y-2">
          {banners.map((b, idx) => (
            <div
              key={b.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragEnd={onDragEnd}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 cursor-default group hover:border-primary/30 transition-colors"
            >
              {/* 드래그 핸들 */}
              <div className="cursor-grab active:cursor-grabbing text-text-muted hover:text-foreground shrink-0">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* 순서 */}
              <span className="text-[13px] font-bold text-text-muted w-5 shrink-0 text-center">
                {b.sort_order}
              </span>

              {/* 배너 미리보기 색상 */}
              <div className={`${b.bg_color} w-10 h-10 rounded-lg shrink-0 flex items-center justify-center`}>
                <span className="text-[10px] text-white font-bold opacity-70">BG</span>
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground truncate">{b.title}</p>
                <p className="text-[13px] text-text-secondary truncate">{b.subtitle || "—"}</p>
              </div>

              {/* 활성 토글 */}
              <button
                onClick={() => toggleActive(b)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                  b.is_active
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-muted text-text-muted hover:bg-border"
                }`}
              >
                {b.is_active ? (
                  <><Check className="w-3 h-3" /> 활성</>
                ) : (
                  <>비활성</>
                )}
              </button>

              {/* 수정/삭제 버튼 */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(b)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-primary hover:bg-secondary transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(b.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── 배너 미리보기 ─── */}
      {banners.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[15px] font-bold text-foreground mb-3">미리보기 (첫 번째 배너)</h2>
          <div
            className={`${banners[0].bg_color} rounded-2xl px-5 py-5 text-white relative overflow-hidden min-h-[88px] max-w-[400px]`}
          >
            <p className="text-[13px] text-white/70">{banners[0].subtitle || "부제 없음"}</p>
            <p className="text-[17px] font-bold mt-0.5">{banners[0].title}</p>
          </div>
        </div>
      )}

      {/* ─── 등록/수정 모달 ─── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-card w-full max-w-md rounded-2xl shadow-xl mx-4">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-[17px] font-bold text-foreground">
                {modal === "create" ? "배너 추가" : "배너 수정"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-text-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 폼 */}
            <div className="px-6 py-5 space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-[13px] font-semibold text-foreground mb-1.5">
                  제목 <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="배너 제목을 입력하세요"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              {/* 부제 */}
              <div>
                <label className="block text-[13px] font-semibold text-foreground mb-1.5">
                  부제
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="배너 부제 (선택)"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary"
                />
              </div>

              {/* 배경 색상 */}
              <div>
                <label className="block text-[13px] font-semibold text-foreground mb-1.5">
                  배경 색상
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((f) => ({ ...f, bg_color: opt.value }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-colors ${
                        form.bg_color === opt.value
                          ? "border-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className={`${opt.value} w-6 h-6 rounded-md shrink-0`} />
                      <span className="text-[12px] font-medium text-foreground">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 활성 여부 */}
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] font-semibold text-foreground">활성 상태</span>
                <button
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.is_active ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* 미리보기 */}
              {form.title && (
                <div>
                  <p className="text-[12px] font-semibold text-text-muted mb-1.5">미리보기</p>
                  <div className={`${form.bg_color} rounded-xl px-4 py-4 text-white`}>
                    <p className="text-[12px] text-white/70">{form.subtitle || "부제"}</p>
                    <p className="text-[15px] font-bold mt-0.5">{form.title}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="flex gap-2 px-6 pb-5">
              <button
                onClick={closeModal}
                className="flex-1 py-3 border border-border rounded-xl text-[14px] font-semibold text-foreground hover:bg-muted transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || saving}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {saving ? "저장 중..." : modal === "create" ? "추가" : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 삭제 확인 모달 ─── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card w-full max-w-sm rounded-2xl shadow-xl mx-4 p-6 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-[17px] font-bold text-foreground mb-1">배너를 삭제할까요?</h2>
            <p className="text-[13px] text-text-secondary mb-5">삭제한 배너는 복구할 수 없습니다.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border border-border rounded-xl text-[14px] font-semibold text-foreground hover:bg-muted transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={saving}
                className="flex-1 py-3 bg-accent text-white rounded-xl text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {saving ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

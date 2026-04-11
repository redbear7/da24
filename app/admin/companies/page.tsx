"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface MovingCompany {
  id: string;
  name: string;
  region: string;
  address: string;
  phone: string;
  rating: number;
  review_count: number;
  vehicle_count: number;
  staff_count: number;
  specialties: string[];
  description: string;
  is_active: boolean;
  created_at: string;
}

const SPECIALTY_OPTIONS = [
  "가정이사", "포장이사", "소형이사", "원룸이사",
  "사무실이사", "공장이사", "보관이사", "긴급이사",
  "군인이사", "프리미엄이사", "농촌이사", "에어컨",
];

const emptyForm = {
  name: "",
  region: "",
  address: "",
  phone: "",
  vehicle_count: 1,
  staff_count: 1,
  specialties: [] as string[],
  description: "",
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<MovingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MovingCompany | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("moving_companies")
      .select("*")
      .order("created_at", { ascending: false });
    setCompanies(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(company: MovingCompany) {
    setEditTarget(company);
    setForm({
      name: company.name,
      region: company.region,
      address: company.address,
      phone: company.phone,
      vehicle_count: company.vehicle_count,
      staff_count: company.staff_count,
      specialties: company.specialties ?? [],
      description: company.description,
    });
    setModalOpen(true);
  }

  function toggleSpecialty(s: string) {
    setForm((f) => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter((x) => x !== s)
        : [...f.specialties, s],
    }));
  }

  async function handleSave() {
    if (!form.name || !form.region || !form.phone) return;
    setSaving(true);
    if (editTarget) {
      await supabase
        .from("moving_companies")
        .update({ ...form })
        .eq("id", editTarget.id);
    } else {
      await supabase.from("moving_companies").insert([{ ...form, rating: 0, review_count: 0 }]);
    }
    setSaving(false);
    setModalOpen(false);
    fetchCompanies();
  }

  async function handleDelete(id: string) {
    await supabase.from("moving_companies").delete().eq("id", id);
    setDeleteConfirm(null);
    fetchCompanies();
  }

  const filtered = companies.filter(
    (c) =>
      c.name.includes(search) ||
      c.region.includes(search) ||
      c.phone.includes(search)
  );

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-foreground">이사 업체 관리</h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            총 {companies.length}개 업체
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-primary text-primary-foreground text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          + 업체 등록
        </button>
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="업체명, 지역, 연락처 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 px-3 py-2 bg-card border border-border rounded-lg text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* 테이블 */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-4 py-3 font-medium text-text-muted">업체명</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">지역</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">평점</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">차량수</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">연락처</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">전문분야</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-text-muted">
                  불러오는 중...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-text-muted">
                  {search ? "검색 결과가 없습니다." : "등록된 업체가 없습니다."}
                </td>
              </tr>
            ) : (
              filtered.map((company) => (
                <tr key={company.id} className="border-b border-border-subtle last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{company.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{company.region}</td>
                  <td className="px-4 py-3">
                    <span className="text-foreground font-medium">
                      {company.rating > 0 ? company.rating.toFixed(1) : "—"}
                    </span>
                    {company.review_count > 0 && (
                      <span className="text-text-muted ml-1">({company.review_count})</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{company.vehicle_count}대</td>
                  <td className="px-4 py-3 text-text-secondary">{company.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(company.specialties ?? []).slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[11px] rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                      {(company.specialties ?? []).length > 3 && (
                        <span className="px-2 py-0.5 bg-muted text-text-muted text-[11px] rounded-full">
                          +{company.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(company)}
                        className="px-3 py-1 text-[12px] font-medium text-primary border border-primary/30 rounded-md hover:bg-secondary transition-colors"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(company.id)}
                        className="px-3 py-1 text-[12px] font-medium text-accent border border-accent/30 rounded-md hover:bg-accent/10 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 등록/수정 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-[17px] font-bold text-foreground">
                {editTarget ? "업체 수정" : "업체 등록"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-muted hover:text-foreground transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <Field label="업체명 *">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="예: 창원 한마음 이사"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="지역 *">
                  <input
                    type="text"
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    placeholder="예: 창원시 성산구"
                    className={inputCls}
                  />
                </Field>
                <Field label="연락처 *">
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="055-123-4567"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="주소">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="상세 주소 입력"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="차량수">
                  <input
                    type="number"
                    min={1}
                    value={form.vehicle_count}
                    onChange={(e) =>
                      setForm({ ...form, vehicle_count: Number(e.target.value) })
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="인력수">
                  <input
                    type="number"
                    min={1}
                    value={form.staff_count}
                    onChange={(e) =>
                      setForm({ ...form, staff_count: Number(e.target.value) })
                    }
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="전문분야">
                <div className="flex flex-wrap gap-2 mt-1">
                  {SPECIALTY_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpecialty(s)}
                      className={`px-3 py-1 text-[12px] rounded-full border transition-colors ${
                        form.specialties.includes(s)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-text-secondary border-border hover:border-primary/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="업체 소개">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="업체 특장점, 서비스 특이사항 등"
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              </Field>
            </div>

            <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-[14px] font-medium text-text-secondary border border-border rounded-lg hover:bg-muted transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.region || !form.phone}
                className="px-5 py-2 text-[14px] font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {saving ? "저장 중..." : editTarget ? "수정 완료" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-sm shadow-xl p-6">
            <h2 className="text-[17px] font-bold text-foreground mb-2">업체 삭제</h2>
            <p className="text-[14px] text-text-secondary mb-5">
              이 업체를 삭제하면 복구할 수 없습니다. 계속하시겠습니까?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-[14px] font-medium text-text-secondary border border-border rounded-lg hover:bg-muted transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-[14px] font-medium bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 bg-muted border border-border rounded-lg text-[14px] text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary";

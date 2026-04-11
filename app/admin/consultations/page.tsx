"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Loader2, RefreshCw } from "lucide-react";

// ─── 타입 ───────────────────────────────────────────────────────────────────

type ServiceType = "all" | "internet" | "clean" | "moving" | "aircon" | "loan";
type StatusType = "all" | "pending" | "contacted" | "completed" | "cancelled";

interface Consultation {
  id: string;
  name: string;
  phone: string;
  status: "pending" | "contacted" | "completed" | "cancelled";
  created_at: string;
  _service: "internet" | "clean";
  // 인터넷 전용
  plan_type?: string;
  provider?: string;
  plan_name?: string;
  address?: string;
  memo?: string;
  // 청소 전용
  clean_type?: string;
  size?: string;
  room?: string;
  preferred_date?: string;
}

// ─── 상수 ────────────────────────────────────────────────────────────────────

const SERVICE_LABELS: Record<ServiceType, string> = {
  all: "전체",
  internet: "인터넷",
  clean: "청소",
  moving: "이사",
  aircon: "에어컨",
  loan: "대출",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "대기",
  contacted: "연락완료",
  completed: "완료",
  cancelled: "취소",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const SERVICE_BADGE: Record<string, string> = {
  internet: "bg-secondary text-primary",
  clean: "bg-purple-100 text-purple-700",
  moving: "bg-orange-100 text-orange-700",
  aircon: "bg-cyan-100 text-cyan-700",
  loan: "bg-green-100 text-green-700",
};

const PLAN_TYPE_LABELS: Record<string, string> = {
  new: "신규가입",
  change: "통신사변경",
  renew: "재약정",
  move: "이전설치",
};

const CLEAN_TYPE_LABELS: Record<string, string> = {
  movein: "입주청소",
  moveout: "이사청소",
  general: "일반청소",
  special: "특수청소",
};

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatPhone(phone: string) {
  if (phone.length === 11) return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
  if (phone.length === 10) return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
  return phone;
}

// ─── 상태 드롭다운 ────────────────────────────────────────────────────────────

function StatusDropdown({
  id,
  service,
  current,
  onChanged,
}: {
  id: string;
  service: string;
  current: string;
  onChanged: (newStatus: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, service, status: newStatus }),
      });
      if (res.ok) onChanged(newStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center gap-1">
      {loading && <Loader2 className="w-3 h-3 text-primary animate-spin shrink-0" />}
      <select
        value={current}
        onChange={handleChange}
        disabled={loading}
        onClick={(e) => e.stopPropagation()}
        className={`text-[12px] font-medium px-2 py-1 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30 ${STATUS_COLORS[current]}`}
      >
        <option value="pending">대기</option>
        <option value="contacted">연락완료</option>
        <option value="completed">완료</option>
        <option value="cancelled">취소</option>
      </select>
    </div>
  );
}

// ─── Row 컴포넌트 ─────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-[13px] text-text-secondary shrink-0">{label}</span>
      <span className="text-[13px] text-foreground font-medium text-right break-all">{value}</span>
    </div>
  );
}

// ─── 상세 모달 ────────────────────────────────────────────────────────────────

function DetailModal({
  item,
  onClose,
  onStatusChange,
}: {
  item: Consultation;
  onClose: () => void;
  onStatusChange: (newStatus: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${SERVICE_BADGE[item._service]}`}>
              {SERVICE_LABELS[item._service as ServiceType]}
            </span>
            <span className="text-[16px] font-bold text-foreground">{item.name}</span>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 내용 */}
        <div className="px-5 py-4 space-y-4">
          {/* 기본 정보 */}
          <section>
            <h3 className="text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-3">기본 정보</h3>
            <div className="space-y-0">
              <DetailRow label="이름" value={item.name} />
              <DetailRow label="연락처" value={formatPhone(item.phone)} />
              <DetailRow label="신청일시" value={formatDate(item.created_at)} />
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[13px] text-text-secondary">상태</span>
                <StatusDropdown
                  id={item.id}
                  service={item._service}
                  current={item.status}
                  onChanged={onStatusChange}
                />
              </div>
            </div>
          </section>

          {/* 인터넷 상세 */}
          {item._service === "internet" && (
            <section>
              <h3 className="text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-3">인터넷 정보</h3>
              <div className="space-y-0">
                {item.plan_type && (
                  <DetailRow label="가입 유형" value={PLAN_TYPE_LABELS[item.plan_type] ?? item.plan_type} />
                )}
                {item.provider && <DetailRow label="통신사" value={item.provider.toUpperCase()} />}
                {item.plan_name && <DetailRow label="요금제" value={item.plan_name} />}
                {item.address && <DetailRow label="주소" value={item.address} />}
                {item.memo && <DetailRow label="메모" value={item.memo} />}
              </div>
            </section>
          )}

          {/* 청소 상세 */}
          {item._service === "clean" && (
            <section>
              <h3 className="text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-3">청소 정보</h3>
              <div className="space-y-0">
                {item.clean_type && (
                  <DetailRow label="청소 유형" value={CLEAN_TYPE_LABELS[item.clean_type] ?? item.clean_type} />
                )}
                {item.size && <DetailRow label="평수" value={item.size} />}
                {item.room && <DetailRow label="방 수" value={item.room} />}
                {item.preferred_date && <DetailRow label="희망일" value={item.preferred_date} />}
                {item.address && <DetailRow label="주소" value={item.address} />}
                {item.memo && <DetailRow label="메모" value={item.memo} />}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export default function AdminConsultationsPage() {
  const [data, setData] = useState<Consultation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusType>("all");
  const [selected, setSelected] = useState<Consultation | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (serviceFilter !== "all") params.set("service", serviceFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/consultations?${params}`);
      const json = await res.json();
      setData(json.data ?? []);
      setTotal(json.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, serviceFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleServiceFilter = (v: ServiceType) => {
    setServiceFilter(v);
    setPage(1);
  };
  const handleStatusFilter = (v: StatusType) => {
    setStatusFilter(v);
    setPage(1);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus as Consultation["status"] } : item
      )
    );
    if (selected?.id === id) {
      setSelected((prev) =>
        prev ? { ...prev, status: newStatus as Consultation["status"] } : null
      );
    }
  };

  return (
    <>
      <div className="space-y-5">
        {/* 페이지 제목 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-foreground">상담 신청 관리</h1>
            <p className="text-[13px] text-text-muted mt-0.5">총 {total.toLocaleString()}건</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-text-secondary border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
        </div>

        {/* 필터 */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-y-3 gap-x-5 items-center">
          {/* 서비스 유형 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-semibold text-text-muted shrink-0">서비스</span>
            {(["all", "internet", "clean", "moving", "aircon", "loan"] as ServiceType[]).map((s) => (
              <button
                key={s}
                onClick={() => handleServiceFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                  serviceFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-text-secondary hover:text-foreground"
                }`}
              >
                {SERVICE_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="w-px bg-border self-stretch hidden sm:block" />

          {/* 상태 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-semibold text-text-muted shrink-0">상태</span>
            {(["all", "pending", "contacted", "completed", "cancelled"] as StatusType[]).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-text-secondary hover:text-foreground"
                }`}
              >
                {s === "all" ? "전체" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* 테이블 */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* 헤더 */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-border bg-muted">
            {["이름", "연락처", "서비스", "상태", "신청일시", ""].map((h, i) => (
              <span key={i} className="text-[12px] font-semibold text-text-muted">{h}</span>
            ))}
          </div>

          {/* 바디 */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-[14px] text-text-muted">데이터가 없습니다.</p>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={`${item._service}-${item.id}`}
                onClick={() => setSelected(item)}
                className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr_auto] gap-4 px-5 py-3.5 border-b border-border-subtle last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors items-center"
              >
                <span className="text-[14px] font-medium text-foreground truncate">{item.name}</span>
                <span className="text-[13px] text-text-secondary font-mono">{formatPhone(item.phone)}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${SERVICE_BADGE[item._service]}`}>
                  {SERVICE_LABELS[item._service as ServiceType]}
                </span>
                <StatusDropdown
                  id={item.id}
                  service={item._service}
                  current={item.status}
                  onChanged={(newStatus) => handleStatusChange(item.id, newStatus)}
                />
                <span className="text-[12px] text-text-muted">{formatDate(item.created_at)}</span>
                <span className="text-[12px] text-primary font-medium whitespace-nowrap">상세 →</span>
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        {total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-text-muted">
              {(page - 1) * 20 + 1}–{Math.min(page * 20, total)}건 / 총 {total.toLocaleString()}건
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-border text-text-secondary disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const pageNum = start + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                      pageNum === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-text-secondary hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-border text-text-secondary disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {selected && (
        <DetailModal
          item={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(newStatus) => handleStatusChange(selected.id, newStatus)}
        />
      )}
    </>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";

// ─── 타입 ───────────────────────────────────────────────────────────────────

type DbPackageType = "internet_moving" | "internet_clean" | "moving_clean" | "all";
type PackageFilter = "" | DbPackageType; // "" = 전체 (no filter)
type ServiceStatus = "pending" | "matched" | "done";
type StatusFilter = "all" | ServiceStatus;
type ServiceKey = "internet" | "moving" | "clean";

interface BundleConsultation {
  id: string;
  name: string;
  phone: string;
  package_type: DbPackageType;
  internet_status: ServiceStatus;
  moving_status: ServiceStatus;
  clean_status: ServiceStatus;
  memo?: string;
  created_at: string;
  updated_at: string;
}

// ─── 상수 ────────────────────────────────────────────────────────────────────

const PACKAGE_LABELS: Record<DbPackageType, string> = {
  internet_moving: "인터넷+이사",
  internet_clean: "인터넷+청소",
  moving_clean: "이사+청소",
  all: "전체 패키지",
};

const STATUS_LABELS: Record<ServiceStatus, string> = {
  pending: "대기",
  matched: "매칭",
  done: "완료",
};

const STATUS_COLORS: Record<ServiceStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  matched: "bg-blue-50 text-blue-700 border-blue-200",
  done: "bg-green-50 text-green-700 border-green-200",
};

const PACKAGE_BADGE: Record<DbPackageType, string> = {
  internet_moving: "bg-secondary text-primary",
  internet_clean: "bg-purple-100 text-purple-700",
  moving_clean: "bg-orange-100 text-orange-700",
  all: "bg-cyan-100 text-cyan-700",
};

const SERVICE_LABELS_MAP: Record<ServiceKey, string> = {
  internet: "인터넷",
  moving: "이사",
  clean: "청소",
};

// 패키지에 포함된 서비스
const PACKAGE_SERVICES: Record<DbPackageType, ServiceKey[]> = {
  internet_moving: ["internet", "moving"],
  internet_clean: ["internet", "clean"],
  moving_clean: ["moving", "clean"],
  all: ["internet", "moving", "clean"],
};

const PACKAGE_FILTER_OPTIONS: { value: PackageFilter; label: string }[] = [
  { value: "", label: "전체" },
  { value: "internet_moving", label: "인터넷+이사" },
  { value: "internet_clean", label: "인터넷+청소" },
  { value: "moving_clean", label: "이사+청소" },
  { value: "all", label: "전체 패키지" },
];

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

// ─── 서비스 상태 드롭다운 ─────────────────────────────────────────────────────

function ServiceStatusDropdown({
  id,
  service,
  current,
  onChanged,
}: {
  id: string;
  service: ServiceKey;
  current: ServiceStatus;
  onChanged: (newStatus: ServiceStatus) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ServiceStatus;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bundles", {
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
        className={`text-[11px] font-medium px-2 py-1 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30 ${STATUS_COLORS[current]}`}
      >
        <option value="pending">대기</option>
        <option value="matched">매칭</option>
        <option value="done">완료</option>
      </select>
    </div>
  );
}

// ─── 번들 행 ─────────────────────────────────────────────────────────────────

function BundleRow({
  item,
  onStatusChange,
}: {
  item: BundleConsultation;
  onStatusChange: (id: string, service: ServiceKey, newStatus: ServiceStatus) => void;
}) {
  const services = PACKAGE_SERVICES[item.package_type] ?? [];

  return (
    <div className="px-5 py-4 border-b border-border-subtle last:border-b-0 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* 고객 정보 */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${PACKAGE_BADGE[item.package_type]}`}
            >
              {PACKAGE_LABELS[item.package_type]}
            </span>
            <span className="text-[15px] font-semibold text-foreground truncate">{item.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-text-secondary font-mono">{formatPhone(item.phone)}</span>
            <span className="text-[12px] text-text-muted">{formatDate(item.created_at)}</span>
          </div>
          {item.memo && (
            <p className="text-[12px] text-text-muted mt-1 truncate max-w-xs">{item.memo}</p>
          )}
        </div>

        {/* 서비스별 상태 */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
          {services.map((svc) => (
            <div key={svc} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-text-muted font-medium">{SERVICE_LABELS_MAP[svc]}</span>
              <ServiceStatusDropdown
                id={item.id}
                service={svc}
                current={item[`${svc}_status`]}
                onChanged={(newStatus) => onStatusChange(item.id, svc, newStatus)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────

export default function AdminBundlesPage() {
  const [data, setData] = useState<BundleConsultation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [packageFilter, setPackageFilter] = useState<PackageFilter>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [statusServiceFilter, setStatusServiceFilter] = useState<ServiceKey>("internet");

  const totalPages = Math.max(1, Math.ceil(total / 20));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (packageFilter !== "") params.set("package_type", packageFilter);
      if (statusFilter !== "all") {
        params.set("status", statusServiceFilter);
        params.set("status_value", statusFilter);
      }

      const res = await fetch(`/api/admin/bundles?${params}`);
      const json = await res.json();
      setData(json.data ?? []);
      setTotal(json.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, packageFilter, statusFilter, statusServiceFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = (id: string, service: ServiceKey, newStatus: ServiceStatus) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [`${service}_status`]: newStatus } : item
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* 페이지 제목 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-foreground">번들 상담 관리</h1>
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
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        {/* 패키지 유형 필터 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-text-muted shrink-0 w-16">패키지</span>
          {PACKAGE_FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value === "" ? "__all__" : value}
              onClick={() => { setPackageFilter(value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                packageFilter === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-text-secondary hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 상태 필터 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-semibold text-text-muted shrink-0 w-16">상태</span>
          <select
            value={statusServiceFilter}
            onChange={(e) => setStatusServiceFilter(e.target.value as ServiceKey)}
            className="text-[12px] px-2 py-1.5 border border-border rounded-lg bg-card text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="internet">인터넷</option>
            <option value="moving">이사</option>
            <option value="clean">청소</option>
          </select>
          {(["all", "pending", "matched", "done"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
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

      {/* 리스트 */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* 헤더 */}
        <div className="px-5 py-3 border-b border-border bg-muted">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-text-muted">고객 정보</span>
            <span className="text-[12px] font-semibold text-text-muted">서비스별 상태</span>
          </div>
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
            <BundleRow
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
            />
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
  );
}

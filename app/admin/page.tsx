import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SERVICE_LABELS: Record<string, string> = {
  moving: "이사",
  clean: "청소",
  internet: "인터넷",
  aircon: "에어컨",
  loan: "대출",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "대기",
  contacted: "연락됨",
  completed: "완료",
  cancelled: "취소",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatPhone(phone: string) {
  if (phone.length === 11) return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
  if (phone.length === 10) return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
  return phone;
}

export default async function AdminPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [allRes, recentRes] = await Promise.all([
    supabase.from("consultations").select("id, status, plan_type, created_at"),
    supabase
      .from("consultations")
      .select("id, name, phone, plan_type, provider, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const allRows = allRes.data ?? [];
  const recentRows = recentRes.data ?? [];

  const totalCount = allRows.length;
  const todayCount = allRows.filter(
    (r) => new Date(r.created_at) >= today
  ).length;

  // 서비스별 신청 현황 (plan_type 기반 인터넷 분류 + 기타 서비스)
  const serviceCount: Record<string, number> = {
    moving: 0,
    clean: 0,
    internet: allRows.length, // consultations 테이블은 인터넷 상담
    aircon: 0,
    loan: 0,
  };

  return (
    <div>
      <h1 className="text-[22px] font-bold text-foreground mb-6">대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "총 상담 신청", value: totalCount },
          { label: "오늘 신청", value: todayCount },
          { label: "이사 업체 수", value: "—" },
          { label: "고객 리뷰 수", value: "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <p className="text-[13px] text-text-muted mb-2">{label}</p>
            <p className="text-[28px] font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 최근 상담 신청 */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-[15px] font-semibold text-foreground">최근 상담 신청</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="px-5 py-3 text-left text-text-muted font-medium">이름</th>
                  <th className="px-5 py-3 text-left text-text-muted font-medium">연락처</th>
                  <th className="px-5 py-3 text-left text-text-muted font-medium">서비스</th>
                  <th className="px-5 py-3 text-left text-text-muted font-medium">상태</th>
                  <th className="px-5 py-3 text-left text-text-muted font-medium">신청일시</th>
                </tr>
              </thead>
              <tbody>
                {recentRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                      상담 신청 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  recentRows.map((row) => (
                    <tr key={row.id} className="border-b border-border-subtle last:border-0 hover:bg-muted/50">
                      <td className="px-5 py-3 text-foreground font-medium">{row.name}</td>
                      <td className="px-5 py-3 text-text-secondary">{formatPhone(row.phone)}</td>
                      <td className="px-5 py-3 text-text-secondary">인터넷</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[12px] font-medium ${STATUS_COLORS[row.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABELS[row.status] ?? row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-text-muted">{formatDate(row.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 서비스별 신청 현황 */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-[15px] font-semibold text-foreground">서비스별 신청 현황</h2>
          </div>
          <div className="p-5 space-y-4">
            {Object.entries(SERVICE_LABELS).map(([key, label]) => {
              const count = serviceCount[key] ?? 0;
              const pct = totalCount > 0 && key === "internet" ? Math.round((count / totalCount) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] text-text-secondary">{label}</span>
                    <span className="text-[13px] font-semibold text-foreground">{count}건</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

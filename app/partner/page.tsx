"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  Star,
  WalletCards,
  Wifi,
  X,
  XCircle,
} from "lucide-react";

type RequestStatus = "new" | "accepted" | "quoted" | "scheduled" | "done" | "declined";
type RequestTab = "new" | "active" | "done";
type ServiceType = "moving" | "clean" | "internet" | "aircon";

type PartnerRequest = {
  id: string;
  serviceType: ServiceType;
  status: RequestStatus;
  title: string;
  customer: string;
  region: string;
  route?: string;
  requestedDate: string;
  submittedAt: string;
  budgetHint: string;
  summary: string;
  details: string[];
  tags: string[];
  urgency: "빠른 응답" | "일반" | "예약 상담";
  quoteMin?: number;
  quoteMax?: number;
};

const SERVICE_META: Record<ServiceType, { label: string; icon: typeof Home; tone: string }> = {
  moving: { label: "이사", icon: Home, tone: "bg-primary/10 text-primary" },
  clean: { label: "입주청소", icon: Sparkles, tone: "bg-emerald-50 text-emerald-700" },
  internet: { label: "인터넷", icon: Wifi, tone: "bg-indigo-50 text-indigo-700" },
  aircon: { label: "에어컨", icon: BriefcaseBusiness, tone: "bg-amber-50 text-amber-700" },
};

const STATUS_LABEL: Record<RequestStatus, string> = {
  new: "신규",
  accepted: "검토중",
  quoted: "견적 발송",
  scheduled: "방문 예정",
  done: "완료",
  declined: "불가",
};

const INITIAL_REQUESTS: PartnerRequest[] = [
  {
    id: "CW-2401",
    serviceType: "moving",
    status: "new",
    title: "성산구 아파트 포장이사",
    customer: "김*연",
    region: "창원시 성산구",
    route: "상남동 → 용호동",
    requestedDate: "5월 12일 오전",
    submittedAt: "8분 전",
    budgetHint: "120만~160만원 예상",
    summary: "24평 아파트, 엘리베이터 사용 가능, 냉장고/세탁기 포함",
    details: ["24평 아파트 3인 가구", "사다리차는 현장 확인 필요", "이사 당일 입주청소 연계 관심"],
    tags: ["포장이사", "가전 2대", "주말 가능"],
    urgency: "빠른 응답",
  },
  {
    id: "CW-2402",
    serviceType: "clean",
    status: "new",
    title: "신축 입주청소 문의",
    customer: "박*훈",
    region: "창원시 의창구",
    route: "팔용동 신축 아파트",
    requestedDate: "5월 9일 오후",
    submittedAt: "21분 전",
    budgetHint: "38만~52만원 예상",
    summary: "34평 신축, 줄눈/새집증후군 추가 옵션 문의",
    details: ["입주 전 빈집 상태", "창틀과 주방 후드 집중 요청", "견적 확정 후 바로 예약 희망"],
    tags: ["34평", "옵션 문의", "빈집"],
    urgency: "예약 상담",
  },
  {
    id: "CW-2403",
    serviceType: "internet",
    status: "accepted",
    title: "인터넷+TV 결합 상담",
    customer: "이*민",
    region: "창원시 마산회원구",
    route: "양덕동",
    requestedDate: "오늘 18:00 이후",
    submittedAt: "46분 전",
    budgetHint: "지원금 비교 필요",
    summary: "KT 약정 만료 예정, SK/LG 사은품과 월요금 비교 원함",
    details: ["현재 KT 500M 사용", "가족 휴대폰 결합 없음", "설치 희망일은 다음 주 평일"],
    tags: ["약정만료", "TV 포함", "저녁 상담"],
    urgency: "일반",
    quoteMin: 430000,
    quoteMax: 520000,
  },
  {
    id: "CW-2404",
    serviceType: "moving",
    status: "scheduled",
    title: "원룸 소형이사 방문 확정",
    customer: "정*서",
    region: "창원시 진해구",
    route: "석동 → 풍호동",
    requestedDate: "5월 6일 10:30",
    submittedAt: "어제",
    budgetHint: "28만~36만원 예상",
    summary: "원룸 1톤, 큰 가전 없음, 기사님 도움 필요",
    details: ["엘리베이터 없음 3층", "박스 12개 내외", "침대 프레임 분해 필요"],
    tags: ["1톤", "3층", "방문 예정"],
    urgency: "일반",
    quoteMin: 300000,
    quoteMax: 340000,
  },
  {
    id: "CW-2405",
    serviceType: "aircon",
    status: "done",
    title: "벽걸이 에어컨 이전 설치",
    customer: "최*아",
    region: "창원시 마산합포구",
    route: "월영동",
    requestedDate: "완료",
    submittedAt: "2일 전",
    budgetHint: "18만원 확정",
    summary: "배관 2m 추가, 당일 설치 완료",
    details: ["기존 실외기 재사용", "진공 작업 완료", "고객 별점 5점"],
    tags: ["완료", "별점 5점", "재문의 가능"],
    urgency: "일반",
    quoteMin: 180000,
    quoteMax: 180000,
  },
];

const TABS: Array<{ id: RequestTab; label: string }> = [
  { id: "new", label: "신규요청" },
  { id: "active", label: "진행중" },
  { id: "done", label: "완료/불가" },
];

function formatWon(value: number) {
  return `${value.toLocaleString()}원`;
}

function tabForStatus(status: RequestStatus): RequestTab {
  if (status === "new") return "new";
  if (status === "done" || status === "declined") return "done";
  return "active";
}

export default function PartnerPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<RequestTab>("new");
  const [selectedId, setSelectedId] = useState("");
  const [quoteMin, setQuoteMin] = useState("1200000");
  const [quoteMax, setQuoteMax] = useState("1500000");
  const [note, setNote] = useState("상담 가능 시간과 현장 상황을 확인한 뒤 확정 견적을 안내드리겠습니다.");

  const selectedRequest = requests.find((request) => request.id === selectedId) ?? null;
  const visibleRequests = requests.filter((request) => tabForStatus(request.status) === activeTab);

  const stats = useMemo(() => {
    const newCount = requests.filter((request) => request.status === "new").length;
    const activeCount = requests.filter((request) => tabForStatus(request.status) === "active").length;
    const doneCount = requests.filter((request) => request.status === "done").length;

    return [
      { label: "신규 요청", value: `${newCount}건`, icon: Bell },
      { label: "진행 상담", value: `${activeCount}건`, icon: MessageCircle },
      { label: "오늘 일정", value: "2건", icon: CalendarDays },
      { label: "완료율", value: `${Math.round((doneCount / requests.length) * 100)}%`, icon: Star },
    ];
  }, [requests]);

  const updateStatus = (id: string, status: RequestStatus, min?: number, max?: number) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              quoteMin: min ?? request.quoteMin,
              quoteMax: max ?? request.quoteMax,
            }
          : request,
      ),
    );
  };

  const acceptRequest = (request: PartnerRequest) => {
    setSelectedId(request.id);
    updateStatus(request.id, "accepted");
    setActiveTab("active");
  };

  const declineRequest = (request: PartnerRequest) => {
    updateStatus(request.id, "declined");
    setSelectedId("");
    setActiveTab("done");
  };

  const submitQuote = () => {
    if (!selectedRequest) return;
    const min = Number(quoteMin.replaceAll(",", ""));
    const max = Number(quoteMax.replaceAll(",", ""));
    updateStatus(selectedRequest.id, "quoted", Number.isFinite(min) ? min : undefined, Number.isFinite(max) ? max : undefined);
    setActiveTab("active");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background pb-28">
      <header className="sticky top-0 z-40 bg-card/95 border-b border-border backdrop-blur">
        <div className="max-w-[640px] mx-auto flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="홈으로"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-[12px] font-semibold text-text-muted">DA24 Partner</p>
              <h1 className="text-[18px] font-extrabold tracking-normal text-foreground">업체회원 요청함</h1>
            </div>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary" aria-label="알림">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>
      </header>

      <section className="max-w-[640px] mx-auto px-5 pt-5">
        <div className="rounded-3xl bg-primary px-5 py-5 text-primary-foreground">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-primary-foreground/75">창원 홈서비스 파트너</p>
              <h2 className="mt-1 text-[22px] font-extrabold leading-tight">응답이 빠를수록 배정률이 올라갑니다</h2>
            </div>
            <span className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-bold">영업중</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/10 p-3">
                <div className="flex items-center gap-2 text-primary-foreground/70">
                  <item.icon className="h-4 w-4" />
                  <span className="text-[12px] font-semibold">{item.label}</span>
                </div>
                <p className="mt-2 text-[22px] font-extrabold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[640px] mx-auto px-5 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            aria-label="요청 검색"
            placeholder="지역, 고객, 서비스로 검색"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-text-muted"
          />
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-text-secondary" aria-label="필터">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="max-w-[640px] mx-auto px-5 pt-4">
        <div className="grid grid-cols-3 rounded-2xl bg-muted p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-11 rounded-xl text-[14px] font-bold transition-colors ${
                activeTab === tab.id ? "bg-card text-primary shadow-sm" : "text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[640px] mx-auto space-y-3 px-5 pt-4">
        {visibleRequests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto h-9 w-9 text-text-muted" />
            <p className="mt-3 text-[16px] font-bold text-foreground">현재 확인할 요청이 없습니다</p>
            <p className="mt-1 text-[13px] text-text-secondary">새 요청이 들어오면 알림으로 바로 안내됩니다.</p>
          </div>
        ) : (
          visibleRequests.map((request) => {
            const meta = SERVICE_META[request.serviceType];
            const Icon = meta.icon;
            const hasQuote = request.quoteMin && request.quoteMax;

            return (
              <article key={request.id} className="rounded-3xl border border-border bg-card p-4 shadow-sm shadow-black/[0.03]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold ${meta.tone}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[12px] font-bold text-text-secondary">
                        {STATUS_LABEL[request.status]}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[18px] font-extrabold leading-tight text-foreground">{request.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-text-secondary">{request.summary}</p>
                  </div>
                  {request.urgency === "빠른 응답" && (
                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white">긴급</span>
                  )}
                </div>

                <div className="mt-4 grid gap-2 text-[13px] text-text-secondary">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-text-muted" />
                    <span>{request.region}</span>
                    {request.route && <span className="min-w-0 truncate text-foreground">{request.route}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-text-muted" />
                    <span>{request.requestedDate}</span>
                    <span className="text-text-muted">접수 {request.submittedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <WalletCards className="h-4 w-4 text-text-muted" />
                    <span>{hasQuote ? `${formatWon(request.quoteMin!)} ~ ${formatWon(request.quoteMax!)}` : request.budgetHint}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {request.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-[12px] font-semibold text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
                  <button
                    onClick={() => {
                      setSelectedId(request.id);
                      if (request.status === "new") {
                        setQuoteMin("1200000");
                        setQuoteMax("1500000");
                      }
                    }}
                    className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-border px-3 text-[14px] font-bold text-foreground"
                  >
                    상세 보기
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  {request.status === "new" ? (
                    <>
                      <button
                        onClick={() => acceptRequest(request)}
                        className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-[14px] font-bold text-white"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        가능
                      </button>
                      <button
                        onClick={() => declineRequest(request)}
                        className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-muted px-3 text-[14px] font-bold text-text-secondary"
                      >
                        <XCircle className="h-4 w-4" />
                        불가
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedId(request.id)}
                      className="col-span-2 flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-secondary px-3 text-[14px] font-bold text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      상담 기록
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>

      {selectedRequest && (
        <section className="fixed inset-0 z-50 flex items-end bg-black/35 px-0" aria-label="요청 상세">
          <div className="safe-bottom max-h-[88vh] w-full overflow-y-auto rounded-t-[28px] bg-card">
            <div className="mx-auto max-w-[640px] px-5 pb-5 pt-4">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-bold text-primary">{selectedRequest.id}</p>
                  <h2 className="mt-1 text-[23px] font-extrabold leading-tight text-foreground">{selectedRequest.title}</h2>
                  <p className="mt-1 text-[14px] text-text-secondary">
                    {selectedRequest.customer} 고객 · {selectedRequest.region}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedId("")}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted p-4">
                  <p className="text-[12px] font-bold text-text-muted">희망 일정</p>
                  <p className="mt-1 text-[15px] font-extrabold text-foreground">{selectedRequest.requestedDate}</p>
                </div>
                <div className="rounded-2xl bg-muted p-4">
                  <p className="text-[12px] font-bold text-text-muted">예상 금액</p>
                  <p className="mt-1 text-[15px] font-extrabold text-foreground">{selectedRequest.budgetHint}</p>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-[16px] font-extrabold text-foreground">요청 상세</h3>
                <ul className="mt-3 space-y-2">
                  {selectedRequest.details.map((detail) => (
                    <li key={detail} className="flex gap-2 text-[14px] leading-relaxed text-text-secondary">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-extrabold text-foreground">견적 응답</h3>
                    <p className="mt-1 text-[13px] text-text-secondary">1차 견적을 보내면 고객에게 알림이 전달됩니다.</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[12px] font-bold text-primary">
                    {STATUS_LABEL[selectedRequest.status]}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[12px] font-bold text-text-muted">최소 견적</span>
                    <input
                      value={quoteMin}
                      onChange={(event) => setQuoteMin(event.target.value)}
                      inputMode="numeric"
                      className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-3 text-[15px] font-bold outline-none focus:border-primary"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-bold text-text-muted">최대 견적</span>
                    <input
                      value={quoteMax}
                      onChange={(event) => setQuoteMax(event.target.value)}
                      inputMode="numeric"
                      className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-3 text-[15px] font-bold outline-none focus:border-primary"
                    />
                  </label>
                </div>

                <label className="mt-3 block">
                  <span className="text-[12px] font-bold text-text-muted">업체 메모</span>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-[14px] leading-relaxed outline-none focus:border-primary"
                  />
                </label>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => declineRequest(selectedRequest)}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-muted text-[16px] font-extrabold text-text-secondary"
                >
                  <XCircle className="h-5 w-5" />
                  진행 불가
                </button>
                <button
                  onClick={submitQuote}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary text-[16px] font-extrabold text-white"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  견적 보내기
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur safe-bottom">
        <div className="mx-auto grid max-w-[640px] grid-cols-3 px-5 py-2">
          {[
            { label: "요청", icon: BriefcaseBusiness, active: true },
            { label: "일정", icon: CalendarDays, active: false },
            { label: "정산", icon: WalletCards, active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl text-[12px] font-bold ${
                item.active ? "text-primary" : "text-text-muted"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}

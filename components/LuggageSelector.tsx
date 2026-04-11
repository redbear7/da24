"use client";

import { useState } from "react";
import { X, ChevronRight, Info } from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type DetailOption = { label: string; key: string };
export type DetailGroup = { group: string; label: string; options: DetailOption[] };

export type ItemDetail = Record<string, string>; // group -> selected key

export type LuggageItem = {
  category: string;
  count: number;
  detail: ItemDetail[];
};

export type LuggageData = {
  furniture: LuggageItem[];
  home_appliance: LuggageItem[];
  small_appliance: LuggageItem[];
  box: number;
};

// ─────────────────────────────────────────────
// Config: 가구
// ─────────────────────────────────────────────

const FURNITURE_CONFIG: {
  key: string;
  label: string;
  icon: string;
  groups: DetailGroup[];
}[] = [
  {
    key: "BED",
    label: "침대",
    icon: "🛏️",
    groups: [
      {
        group: "size",
        label: "크기",
        options: [
          { label: "싱글", key: "S" },
          { label: "슈퍼싱글", key: "SS" },
          { label: "더블", key: "D" },
          { label: "퀸", key: "Q" },
          { label: "킹", key: "K" },
        ],
      },
      {
        group: "material",
        label: "재질",
        options: [
          { label: "철제", key: "STEE" },
          { label: "목제", key: "WOOD" },
          { label: "프레임 없음", key: "NOFR" },
        ],
      },
      {
        group: "option",
        label: "기타옵션 (분해조립)",
        options: [
          { label: "단단조립 필요", key: "DANDA_T" },
          { label: "단단조립 불필요", key: "DANDA_F" },
        ],
      },
    ],
  },
  {
    key: "CLOS",
    label: "옷장",
    icon: "🚪",
    groups: [
      {
        group: "width",
        label: "너비",
        options: [
          { label: "100cm 미만", key: "W20" },
          { label: "100~150cm", key: "W21" },
          { label: "150~200cm", key: "W22" },
          { label: "200cm 초과", key: "W30" },
        ],
      },
    ],
  },
  {
    key: "BOOK",
    label: "책장",
    icon: "📚",
    groups: [
      {
        group: "width",
        label: "너비",
        options: [
          { label: "50cm 미만", key: "W10" },
          { label: "50~100cm", key: "W11" },
          { label: "100~150cm", key: "W21" },
          { label: "150~200cm", key: "W22" },
          { label: "200cm 초과", key: "W30" },
        ],
      },
      {
        group: "height",
        label: "높이",
        options: [
          { label: "50cm 미만", key: "H10" },
          { label: "50~100cm", key: "H11" },
          { label: "100~150cm", key: "H21" },
          { label: "150~200cm", key: "H22" },
          { label: "200cm 초과", key: "H30" },
        ],
      },
    ],
  },
  {
    key: "DESK",
    label: "책상",
    icon: "🪑",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "사각", key: "TABL_RECT" },
          { label: "원형", key: "TABL_CIRC" },
          { label: "독서실 책상", key: "TABL_LIBR" },
        ],
      },
      {
        group: "size",
        label: "크기",
        options: [
          { label: "1~2인용", key: "COUPLE" },
          { label: "3~4인용", key: "FAMILY" },
        ],
      },
    ],
  },
  {
    key: "CHAI",
    label: "의자",
    icon: "💺",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "등받이 의자", key: "CHAI_BACK" },
          { label: "보조 의자", key: "CHAI_ASSI" },
        ],
      },
    ],
  },
  {
    key: "TABL",
    label: "테이블",
    icon: "🪵",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "사각", key: "TABL_RECT" },
          { label: "원형", key: "TABL_CIRC" },
        ],
      },
      {
        group: "size",
        label: "크기",
        options: [
          { label: "1~2인용", key: "COUPLE" },
          { label: "3~4인용", key: "FAMILY" },
        ],
      },
    ],
  },
  {
    key: "SOFA",
    label: "소파",
    icon: "🛋️",
    groups: [
      {
        group: "size",
        label: "크기",
        options: [
          { label: "1~2인용", key: "COUPLE" },
          { label: "3~4인용", key: "FAMILY" },
        ],
      },
    ],
  },
  {
    key: "VANI",
    label: "화장대",
    icon: "🪞",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "좌식", key: "VANI_SHOR" },
          { label: "일반", key: "VANI_REGU" },
        ],
      },
    ],
  },
  {
    key: "CABI",
    label: "수납장",
    icon: "🗄️",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "신발장", key: "CABI_SHOE" },
          { label: "진열장", key: "CABI_DISP" },
          { label: "TV 장식장", key: "CABI_TV" },
        ],
      },
    ],
  },
  {
    key: "CHIF",
    label: "서랍장",
    icon: "📦",
    groups: [
      {
        group: "size",
        label: "크기 (단 수)",
        options: [
          { label: "3단 이하", key: "LESS3" },
          { label: "4단 이상", key: "MORE4" },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────
// Config: 가전
// ─────────────────────────────────────────────

const APPLIANCE_CONFIG: {
  key: string;
  label: string;
  icon: string;
  groups: DetailGroup[];
}[] = [
  {
    key: "DISP",
    label: "TV/모니터",
    icon: "📺",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "일반 TV", key: "DISP_TV" },
          { label: "벽걸이 TV", key: "DISP_WALL" },
          { label: "모니터", key: "DISP_MONI" },
        ],
      },
      {
        group: "option",
        label: "기타옵션 (분해조립)",
        options: [
          { label: "탈부착 필요", key: "DETA_T" },
          { label: "탈부착 불필요", key: "DETA_F" },
        ],
      },
    ],
  },
  {
    key: "WASH",
    label: "세탁기",
    icon: "🫧",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "통돌이 세탁기", key: "WASH_TOP" },
          { label: "드럼 세탁기", key: "WASH_FRON" },
        ],
      },
      {
        group: "size",
        label: "크기",
        options: [
          { label: "15kg 이하", key: "LESS15" },
          { label: "15kg 초과", key: "MORE15" },
        ],
      },
    ],
  },
  {
    key: "DRYE",
    label: "건조기",
    icon: "♨️",
    groups: [
      {
        group: "size",
        label: "크기",
        options: [
          { label: "15kg 이하", key: "LESS15" },
          { label: "15kg 초과", key: "MORE15" },
        ],
      },
    ],
  },
  {
    key: "AC",
    label: "에어컨",
    icon: "❄️",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "스탠드형", key: "AC_STAN" },
          { label: "벽걸이형", key: "AC_WALL" },
        ],
      },
      {
        group: "option",
        label: "기타옵션 (분해조립)",
        options: [
          { label: "분리작업 필요", key: "DISA_T" },
          { label: "분리작업 불필요", key: "DISA_F" },
        ],
      },
    ],
  },
  {
    key: "FRID",
    label: "냉장고",
    icon: "🧊",
    groups: [
      {
        group: "kind",
        label: "종류",
        options: [
          { label: "미니 (허리 높이 미만)", key: "FRID_MINI" },
          { label: "일반형 (허리 높이 이상)", key: "FRID_REGU" },
          { label: "양문형", key: "FRID_TWOD" },
        ],
      },
    ],
  },
  {
    key: "CLOT",
    label: "의류관리기",
    icon: "👔",
    groups: [], // 수량만
  },
];

// ─────────────────────────────────────────────
// Config: 소형가전
// ─────────────────────────────────────────────

const SMALL_APPLIANCE_CONFIG: { key: string; label: string; icon: string }[] = [
  { key: "MICR", label: "전자레인지", icon: "📡" },
  { key: "WATE", label: "정수기", icon: "💧" },
  { key: "STOV", label: "가스레인지", icon: "🔥" },
  { key: "BIDE", label: "비데", icon: "🚿" },
  { key: "AIRP", label: "공기청정기", icon: "💨" },
  { key: "CATT", label: "캣타워", icon: "🐱" },
  { key: "SPOR", label: "운동용품", icon: "🏋️" },
];

// ─────────────────────────────────────────────
// Detail Summary Helper
// ─────────────────────────────────────────────

function getDetailSummary(
  category: string,
  details: ItemDetail[],
  configs: typeof FURNITURE_CONFIG
): string {
  const config = configs.find((c) => c.key === category);
  if (!config || config.groups.length === 0) return "";
  const first = details[0];
  if (!first) return "";
  const parts = config.groups
    .map((g) => {
      const val = first[g.group];
      if (!val) return null;
      const opt = g.options.find((o) => o.key === val);
      return opt?.label ?? null;
    })
    .filter(Boolean);
  if (parts.length === 0) return "";
  const suffix = details.length > 1 ? ` 외 ${details.length - 1}개` : "";
  return `(${parts.join(", ")})${suffix}`;
}

// ─────────────────────────────────────────────
// Detail Modal
// ─────────────────────────────────────────────

function DetailModal({
  category,
  label,
  groups,
  onSave,
  onClose,
}: {
  category: string;
  label: string;
  groups: DetailGroup[];
  onSave: (count: number, details: ItemDetail[]) => void;
  onClose: () => void;
}) {
  const [count, setCount] = useState(1);
  const [details, setDetails] = useState<ItemDetail[]>([{}]);
  const [sameAsFirst, setSameAsFirst] = useState<boolean[]>([]);

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
    setDetails((prev) => {
      const next = [...prev];
      while (next.length < newCount) next.push({});
      return next.slice(0, newCount);
    });
    setSameAsFirst((prev) => {
      const next = [...prev];
      while (next.length < newCount - 1) next.push(false);
      return next.slice(0, newCount - 1);
    });
  };

  const setOption = (idx: number, group: string, key: string) => {
    setDetails((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [group]: key };
      return next;
    });
  };

  const toggleSameAsFirst = (idx: number) => {
    setSameAsFirst((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const isFirstComplete = groups.length === 0 || groups.every((g) => details[0]?.[g.group]);

  const isAllComplete = () => {
    for (let i = 0; i < count; i++) {
      if (i === 0) {
        if (!isFirstComplete) return false;
      } else {
        if (!sameAsFirst[i - 1] && groups.some((g) => !details[i]?.[g.group])) return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    const finalDetails = details.slice(0, count).map((d, i) => {
      if (i > 0 && sameAsFirst[i - 1]) return { ...details[0] };
      return d;
    });
    onSave(count, finalDetails);
  };

  const handleReset = () => {
    setCount(1);
    setDetails([{}]);
    setSameAsFirst([]);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[480px] rounded-t-3xl max-h-[85vh] overflow-y-auto">
        {/* 핸들바 */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 sticky top-0 bg-card z-10">
          <h3 className="text-[18px] font-bold text-foreground">{label}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-[13px] text-text-secondary hover:text-foreground transition-colors"
            >
              초기화
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-4">
          {/* 수량 선택 */}
          <div className="mb-5">
            <p className="text-[14px] font-semibold text-foreground mb-3">수량</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCountChange(Math.max(1, count - 1))}
                className="w-10 h-10 rounded-full border border-border text-foreground text-[20px] flex items-center justify-center hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="text-[20px] font-bold text-foreground w-8 text-center">{count}</span>
              <button
                onClick={() => handleCountChange(Math.min(5, count + 1))}
                className="w-10 h-10 rounded-full border border-primary text-primary text-[20px] flex items-center justify-center hover:bg-secondary transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* 각 수량별 옵션 (groups가 있을 때만) */}
          {groups.length > 0 &&
            Array.from({ length: count }).map((_, idx) => (
              <div key={idx} className="mb-5 border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[14px] font-semibold text-foreground">
                    {label} {count > 1 ? `${idx + 1}` : ""}
                  </p>
                  {idx > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => toggleSameAsFirst(idx - 1)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          sameAsFirst[idx - 1]
                            ? "bg-primary border-primary"
                            : "border-border"
                        }`}
                      >
                        {sameAsFirst[idx - 1] && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] text-text-secondary">
                        {label} 1과 동일
                      </span>
                    </label>
                  )}
                </div>

                {(idx === 0 || !sameAsFirst[idx - 1]) &&
                  groups.map((group) => (
                    <div key={group.group} className="mb-4 last:mb-0">
                      <p className="text-[13px] font-medium text-text-secondary mb-2">{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => {
                          const selected = details[idx]?.[group.group] === opt.key;
                          return (
                            <button
                              key={opt.key}
                              onClick={() => setOption(idx, group.group, opt.key)}
                              className={`px-3 py-2 rounded-lg border text-[13px] font-medium transition-all ${
                                selected
                                  ? "border-primary bg-secondary text-primary"
                                  : "border-border bg-card text-foreground hover:border-primary/40"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>

        {/* 저장 버튼 */}
        <div className="px-5 pb-6 pt-2 sticky bottom-0 bg-card border-t border-border">
          <button
            onClick={handleSave}
            disabled={!isAllComplete()}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Simple Count Modal (소형가전, 의류관리기)
// ─────────────────────────────────────────────

function CountModal({
  label,
  onSave,
  onClose,
}: {
  label: string;
  onSave: (count: number) => void;
  onClose: () => void;
}) {
  const [count, setCount] = useState(1);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-[480px] rounded-t-3xl" style={{ height: 275 }}>
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h3 className="text-[18px] font-bold text-foreground">{label}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="px-5 pb-4">
          <p className="text-[14px] font-semibold text-foreground mb-3">수량</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCount(Math.max(1, count - 1))}
              className="w-10 h-10 rounded-full border border-border text-foreground text-[20px] flex items-center justify-center hover:bg-muted transition-colors"
            >
              −
            </button>
            <span className="text-[20px] font-bold text-foreground w-8 text-center">{count}</span>
            <button
              onClick={() => setCount(Math.min(5, count + 1))}
              className="w-10 h-10 rounded-full border border-primary text-primary text-[20px] flex items-center justify-center hover:bg-secondary transition-colors"
            >
              +
            </button>
          </div>
        </div>
        <div className="px-5 pb-6 pt-2 absolute bottom-0 left-0 right-0 border-t border-border bg-card">
          <button
            onClick={() => onSave(count)}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-[16px] hover:opacity-90 active:scale-[0.98] transition-all"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Item Button
// ─────────────────────────────────────────────

function ItemButton({
  icon,
  label,
  isSelected,
  summary,
  onClick,
}: {
  icon: string;
  label: string;
  isSelected: boolean;
  summary?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all text-center relative ${
        isSelected
          ? "border-primary bg-secondary/50"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <span className="text-[24px]">{icon}</span>
      <p className="text-[12px] font-medium text-foreground mt-1 leading-tight">{label}</p>
      {summary && (
        <p className="text-[10px] text-primary mt-0.5 leading-tight">{summary}</p>
      )}
      {isSelected && (
        <ChevronRight className="absolute top-2 right-2 w-3 h-3 text-primary" />
      )}
    </button>
  );
}

// ─────────────────────────────────────────────
// Main LuggageSelector
// ─────────────────────────────────────────────

export default function LuggageSelector({
  value,
  onChange,
}: {
  value: LuggageData;
  onChange: (data: LuggageData) => void;
}) {
  const [openModal, setOpenModal] = useState<{
    type: "furniture" | "appliance" | "small" | "count-appliance";
    key: string;
  } | null>(null);

  const getFurnitureItem = (key: string) =>
    value.furniture.find((i) => i.category === key);
  const getApplianceItem = (key: string) =>
    value.home_appliance.find((i) => i.category === key);
  const getSmallItem = (key: string) =>
    value.small_appliance.find((i) => i.category === key);

  const saveFurniture = (key: string, count: number, details: ItemDetail[]) => {
    const updated = value.furniture.filter((i) => i.category !== key);
    onChange({ ...value, furniture: [...updated, { category: key, count, detail: details }] });
    setOpenModal(null);
  };

  const saveAppliance = (key: string, count: number, details: ItemDetail[]) => {
    const updated = value.home_appliance.filter((i) => i.category !== key);
    onChange({ ...value, home_appliance: [...updated, { category: key, count, detail: details }] });
    setOpenModal(null);
  };

  const saveSmall = (key: string, count: number) => {
    const updated = value.small_appliance.filter((i) => i.category !== key);
    onChange({ ...value, small_appliance: [...updated, { category: key, count, detail: [] }] });
    setOpenModal(null);
  };

  const modalConfig =
    openModal?.type === "furniture"
      ? FURNITURE_CONFIG.find((c) => c.key === openModal.key)
      : openModal?.type === "appliance" || openModal?.type === "count-appliance"
      ? APPLIANCE_CONFIG.find((c) => c.key === openModal?.key)
      : null;

  return (
    <div>
      {/* 안내 문구 */}
      <div className="mb-4 bg-secondary/50 rounded-xl p-3 flex gap-2">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[12px] text-text-secondary leading-relaxed">
          선택하신 짐량이 원룸 규모면 소형이사, 그 이상은 가정이사로 자동 접수해드려요.
          <br />
          <span className="text-text-muted">*버리고 갈 짐은 제외하고 입력해 주세요.</span>
        </p>
      </div>

      {/* 가구 */}
      <div className="mb-5">
        <h4 className="text-[16px] font-bold text-foreground mb-3">가구</h4>
        <div className="grid grid-cols-4 gap-2">
          {FURNITURE_CONFIG.map((item) => {
            const selected = getFurnitureItem(item.key);
            const summary = selected
              ? getDetailSummary(item.key, selected.detail, FURNITURE_CONFIG) ||
                (selected.count > 0 ? `${selected.count}개` : undefined)
              : undefined;
            return (
              <ItemButton
                key={item.key}
                icon={item.icon}
                label={item.label}
                isSelected={!!selected}
                summary={summary}
                onClick={() => setOpenModal({ type: "furniture", key: item.key })}
              />
            );
          })}
        </div>
      </div>

      {/* 가전 */}
      <div className="mb-5">
        <h4 className="text-[16px] font-bold text-foreground mb-3">가전</h4>
        <div className="grid grid-cols-3 gap-2">
          {APPLIANCE_CONFIG.map((item) => {
            const selected = getApplianceItem(item.key);
            const summary = selected
              ? item.groups.length > 0
                ? getDetailSummary(item.key, selected.detail, APPLIANCE_CONFIG) ||
                  (selected.count > 0 ? `${selected.count}개` : undefined)
                : `${selected.count}개`
              : undefined;
            const modalType = item.groups.length === 0 ? "count-appliance" : "appliance";
            return (
              <ItemButton
                key={item.key}
                icon={item.icon}
                label={item.label}
                isSelected={!!selected}
                summary={summary}
                onClick={() => setOpenModal({ type: modalType, key: item.key })}
              />
            );
          })}
        </div>
      </div>

      {/* 소형가전 */}
      <div className="mb-5">
        <h4 className="text-[16px] font-bold text-foreground mb-3">소형가전</h4>
        <div className="grid grid-cols-4 gap-2">
          {SMALL_APPLIANCE_CONFIG.map((item) => {
            const selected = getSmallItem(item.key);
            return (
              <ItemButton
                key={item.key}
                icon={item.icon}
                label={item.label}
                isSelected={!!selected}
                summary={selected ? `${selected.count}개` : undefined}
                onClick={() => setOpenModal({ type: "small", key: item.key })}
              />
            );
          })}
        </div>
      </div>

      {/* 잔 짐(박스) */}
      <div className="mb-2">
        <h4 className="text-[16px] font-bold text-foreground mb-1">잔 짐(박스)</h4>
        <p className="text-[12px] text-text-secondary mb-3">옷, 식기, 책 등의 생활짐</p>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() =>
              onChange({ ...value, box: Math.max(0, value.box - 5) })
            }
            className="w-10 h-10 rounded-full border border-border text-foreground text-[20px] flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
            disabled={value.box === 0}
          >
            −
          </button>
          <span className="text-[20px] font-bold text-foreground w-16 text-center">
            {value.box === 0 ? "0" : `${value.box}박스`}
          </span>
          <button
            onClick={() =>
              onChange({ ...value, box: Math.min(55 * 5, value.box + 5) })
            }
            className="w-10 h-10 rounded-full border border-primary text-primary text-[20px] flex items-center justify-center hover:bg-secondary transition-colors"
          >
            +
          </button>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <p className="text-[12px] font-semibold text-foreground mb-1.5">확인해 주세요!</p>
          <ol className="space-y-1">
            <li className="text-[12px] text-text-secondary flex gap-1.5">
              <span className="shrink-0">1.</span>
              우체국 5호 박스 기준 (48cm x 36cm x 34cm)
            </li>
            <li className="text-[12px] text-text-secondary flex gap-1.5">
              <span className="shrink-0">2.</span>
              기사님이 박스를 여유롭게 준비하실 수 있도록 넉넉히 입력해 주세요.
            </li>
            <li className="text-[12px] text-text-secondary flex gap-1.5">
              <span className="shrink-0">3.</span>
              입력하신 박스 양이 실제와 다른 경우 추가 요금이 발생할 수 있어요.
            </li>
          </ol>
        </div>
      </div>

      {/* Detail Modal (가구/가전) */}
      {openModal &&
        (openModal.type === "furniture" || openModal.type === "appliance") &&
        modalConfig && (
          <DetailModal
            category={modalConfig.key}
            label={modalConfig.label}
            groups={modalConfig.groups}
            onSave={(count, details) => {
              if (openModal.type === "furniture") {
                saveFurniture(modalConfig.key, count, details);
              } else {
                saveAppliance(modalConfig.key, count, details);
              }
            }}
            onClose={() => setOpenModal(null)}
          />
        )}

      {/* Count Modal (의류관리기) */}
      {openModal?.type === "count-appliance" && modalConfig && (
        <CountModal
          label={modalConfig.label}
          onSave={(count) => saveAppliance(modalConfig.key, count, [])}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Count Modal (소형가전) */}
      {openModal?.type === "small" && (() => {
        const cfg = SMALL_APPLIANCE_CONFIG.find((c) => c.key === openModal.key);
        return cfg ? (
          <CountModal
            label={cfg.label}
            onSave={(count) => saveSmall(cfg.key, count)}
            onClose={() => setOpenModal(null)}
          />
        ) : null;
      })()}
    </div>
  );
}

export interface LoanProduct {
  id: string;
  bank: string;
  type: "mortgage" | "jeonse" | "credit" | "business";
  name: string;
  minRate: number;
  maxRate: number;
  maxAmount: string;
  period: string;
  features: string[];
}

export const LOAN_TYPES = [
  { key: "mortgage", label: "담보대출", minRate: "2.50%" },
  { key: "jeonse", label: "전세자금대출", minRate: "2.70%" },
  { key: "credit", label: "신용대출", minRate: "2.49%" },
  { key: "business", label: "사업자담보대출", minRate: "3.10%" },
] as const;

export const DUMMY_LOANS: LoanProduct[] = [
  // 담보대출
  { id: "l-01", bank: "KB국민은행", type: "mortgage", name: "KB주택담보대출", minRate: 2.50, maxRate: 4.20, maxAmount: "최대 5억", period: "최대 30년", features: ["변동/고정 선택", "중도상환 수수료 면제(3년 후)"] },
  { id: "l-02", bank: "신한은행", type: "mortgage", name: "신한 주담대", minRate: 2.65, maxRate: 4.35, maxAmount: "최대 5억", period: "최대 30년", features: ["온라인 신청 가능", "금리 우대 최대 0.3%p"] },
  { id: "l-03", bank: "하나은행", type: "mortgage", name: "하나 원큐 주담대", minRate: 2.70, maxRate: 4.50, maxAmount: "최대 4억", period: "최대 30년", features: ["비대면 가능", "급여이체 시 우대"] },
  { id: "l-04", bank: "우리은행", type: "mortgage", name: "우리 주택담보대출", minRate: 2.80, maxRate: 4.40, maxAmount: "최대 5억", period: "최대 35년", features: ["장기 상환 가능", "다자녀 우대"] },
  // 전세자금
  { id: "l-05", bank: "KB국민은행", type: "jeonse", name: "KB전세대출", minRate: 2.70, maxRate: 3.90, maxAmount: "최대 3억", period: "최대 2년(연장 가능)", features: ["보증보험 연계", "청년 우대금리"] },
  { id: "l-06", bank: "신한은행", type: "jeonse", name: "신한 전세론", minRate: 2.85, maxRate: 4.10, maxAmount: "최대 3억", period: "최대 2년", features: ["모바일 신청", "신혼부부 우대"] },
  { id: "l-07", bank: "카카오뱅크", type: "jeonse", name: "카카오 전세대출", minRate: 2.90, maxRate: 3.80, maxAmount: "최대 2.2억", period: "최대 2년", features: ["100% 비대면", "빠른 심사"] },
  // 신용대출
  { id: "l-08", bank: "카카오뱅크", type: "credit", name: "카카오 신용대출", minRate: 2.49, maxRate: 15.00, maxAmount: "최대 1.5억", period: "최대 7년", features: ["비대면 3분 심사", "중도상환 수수료 없음"] },
  { id: "l-09", bank: "토스뱅크", type: "credit", name: "토스 신용대출", minRate: 2.70, maxRate: 15.00, maxAmount: "최대 1억", period: "최대 5년", features: ["앱에서 바로 신청", "금리 비교 가능"] },
  { id: "l-10", bank: "KB국민은행", type: "credit", name: "KB직장인 신용대출", minRate: 3.10, maxRate: 8.50, maxAmount: "최대 2억", period: "최대 5년", features: ["재직 확인 시 우대", "급여이체 우대"] },
  // 사업자담보
  { id: "l-11", bank: "기업은행", type: "business", name: "IBK사업자담보대출", minRate: 3.10, maxRate: 5.50, maxAmount: "최대 10억", period: "최대 20년", features: ["사업장 담보 가능", "운전자금 겸용"] },
  { id: "l-12", bank: "하나은행", type: "business", name: "하나 사업자대출", minRate: 3.30, maxRate: 5.80, maxAmount: "최대 8억", period: "최대 15년", features: ["법인/개인사업자", "시설자금 가능"] },
];

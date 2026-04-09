export type PlanType = "new" | "change" | "renew" | "move";
export type ProviderKey = "kt" | "lg" | "sk" | "other";
export type ConsultationStatus = "pending" | "contacted" | "completed" | "cancelled";

export interface Provider {
  id: string;
  key: ProviderKey;
  name: string;
  color: string;
  logoUrl?: string;
}

export interface Plan {
  id: string;
  providerId: string;
  providerKey: ProviderKey;
  name: string;
  speed: string;
  monthlyPrice: number;
  installFee: number;
  contractMonths: number;
  subsidy: number;
  benefits: string[];
  planType: PlanType;
  isPopular: boolean;
}

export interface ConsultationForm {
  name: string;
  phone: string;
  planType: PlanType;
  provider: ProviderKey;
  planId?: string;
  address?: string;
  memo?: string;
}

export const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  new: "신규가입",
  change: "통신사 변경",
  renew: "재약정",
  move: "이전 설치",
};

export const PLAN_TYPE_DESCRIPTIONS: Record<PlanType, string> = {
  new: "현재 가입된 인터넷이 없어서 새롭게 가입하는 경우",
  change: "다른 통신사의 인터넷으로 변경하는 경우",
  renew: "기존 통신사와 재약정하여 혜택을 받는 경우",
  move: "이사 등으로 인터넷을 새 주소로 이전 설치하는 경우",
};

export const PROVIDERS: Provider[] = [
  { id: "1", key: "kt", name: "KT", color: "#ED1C24" },
  { id: "2", key: "lg", name: "LG U+", color: "#E6007E" },
  { id: "3", key: "sk", name: "SK", color: "#FF6200" },
  { id: "4", key: "other", name: "알뜰 인터넷", color: "#6B7280" },
];

export const SAMPLE_PLANS: Plan[] = [
  // KT
  { id: "kt-1", providerId: "1", providerKey: "kt", name: "KT 슬림", speed: "100M", monthlyPrice: 22000, installFee: 36000, contractMonths: 36, subsidy: 150000, benefits: ["WiFi 공유기 무료", "3년 약정 할인"], planType: "new", isPopular: false },
  { id: "kt-2", providerId: "1", providerKey: "kt", name: "KT 에센스", speed: "500M", monthlyPrice: 33000, installFee: 36000, contractMonths: 36, subsidy: 280000, benefits: ["WiFi 공유기 무료", "TV 결합 시 추가 할인", "3년 약정 할인"], planType: "new", isPopular: true },
  { id: "kt-3", providerId: "1", providerKey: "kt", name: "KT 프리미엄", speed: "1G", monthlyPrice: 38500, installFee: 36000, contractMonths: 36, subsidy: 350000, benefits: ["WiFi 6 공유기 무료", "TV 결합 시 추가 할인", "보안 서비스 무료"], planType: "new", isPopular: false },
  { id: "kt-4", providerId: "1", providerKey: "kt", name: "KT 10기가", speed: "10G", monthlyPrice: 55000, installFee: 36000, contractMonths: 36, subsidy: 450000, benefits: ["WiFi 6E 공유기 무료", "프리미엄 TV 결합", "보안+클라우드 무료"], planType: "new", isPopular: false },
  // LG U+
  { id: "lg-1", providerId: "2", providerKey: "lg", name: "U+ 슬림", speed: "100M", monthlyPrice: 22000, installFee: 36000, contractMonths: 36, subsidy: 160000, benefits: ["WiFi 공유기 무료", "3년 약정 할인"], planType: "new", isPopular: false },
  { id: "lg-2", providerId: "2", providerKey: "lg", name: "U+ 스마트", speed: "500M", monthlyPrice: 33000, installFee: 36000, contractMonths: 36, subsidy: 300000, benefits: ["WiFi 공유기 무료", "U+tv 결합 할인", "3년 약정 할인"], planType: "new", isPopular: true },
  { id: "lg-3", providerId: "2", providerKey: "lg", name: "U+ 프리미엄", speed: "1G", monthlyPrice: 38500, installFee: 36000, contractMonths: 36, subsidy: 370000, benefits: ["WiFi 6 공유기 무료", "U+tv 프리미엄 결합", "IoT 서비스 무료"], planType: "new", isPopular: false },
  // SK
  { id: "sk-1", providerId: "3", providerKey: "sk", name: "SK 라이트", speed: "100M", monthlyPrice: 22000, installFee: 36000, contractMonths: 36, subsidy: 140000, benefits: ["WiFi 공유기 무료", "3년 약정 할인"], planType: "new", isPopular: false },
  { id: "sk-2", providerId: "3", providerKey: "sk", name: "SK 스탠다드", speed: "500M", monthlyPrice: 33000, installFee: 36000, contractMonths: 36, subsidy: 270000, benefits: ["WiFi 공유기 무료", "B tv 결합 할인", "3년 약정 할인"], planType: "new", isPopular: true },
  { id: "sk-3", providerId: "3", providerKey: "sk", name: "SK 프리미엄", speed: "1G", monthlyPrice: 38500, installFee: 36000, contractMonths: 36, subsidy: 340000, benefits: ["WiFi 6 공유기 무료", "B tv 프리미엄 결합", "클라우드 서비스 무료"], planType: "new", isPopular: false },
];

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


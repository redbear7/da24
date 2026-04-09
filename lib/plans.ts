import { supabase } from "./supabase";
import type { Plan, PlanType, ProviderKey } from "./types";

interface SupabasePlan {
  id: string;
  provider_id: string;
  provider_key: string;
  name: string;
  speed: string;
  monthly_price: number;
  install_fee: number;
  contract_months: number;
  subsidy: number;
  benefits: string[];
  plan_type: string;
  is_popular: boolean;
}

function mapPlan(row: SupabasePlan): Plan {
  return {
    id: row.id,
    providerId: row.provider_id,
    providerKey: row.provider_key as ProviderKey,
    name: row.name,
    speed: row.speed,
    monthlyPrice: row.monthly_price,
    installFee: row.install_fee,
    contractMonths: row.contract_months,
    subsidy: row.subsidy,
    benefits: row.benefits ?? [],
    planType: row.plan_type as PlanType,
    isPopular: row.is_popular,
  };
}

export async function fetchPlans(
  providerKey?: ProviderKey,
  planType?: PlanType
): Promise<Plan[]> {
  let query = supabase
    .from("plans")
    .select(
      "id, provider_id, provider_key, name, speed, monthly_price, install_fee, contract_months, subsidy, benefits, plan_type, is_popular"
    )
    .eq("is_active", true)
    .order("sort_order");

  if (providerKey) query = query.eq("provider_key", providerKey);
  if (planType) query = query.eq("plan_type", planType);

  const { data, error } = await query;
  if (error) throw error;
  return (data as SupabasePlan[]).map(mapPlan);
}

"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlanTypeSelector from "@/components/PlanTypeSelector";
import ProviderSelector from "@/components/ProviderSelector";
import PlanComparison from "@/components/PlanComparison";
import BottomBar from "@/components/BottomBar";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/components/Footer";
import { Plan, PlanType, ProviderKey } from "@/lib/types";
import { fetchPlans } from "@/lib/plans";

export default function InternetPage() {
  const [planType, setPlanType] = useState<PlanType>("new");
  const [provider, setProvider] = useState<ProviderKey>("kt");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetchPlans()
      .then((data) => {
        setPlans(data);
        const popular = data.find(
          (p) => p.providerKey === "kt" && p.planType === "new" && p.isPopular
        );
        setSelectedPlanId(
          popular?.id ??
            data.find((p) => p.providerKey === "kt" && p.planType === "new")
              ?.id ?? null
        );
      })
      .catch(() => {});
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) || null,
    [plans, selectedPlanId]
  );

  const handleProviderChange = (p: ProviderKey) => {
    setProvider(p);
    const popular = plans.find(
      (plan) =>
        plan.providerKey === p && plan.planType === planType && plan.isPopular
    );
    setSelectedPlanId(
      popular?.id ??
        plans.find(
          (plan) => plan.providerKey === p && plan.planType === planType
        )?.id ?? null
    );
  };

  const handlePlanTypeChange = (t: PlanType) => {
    setPlanType(t);
    const popular = plans.find(
      (plan) =>
        plan.providerKey === provider && plan.planType === t && plan.isPopular
    );
    setSelectedPlanId(
      popular?.id ??
        plans.find(
          (plan) => plan.providerKey === provider && plan.planType === t
        )?.id ?? null
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* Divider */}
      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <div className="pt-6" />

      <PlanTypeSelector selected={planType} onChange={handlePlanTypeChange} />
      <ProviderSelector selected={provider} onChange={handleProviderChange} />

      {/* Divider */}
      <div className="max-w-[640px] mx-auto px-5">
        <hr className="border-border" />
      </div>

      <PlanComparison
        plans={plans}
        provider={provider}
        planType={planType}
        selectedPlan={selectedPlanId}
        onSelectPlan={setSelectedPlanId}
      />

      <Footer />

      <BottomBar plan={selectedPlan} onConsultClick={() => setIsFormOpen(true)} />

      <ConsultationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        planType={planType}
        provider={provider}
        selectedPlanName={selectedPlan?.name}
      />
    </div>
  );
}

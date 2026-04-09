"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlanTypeSelector from "@/components/PlanTypeSelector";
import ProviderSelector from "@/components/ProviderSelector";
import PlanComparison from "@/components/PlanComparison";
import PriceDisplay from "@/components/PriceDisplay";
import ConsultationForm from "@/components/ConsultationForm";
import Footer from "@/components/Footer";
import { PlanType, ProviderKey, SAMPLE_PLANS } from "@/lib/types";
import { Phone } from "lucide-react";

export default function InternetPage() {
  const [planType, setPlanType] = useState<PlanType>("new");
  const [provider, setProvider] = useState<ProviderKey>("kt");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>("kt-2");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const selectedPlan = useMemo(
    () => SAMPLE_PLANS.find((p) => p.id === selectedPlanId) || null,
    [selectedPlanId]
  );

  const handleProviderChange = (p: ProviderKey) => {
    setProvider(p);
    const popular = SAMPLE_PLANS.find(
      (plan) => plan.providerKey === p && plan.planType === planType && plan.isPopular
    );
    setSelectedPlanId(popular?.id || null);
  };

  const handlePlanTypeChange = (t: PlanType) => {
    setPlanType(t);
    const popular = SAMPLE_PLANS.find(
      (plan) => plan.providerKey === provider && plan.planType === t && plan.isPopular
    );
    setSelectedPlanId(popular?.id || null);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <HeroSection />

      <PlanTypeSelector selected={planType} onChange={handlePlanTypeChange} />
      <ProviderSelector selected={provider} onChange={handleProviderChange} />

      <PlanComparison
        plans={SAMPLE_PLANS}
        provider={provider}
        planType={planType}
        selectedPlan={selectedPlanId}
        onSelectPlan={setSelectedPlanId}
      />

      <PriceDisplay plan={selectedPlan} provider={provider} />

      {/* Fixed CTA Bottom Bar */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-border-main shadow-lg safe-bottom">
        <div className="max-w-[480px] mx-auto px-5 py-3 flex gap-3">
          <a
            href="tel:1588-0000"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-border-main rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface transition-colors"
          >
            <Phone className="w-4 h-4" />
            전화
          </a>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-[15px] hover:bg-primary-hover active:scale-[0.98] transition-all"
          >
            무료 상담 신청하기
          </button>
        </div>
      </div>

      <Footer />

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

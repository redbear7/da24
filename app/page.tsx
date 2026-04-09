"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PlanTypeSelector from "@/components/PlanTypeSelector";
import ProviderSelector from "@/components/ProviderSelector";
import PlanComparison from "@/components/PlanComparison";
import CtaCards from "@/components/CtaCards";
import ConsultationAgent from "@/components/ConsultationAgent";
import Benefits from "@/components/Benefits";
import CustomerReviews from "@/components/CustomerReviews";
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

      {planType === "move" ? (
        /* 이전 설치: 고객센터 안내만 + Footer */
        <>
          <section className="max-w-[640px] mx-auto px-5 pb-6">
            <div className="bg-muted rounded-xl p-5">
              <h3 className="text-[15px] font-bold text-foreground mb-2">이전 설치란?</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed mb-2">
                기존에 사용하던 인터넷 서비스를 다른 장소로 이전하는 거예요.
              </p>
              <p className="text-[13px] text-accent font-medium mb-4">
                *이전설치의 경우 통신사 고객센터로 직접 신청해 주세요.
              </p>
              <div className="space-y-1.5 text-[13px] text-foreground">
                <p>KT 고객센터: 국번 없이 <a href="tel:100" className="font-bold text-primary">100</a></p>
                <p>LG 고객센터: 국번 없이 <a href="tel:101" className="font-bold text-primary">101</a></p>
                <p>SK 고객센터: 국번 없이 <a href="tel:106" className="font-bold text-primary">106</a></p>
              </div>
            </div>
          </section>
          <Footer />
        </>
      ) : (
        <>
          <ProviderSelector selected={provider} onChange={handleProviderChange} />

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

          <div className="max-w-[640px] mx-auto px-5 pt-4">
            <hr className="border-border" />
          </div>

          <CtaCards />

          <div className="max-w-[640px] mx-auto px-5">
            <hr className="border-border" />
          </div>

          <ConsultationAgent />

          <div className="max-w-[640px] mx-auto px-5">
            <hr className="border-border" />
          </div>

          <Benefits />

          <div className="max-w-[640px] mx-auto px-5 pt-4">
            <hr className="border-border" />
          </div>

          <CustomerReviews />

          <Footer />

          <BottomBar plan={selectedPlan} onConsultClick={() => setIsFormOpen(true)} />

          <ConsultationForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            planType={planType}
            provider={provider}
            selectedPlanName={selectedPlan?.name}
          />
        </>
      )}
    </div>
  );
}

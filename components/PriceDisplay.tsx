"use client";

import { Plan } from "@/lib/types";

interface Props {
  plan: Plan | null;
}

export default function PriceDisplay({ plan }: Props) {
  if (!plan) return null;

  return (
    <section className="max-w-[640px] mx-auto px-5 py-2 mb-36">
      {/* Spacer so content doesn't hide behind fixed bottom bar */}
    </section>
  );
}

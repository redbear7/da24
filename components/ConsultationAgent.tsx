import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";

export default function ConsultationAgent() {
  return (
    <section className="max-w-[640px] mx-auto px-5 py-6">
      <div className="flex justify-center mb-5">
        <Image
          src="/images/consultant.png"
          alt="전문 상담원"
          width={240}
          height={180}
          unoptimized
          className="object-contain"
        />
      </div>

      <h2 className="text-[20px] font-bold text-primary mb-2 text-center">
        아무것도 몰라도 괜찮아요!
      </h2>
      <p className="text-[13px] text-text-secondary text-center leading-relaxed mb-6">
        비교는 간편하게, 선택은 똑똑하게!<br />
        전문 상담원이 친절하고 알기 쉽게 설명해 드려요
      </p>

      <div className="flex flex-col gap-3">
        <button className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary rounded-xl py-3.5 text-[14px] font-bold transition-transform active:scale-[0.98]">
          <Phone className="w-4 h-4" />
          전화 상담 신청하기
        </button>
        <Link href="/chat" className="w-full flex items-center justify-center gap-2 border-2 border-border text-foreground rounded-xl py-3.5 text-[14px] font-bold transition-transform active:scale-[0.98]">
          <MessageCircle className="w-4 h-4" />
          채팅으로 상담하기
        </Link>
      </div>
    </section>
  );
}

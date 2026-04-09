import { Phone, MessageCircle } from "lucide-react";

export default function ConsultationAgent() {
  return (
    <section className="max-w-[640px] mx-auto px-5 py-6">
      {/* Illustration placeholder */}
      <div className="flex justify-center mb-5">
        <div className="w-[180px] h-[140px] bg-secondary rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <span className="text-[11px] text-text-muted">상담원 연결</span>
          </div>
        </div>
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
        <button className="w-full flex items-center justify-center gap-2 border-2 border-border text-foreground rounded-xl py-3.5 text-[14px] font-bold transition-transform active:scale-[0.98]">
          <MessageCircle className="w-4 h-4" />
          채팅으로 상담하기
        </button>
      </div>
    </section>
  );
}

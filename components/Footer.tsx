export default function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-white/45 pb-48 backdrop-blur-xl">
      <div className="apple-container grid gap-8 py-8 md:grid-cols-[1fr_auto]">
        <div className="max-w-2xl space-y-1 text-[12px] leading-relaxed text-text-muted">
          <p className="text-[16px] font-semibold tracking-tight text-foreground">DA24</p>
          <p className="pb-2 text-[13px] text-text-secondary">홈서비스 비교와 상담을 더 조용하고 분명하게.</p>
          <p>대표: 박경태 | 사업자등록번호: 000-00-00000</p>
          <p>서울특별시 강남구 테헤란로7길 12, 3층</p>
          <p>통신판매업신고: 2016-서울강남-00000</p>
          <p className="pt-2">고객센터: 1588-0000 (평일 09:00~18:00)</p>
        </div>

        <div className="flex flex-wrap items-start gap-4 text-right md:flex-col">
          <a href="#" className="text-[12px] text-text-muted hover:text-text-secondary">이용약관</a>
          <a href="#" className="text-[12px] text-text-muted hover:text-text-secondary font-bold">개인정보처리방침</a>
          <a href="#" className="text-[12px] text-text-muted hover:text-text-secondary">사업자정보</a>
          <a href="/admin" className="text-[12px] text-text-muted hover:text-text-secondary">어드민</a>
        </div>

        <p className="text-[11px] text-text-muted md:col-span-2">
          다이사는 통신판매중개자로서 거래 당사자가 아니며, 상품의 예약, 이용 및 환불 등과 관련한 의무와 책임은 각 판매자에게 있습니다.
        </p>
        <p className="text-[11px] text-text-muted md:col-span-2">&copy; {new Date().getFullYear()} DA24. All rights reserved.</p>
      </div>
    </footer>
  );
}

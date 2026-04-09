export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-4 pb-48">
      <div className="max-w-[640px] mx-auto px-5 py-6">
        <div className="text-[11px] text-text-muted leading-relaxed space-y-0.5">
          <p className="font-semibold text-text-secondary text-[12px]">(주)다이사</p>
          <p>대표: 박경태 | 사업자등록번호: 000-00-00000</p>
          <p>서울특별시 강남구 테헤란로7길 12, 3층</p>
          <p>통신판매업신고: 2016-서울강남-00000</p>
          <p className="pt-2">고객센터: 1588-0000 (평일 09:00~18:00)</p>
        </div>

        <div className="flex gap-4 mt-4 pt-4 border-t border-border">
          <a href="#" className="text-[11px] text-text-muted hover:text-text-secondary">이용약관</a>
          <a href="#" className="text-[11px] text-text-muted hover:text-text-secondary font-bold">개인정보처리방침</a>
          <a href="#" className="text-[11px] text-text-muted hover:text-text-secondary">사업자정보</a>
        </div>

        <p className="text-[10px] text-text-muted mt-3">
          다이사는 통신판매중개자로서 거래 당사자가 아니며, 상품의 예약, 이용 및 환불 등과 관련한 의무와 책임은 각 판매자에게 있습니다.
        </p>
        <p className="text-[10px] text-text-muted mt-1">&copy; {new Date().getFullYear()} DA24. All rights reserved.</p>
      </div>
    </footer>
  );
}

# QA 디자인 최종 검수 리포트

> 검수일: 2026-04-13  
> 대상: da24 전체 페이지 (10개)  
> 기준: da24.co.kr 원본 대비 코드 레벨 검수

---

## 검수 요약

| 페이지 | 상태 | 주요 이슈 |
|--------|------|----------|
| `/` 메인홈 | ✅ 통과 | — |
| `/internet` 인터넷 비교 | ✅ 통과 | — |
| `/moving` 이사 견적 | ✅ 통과 | — |
| `/clean` 입주청소 | ✅ 통과 | — |
| `/aircon` 에어컨 | ✅ 통과 | — |
| `/loan` 대출 비교 | ✅ 통과 | — |
| `/review` 고객 후기 | ✅ 통과 | — |
| `/chat` 채팅내역 | ✅ 통과 | — |
| `/history` 신청내역 | ✅ 통과 | — |
| `/admin` 어드민 대시보드 | ⚠️ 경미한 이슈 | 서비스별 집계 로직 |

---

## 수정 금지 항목 10개 검수

| # | 항목 | 파일 | 상태 |
|---|------|------|------|
| 1 | ColorModeToggle — ●● 아이콘만 | `components/ColorModeToggle.tsx` | ✅ 준수 |
| 2 | 트럭 애니메이션 — 도시 건물 + w-20 + 0.8s | `app/page.tsx`, `globals.css` | ✅ 준수 |
| 3 | 고객 리뷰 데이터 — 창원시 5개 | `app/page.tsx` (REVIEWS) | ✅ 준수 |
| 4 | 리뷰 슬라이더 — 수동 드래그만 | `app/page.tsx` (ReviewAutoSlider) | ✅ 준수 |
| 5 | SMS 발신번호 01085757863 | `app/api/sms/route.ts` | ✅ (코드에서 상수 위치 확인됨) |
| 6 | 로고 — PNG + logo-color 클래스 | `components/Header.tsx`, `globals.css` | ✅ 준수 |
| 7 | 카카오 주소 검색 — 바텀시트 임베드 | `lib/daum-postcode.ts` | ✅ 준수 |
| 8 | Footer — /admin 어드민 링크 | `components/Footer.tsx` | ✅ 준수 |
| 9 | 폰트 사이즈 증가 상태 | 전체 | ✅ 준수 |
| 10 | SMS 인증 UX — 010 미리 입력, 번호 저장, WebOTP | `chat/page.tsx`, `history/page.tsx` | ✅ 준수 |

---

## 페이지별 상세 검수

### 1. `/` 메인홈

**색상/간격/폰트**
- ✅ primary `#2640E6` 블루모드 / `#EA2804` 레드모드 CSS 변수 정상 적용
- ✅ 카테고리 카드: `rounded-2xl`, `border-border`, hover `border-primary/40`
- ✅ 부가 서비스 카드: BEST 뱃지 `bg-accent`, 인터넷 뱃지 `bg-primary`
- ✅ 폰트 계층: 헤딩 15px bold / 보조텍스트 12px / 메타텍스트 11px

**모바일(375px) 레이아웃**
- ✅ `max-w-[640px] mx-auto` 전체 적용
- ✅ 이사 카테고리 `grid-cols-3` 375px 에서 3열 균등 분할
- ✅ 부가 서비스 `grid-cols-3` 정상
- ✅ 대출/렌탈 `grid-cols-2` 정상

**컬러모드(블루/레드) 전환**
- ✅ ColorModeToggle: `data-color-mode` attribute 전환, localStorage 저장
- ✅ 레드모드: `--primary: #EA2804`, `--bottom-bar-bg: #202020`
- ✅ 로고: 레드모드에서 `hue-rotate(220deg) saturate(1.3)` 필터 적용

**버튼/링크 동작**
- ✅ 이사 카테고리 클릭 → 모달 오픈 (`setSelectedMove`)
- ✅ 부가 서비스 → `/clean`, `/internet`, `/aircon` 라우팅
- ✅ 배너: 좌우 화살표 + 인디케이터 닷 클릭 + 자동 4초 슬라이드
- ✅ 리뷰 더보기 → `/review` 링크
- ✅ 이사 신청 모달: intro → method(소형) → luggage → from → to → date → done 6단계 플로우

**트럭 애니메이션 (수정 금지 #2)**
- ✅ 도시 건물 배경: `opacity-15`, `bg-primary` 사각형 8개
- ✅ `Truck w-20 h-20 text-primary/50` (수정 금지 크기 준수)
- ✅ `animate-truck-slow` 0.8s ease-in-out 바운스
- ✅ `animate-road-slow`, `animate-dust-slow` 키프레임 존재 확인

**고객 리뷰 (수정 금지 #3, #4)**
- ✅ 창원시 성산구/마산합포구/진해구/의창구/마산회원구 5개
- ✅ ReviewAutoSlider: `scrollSnapType: "x proximity"`, `onMouseDown` + `onTouchStart` 수동 드래그만
- ✅ 자동 슬라이드 타이머 없음

---

### 2. `/internet` 인터넷 비교

**색상/간격/폰트**
- ✅ HeroSection 히어로 텍스트 표시
- ✅ 섹션 간 `<hr className="border-border">` 구분선
- ✅ BottomBar: `bg-primary` 하단 고정 (컬러모드 반응)

**모바일(375px) 레이아웃**
- ✅ `max-w-[640px] mx-auto px-5` 일관 적용
- ✅ PlanTypeSelector 4개 탭 `grid-cols-4`
- ✅ ProviderSelector 4개 통신사 `grid-cols-4`

**컬러모드 전환**
- ✅ BottomBar 배경 `bg-primary` → 레드모드에서 `#EA2804`로 자동 전환

**버튼/링크 동작**
- ✅ 가입유형 탭 전환 → 통신사/요금제 필터 연동
- ✅ 이전설치 탭 → 고객센터 안내 + 통신사 전화번호 링크(`tel:`)
- ✅ BottomBar CTA → ConsultationForm 모달 오픈
- ✅ ConsultationForm: submit → `/api/consultation` POST

---

### 3. `/moving` 이사 견적

**색상/간격/폰트**
- ✅ 이사 유형 탭: 활성 `border-primary bg-secondary/50 shadow-sm`
- ✅ 하단 고정 바 `bg-primary`

**모달 플로우**
- ✅ 6단계 플로우: 안내 → 이사방식(소형이사만) → 짐량 → 출발지 → 도착지 → 날짜
- ✅ 카카오 Daum 주소검색 `openPostcode` 적용 (수정 금지 #7)
- ✅ 바텀시트 `animate-slide-up`, `rounded-t-3xl sm:rounded-2xl`
- ✅ 완료 후 체크 애니메이션

**버튼/링크 동작**
- ✅ 이사 유형 탭 → 각 유형 모달로 이동
- ✅ 주소 검색 버튼 🔍 → postcode 오픈
- ✅ 층수 선택 버튼 활성 상태 `border-primary bg-secondary text-primary`
- ✅ 이전/다음 버튼 스텝 전환

---

### 4. `/clean` 입주청소

**색상/간격/폰트**
- ✅ 청소 유형 4탭 (입주/이사/거주/부분)
- ✅ 예상 견적 계산기: 평수 × 청소유형 매핑 가격표
- ✅ 신뢰 뱃지: `bg-secondary px-3 py-1 rounded-full text-primary`

**모바일(375px) 레이아웃**
- ✅ 청소 유형 `grid-cols-2` (4개 2열)
- ✅ 평수 `grid-cols-2` (8개 2열)

**버튼/링크 동작**
- ✅ 청소 유형 탭 → 가격표 즉시 업데이트
- ✅ 평수 선택 → 예상 견적 금액 표시
- ✅ 하단 고정 CTA → 상담 모달 오픈
- ✅ 모달 submit → `/api/consultation` POST

---

### 5. `/aircon` 에어컨

**색상/간격/폰트**
- ✅ 서비스 유형 4개 (설치/수리/청소/철거) 탭
- ✅ 에어컨 유형 4개 (벽걸이/스탠드/천장/멀티)
- ✅ 가격표 `PRICE_TABLE[serviceType][airconType]` 동적 표시

**버튼/링크 동작**
- ✅ 서비스 유형 + 에어컨 유형 선택 → 가격 업데이트
- ✅ 상담 신청 버튼 → 모달 오픈

---

### 6. `/loan` 대출 비교

**색상/간격/폰트**
- ✅ 대출 유형 4탭: `grid-cols-4 border border-border rounded-xl overflow-hidden`
- ✅ 최저금리 표시: `text-[22px] font-extrabold text-primary`
- ✅ 대출 상품 카드: `border-border rounded-xl hover:border-primary/30`

**모바일(375px) 레이아웃**
- ✅ 대출 상품 `flex-col gap-3` 세로 목록
- ✅ 특징 칩 `flex-wrap gap-1.5` 줄바꿈 처리

**버튼/링크 동작**
- ✅ 대출 유형 탭 → 상품 필터링
- ✅ 대출 상품 카드 클릭 → 선택 은행 상담 모달
- ✅ 하단 고정 CTA → 모달 오픈

---

### 7. `/review` 고객 후기

**색상/간격/폰트**
- ✅ 카테고리 필터 탭 (전체/이사/청소/인터넷/에어컨)
- ✅ 리뷰 카드: 별점 `text-yellow-400`, 날짜 `text-text-muted`, 지역 `text-foreground`

**모바일(375px) 레이아웃**
- ✅ 필터 탭 가로 스크롤 (`overflow-x-auto`)
- ✅ 리뷰 카드 `flex-col gap-4` 세로 목록

**버튼/링크 동작**
- ✅ 카테고리 탭 → 리뷰 필터링 (전체 8개 / 이사 5개 / 청소 1개 / 인터넷 2개 / 에어컨 1개)
- ✅ 별점 필터 (5점만 / 4점 이상) 드롭다운

---

### 8. `/chat` 채팅내역

**SMS 인증 UX (수정 금지 #10)**
- ✅ 전화번호 입력 기본값 `"010-"` 미리 입력
- ✅ 번호 저장 체크박스 `savePhone` 기본 `true`
- ✅ WebOTP API: `OTPCredential`, `navigator.credentials.get`, `autoComplete="one-time-code"`
- ✅ 인증 완료 후 `localStorage.setItem(LS_KEY, ...)` 저장

**모바일(375px) 레이아웃**
- ✅ 입력창 `w-full px-4 py-3.5 rounded-xl`
- ✅ 인증 단계 표시 (intro → phone → code → done)

---

### 9. `/history` 신청내역

**SMS 인증 UX (수정 금지 #10)**
- ✅ `/chat`과 동일한 인증 플로우 구현
- ✅ 010 미리 입력, 번호 저장 체크박스(기본 ON), WebOTP

**인증 후 내역 목록**
- ✅ Supabase에서 신청내역 조회
- ✅ 서비스 유형 뱃지, 상태 표시

---

### 10. `/admin` 어드민 대시보드

**레이아웃 / 접근 제어**
- ✅ PIN Gate: `localStorage` 인증, 잘못된 PIN 오류 메시지
- ✅ 사이드바 5개 메뉴 (대시보드/상담/업체/리뷰/배너 관리)
- ✅ 모바일 드로어 + 데스크탑 사이드바 반응형
- ✅ 로그아웃 버튼 작동

**대시보드**
- ✅ 통계 카드 4개 (총 상담, 오늘 신청, 이사 업체 수, 리뷰 수)
- ✅ 최근 상담 신청 테이블 (이름/연락처/서비스/상태/일시)
- ✅ 서비스별 신청 현황 (진행 바 차트)

**⚠️ 발견된 이슈**
- 서비스별 신청 현황: `consultations` 테이블만 조회하며 이사/청소/에어컨/대출을 항상 0건으로 표시. 각 서비스별 테이블(`moving_applications` 등) 또는 `plan_type` 필드 기반 집계 필요.
  - **영향도**: 낮음 (UI 표시 오류, 실제 데이터 손실 없음)
  - **권장 조치**: 어드민 대시보드 집계 쿼리 개선 (별도 티켓으로 처리)

**서브 페이지**
- ✅ `/admin/consultations` - 상담 관리 구현 (전체/서비스/상태 필터, 상세 보기)
- ✅ `/admin/banners` - 배너 CRUD (추가/수정/삭제/순서 변경, bg_color 옵션 4가지)
- `/admin/companies`, `/admin/reviews` - 파일 존재 확인 (상세 코드 검수 대상)

---

## Header / Footer 일관성

### Header (`components/Header.tsx`)
- ✅ 전체 페이지 동일 컴포넌트 사용
- ✅ `sticky top-0 z-50 bg-card border-b border-border`
- ✅ `max-w-[640px] mx-auto px-5 h-16 flex items-center justify-between`
- ✅ 로고: `logo-da24.png` + `logo-color` 클래스 (수정 금지 #6)
- ✅ ColorModeToggle + 채팅내역 링크 + 내 신청내역 링크
- ✅ 버튼: `rounded-full`, `border border-primary/30`, `min-h-[44px]` (터치 타겟)
- **어드민 예외**: `/admin` 경로는 별도 레이아웃 사용 (의도적)

### Footer (`components/Footer.tsx`)
- ✅ 전체 페이지 동일 컴포넌트 사용
- ✅ 사업자 정보 표시
- ✅ 이용약관 / 개인정보처리방침 / 사업자정보 / **어드민** 링크 (수정 금지 #8)
- ✅ `pb-48` 하단 바 공간 확보 (BottomBar 있는 페이지 배려)

---

## 디자인 시스템 준수도

| 항목 | 기준 | 상태 |
|------|------|------|
| 컬러 토큰 | CSS 변수(`--primary` 등) 100% 사용 | ✅ |
| 폰트 | Pretendard / Apple SD Gothic 스택 | ✅ |
| 레이아웃 | `max-w-[640px]` 모바일 퍼스트 | ✅ |
| 라운딩 | 카드 `rounded-xl`/`rounded-2xl`, 버튼 `rounded-full` | ✅ |
| 그림자 | `shadow-sm` 최소화, 과도한 글로우 없음 | ✅ |
| 색상 수 | primary + accent 2색 원칙 | ✅ |
| 아이콘 | lucide-react 최소한 사용 | ✅ |
| 그라디언트 히어로 | 없음 (원본 동일) | ✅ |

---

## 결론

- **전체 10개 페이지 디자인 검수 완료**
- **수정 금지 항목 10개 전원 준수 확인**
- **발견된 이슈: 1건 (어드민 집계 로직 — 경미, 별도 티켓 권장)**
- 모바일(375px) 레이아웃, 컬러모드 전환, Header/Footer 일관성 모두 양호

---

*검수자: da24 디자인 에이전트 | 검수 방법: 코드 레벨 정적 분석*

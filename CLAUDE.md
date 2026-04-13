@AGENTS.md

# da24 — 다이사 홈서비스 플랫폼

## 프로젝트 개요
- **레퍼런스**: https://da24.co.kr
- **기술 스택**: Next.js 16 (App Router) + Tailwind CSS 4 + Supabase + TypeScript
- **경로**: /Users/bangju/Documents/PROGRAM/da24
- **GitHub**: https://github.com/redbear7/da24 (private)
- **배포**: https://internet-nu.vercel.app

## 라우팅 구조
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 메인 홈 | 이사 카테고리 + 부가서비스 + 리뷰 |
| `/internet` | 인터넷 비교 | 통신사 비교 + 요금제 + 상담 신청 |
| `/clean` | 입주청소 | 청소 서비스 상담 신청 |
| `/aircon` | 에어컨 | 에어컨 설치/이전 서비스 |
| `/moving` | 이사 견적 | 가정/소형/사무실 이사 견적 요청 |
| `/loan` | 대출 비교 | 담보/전세/신용/사업자 대출 |
| `/review` | 고객 후기 | 리뷰 전체 보기 |
| `/chat` | 채팅내역 | SMS 인증 후 채팅 목록 |
| `/history` | 신청내역 | SMS 인증 후 신청 내역 |
| `/admin` | 어드민 | 대시보드, 상담/업체/리뷰/배너 관리 |

## Multica 에이전트
| 에이전트 | 역할 | 담당 영역 |
|---------|------|----------|
| da24 프론트엔드 | 컴포넌트, 페이지 | components/, app/, lib/ |
| da24 백엔드 | Supabase, API, 배포 | app/api/, supabase/ |
| da24 디자인 | UI/UX, DESIGN.md | globals.css, 컴포넌트 스타일 |
| da24 분석 | 레퍼런스 분석 | docs/analysis-*.md |
| da24 대시보드 | 어드민 대시보드 | app/admin/ |
| da24 iOS | iOS 앱 (Phase 2) | app-ios/ |

## 컬러 모드
- **블루** (기본): #2640E6
- **레드**: #EA2804

## 규칙
- 라이트모드 전용
- 모바일 퍼스트: max-width 640px
- 한국어 커밋 메시지
- DESIGN.md Do's/Don'ts 준수
- 변경 후 `npm run build` 확인

---

## ⛔ 수정 금지 항목 (DO NOT MODIFY)

아래 파일/코드는 사용자가 직접 확정한 항목입니다.
**에이전트는 이 항목들을 절대 변경, 롤백, 덮어쓰기하지 마세요.**

### 1. ColorModeToggle — 아이콘만 표시
- **파일**: `components/ColorModeToggle.tsx`
- **규칙**: 한글 라벨(블루/레드) 없이 ●● 색상 점 아이콘만 표시
- **금지**: label 추가, 한글 텍스트 추가, 컴포넌트 구조 변경

### 2. 트럭 애니메이션 — 도시 건물 배경 + 큰 트럭
- **파일**: `app/page.tsx` (트럭 달리는 애니메이션 섹션)
- **파일**: `app/globals.css` (truck-slow, road-slow, dust-slow 키프레임)
- **규칙**: 도시 건물 배경(고정, opacity-15) + Truck w-20 + 천천히 바운스(0.8s)
- **금지**: 박스 아이템으로 되돌리기, 트럭 크기 줄이기, 애니메이션 제거, 건물 제거

### 3. 고객 리뷰 데이터 — 창원시 5개
- **파일**: `app/page.tsx` (REVIEWS 상수)
- **규칙**: 창원시 성산구/마산합포구/진해구/의창구/마산회원구 5개
- **금지**: 서울/인천/수원 데이터로 되돌리기, 3개로 줄이기

### 4. 고객 평가 슬라이더 — 수동 드래그만
- **파일**: `app/page.tsx` (ReviewAutoSlider 컴포넌트)
- **규칙**: 수동 마우스/터치 드래그, scrollSnapType: proximity
- **금지**: 자동 슬라이드 타이머 추가, snap mandatory로 변경

### 5. SMS 발신번호
- **파일**: `app/api/sms/route.ts`
- **규칙**: FROM_NUMBER = "01085757863"
- **금지**: 발신번호 변경

### 6. 로고 — PNG + 컬러모드 대응
- **파일**: `components/Header.tsx` (logo-da24.png + logo-color 클래스)
- **파일**: `app/globals.css` ([data-color-mode="red"] .logo-color)
- **규칙**: PNG 로고 사용, 레드 모드에서 hue-rotate 적용
- **금지**: SVG로 변경, 로고 파일 교체, logo-color 클래스 제거

### 7. 카카오 주소 검색 — 바텀시트 임베드
- **파일**: `lib/daum-postcode.ts`
- **규칙**: 모바일=바텀시트 풀너비, PC=센터 모달 480px
- **금지**: 기본 팝업으로 되돌리기

### 8. Footer — 어드민 링크
- **파일**: `components/Footer.tsx`
- **규칙**: 사업자정보 옆에 /admin 어드민 링크 포함
- **금지**: 어드민 링크 제거

### 9. 폰트 사이즈
- **규칙**: 전체 폰트 사이즈 증가된 상태 유지 (모바일 가독성)
- **금지**: 폰트 사이즈 일괄 축소, 원래 작은 사이즈로 되돌리기

### 10. SMS 인증 UX
- **파일**: `app/chat/page.tsx`, `app/history/page.tsx`
- **규칙**: 010 미리 입력, 번호 저장 체크박스(기본 ON), WebOTP API, autoComplete="one-time-code"
- **금지**: 010 미리 입력 제거, 번호 저장 체크박스 제거, WebOTP 제거

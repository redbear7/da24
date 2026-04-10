# Product Requirements Document: da24 홈서비스 플랫폼

**Author**: bangju  
**Date**: 2026-04-11  
**Status**: Draft  
**Stakeholders**: 사업기획팀  

---

## 1. Executive Summary

다이사(da24.co.kr)와 동일한 홈서비스 매칭 플랫폼을 구축한다. 이사/입주청소/인터넷/에어컨 4대 서비스의 상담 신청 + 업체 매칭을 제공하며, 웹(Next.js)과 iOS 앱(React Native/Expo)을 동시에 개발한다. 대출/렌탈 서비스는 제외한다. 시니어 사용자를 핵심 타겟으로 하여 큰 글씨, 간결한 UI, 높은 가독성을 최우선으로 설계한다.

---

## 2. Background & Context

### 시장 현황
- 2024년 한국 이사 시장 규모: **최소 3조원** (628만명 이사, 평균 110만원)
- 다이사 누적 거래액: **8,700억원** (2024.09), 누적 방문자 690만명
- 이사 고객 = 인터넷 가입 + 청소 + 에어컨 동시 수요 → 크로스셀링 기회

### 수익 모델
| 서비스 | 수익 모델 | 건당 수익 |
|--------|---------|:---:|
| 이사 매칭 | 업체 중개 수수료 | 3~10만원 |
| 입주청소 | 업체 중개 수수료 | 2~5만원 |
| 인터넷 가입 | 통신사 CPA | 8~15만원 |
| 에어컨 | 업체 중개 수수료 | 3~8만원 |

### 레퍼런스
- **da24.co.kr** — 원본 사이트 (1:1 클론 대상)
- **toppingmoney.com** — 대출 비교 (제외)
- 출처: 머니투데이, 금융위원회, 서울경제 보도 자료

### 기존 완성 현황
| 페이지 | 상태 | 비고 |
|--------|:---:|------|
| `/` 메인 홈 | ✅ 기본 완성 | 디자인 QA 필요 |
| `/internet` 인터넷 비교 | ✅ 완성 | 통신사+요금제+CTA+리뷰 |
| `/chat` 채팅내역 | ✅ 완성 | 인증 플로우 |
| `/history` 신청내역 | ✅ 완성 | 인증 플로우 |
| `/clean` 입주청소 | 🔧 기본 틀 | 원본 대비 미완성 |
| `/moving` 이사 견적 | ❌ 미구현 | |
| `/aircon` 에어컨 | ❌ 미구현 | |
| `/review` 고객 후기 | ❌ 미구현 | |
| iOS 앱 | ❌ 미구현 | |

---

## 3. Objectives & Success Metrics

### Goals
1. da24.co.kr과 **1:1 동일한 UI/UX**를 가진 웹 플랫폼 구축
2. **iOS 앱** 동시 출시 (Expo/React Native)
3. **시니어 사용자**가 3분 내 상담 신청을 완료할 수 있는 접근성 확보
4. 4대 서비스 모두 **업체 리스트 + 매칭** 기능 구현

### Non-Goals (제외 범위)
1. **대출/렌탈 서비스** — Phase 2에서 검토
2. **결제/정산 시스템** — MVP에서는 상담 신청까지만
3. **Android 앱** — iOS 먼저, Android는 후순위
4. **어드민 대시보드** — Supabase Dashboard로 대체

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| 전체 페이지 빌드 성공 | 8개 라우트 에러 0 | `npm run build` |
| 모바일 Lighthouse 점수 | 90+ (Performance) | Lighthouse audit |
| 상담 신청 완료율 | 폼 제출 시 Supabase 저장 100% | API 로그 |
| 시니어 폰트 가독성 | 최소 16px 본문 | 디자인 QA |
| iOS 앱 빌드 | App Store 심사 제출 | Expo EAS Build |

---

## 4. Target Users & Segments

### Primary: 이사 예정 가구주 (30~60대)
- 이사 + 청소 + 인터넷 동시 필요
- 가격 비교 중시, 모바일 사용

### Secondary: 시니어 사용자 (60대+)
- **큰 글씨** + **간결한 단계** 필수
- 전화 상담 선호, 복잡한 비교보다 바로 신청 원함
- 아이폰 기본 접근성 설정 존중 (Dynamic Type)

### Tertiary: 자취/원룸 2030
- 소형이사 + 인터넷 가입
- 빠른 견적 비교, 모바일 네이티브 경험 기대

---

## 5. User Stories & Requirements

### P0 — Must Have

| # | User Story | Acceptance Criteria | 담당 |
|---|-----------|-------------------|------|
| 1 | 사용자가 메인 홈에서 이사/청소/인터넷/에어컨 서비스를 선택할 수 있다 | 4개 서비스 카드 클릭 → 각 서비스 페이지 이동 | 프론트엔드 |
| 2 | 사용자가 이사 유형(가정/소형/사무실)을 선택하고 견적을 요청할 수 있다 | 출발지/도착지, 날짜, 짐목록 입력 → 제출 → DB 저장 | 프론트엔드+백엔드 |
| 3 | 사용자가 이사 업체 리스트를 보고 매칭 요청할 수 있다 | 지역별 업체 리스트 → 업체 선택 → 견적 요청 | 프론트엔드+백엔드 |
| 4 | 사용자가 입주청소 유형/평수를 선택하고 상담을 신청할 수 있다 | 청소 유형, 평수, 날짜 입력 → 제출 → DB 저장 | 프론트엔드+백엔드 |
| 5 | 사용자가 에어컨 설치/이전/철거를 선택하고 상담을 신청할 수 있다 | 유형, 대수 입력 → 제출 → DB 저장 | 프론트엔드+백엔드 |
| 6 | 사용자가 고객 후기를 별점/태그와 함께 조회할 수 있다 | 리뷰 리스트 + 별점 + 태그 + 더보기 | 프론트엔드+백엔드 |
| 7 | 사용자가 휴대폰 번호 인증 후 채팅/신청내역에 접근할 수 있다 | 번호 입력 → 인증번호 → 확인 → 채팅/내역 표시 | 프론트엔드 |
| 8 | 모든 페이지가 모바일(375px)에서 정상 표시된다 | max-width 640px, 터치 최적화 | 디자인 |
| 9 | iOS 앱에서 모든 서비스에 접근할 수 있다 | Expo WebView 또는 React Native 네이티브 화면 | 프론트엔드 |
| 10 | 시니어 사용자가 큰 글씨로 서비스를 이용할 수 있다 | 최소 16px 본문, 44px 터치 타겟, 높은 대비 | 디자인 |

### P1 — Should Have

| # | User Story | Acceptance Criteria | 담당 |
|---|-----------|-------------------|------|
| 11 | 사용자가 블루/레드 컬러 모드를 전환할 수 있다 | ColorModeToggle → CSS 변수 전환 → localStorage 저장 | 프론트엔드 |
| 12 | 메인 홈에 프로모 배너가 자동 슬라이드된다 | 4초 간격 전환, 인디케이터 표시 | 프론트엔드 |
| 13 | 이사 업체 평가 리뷰가 가로 스크롤로 표시된다 | 별점 + 후기 카드 + 더보기 버튼 | 프론트엔드 |
| 14 | 상담 신청 시 이메일/SMS 알림이 발송된다 | API → 알림 서비스 연동 | 백엔드 |
| 15 | GA4 이벤트 추적이 동작한다 | 서비스 선택, 상담 신청 이벤트 추적 | 프론트엔드 |

### P2 — Nice to Have / Future

| # | User Story | Acceptance Criteria | 담당 |
|---|-----------|-------------------|------|
| 16 | 대출/렌탈 서비스 추가 | 별도 페이지 + CPA 연동 | Phase 2 |
| 17 | 어드민 대시보드 | 상담 관리, 업체 관리, 정산 | Phase 2 |
| 18 | Android 앱 | Expo 빌드 → Play Store | Phase 2 |
| 19 | 실시간 채팅 (업체-고객) | Supabase Realtime | Phase 2 |
| 20 | PG 결제 연동 | 토스페이먼츠 | Phase 2 |

---

## 6. Solution Overview

### 6.1 웹 플랫폼 (Next.js)

```
/Users/bangju/Documents/PROGRAM/da24/
├── app/
│   ├── page.tsx              # 메인 홈
│   ├── internet/page.tsx     # 인터넷 비교 ✅
│   ├── moving/page.tsx       # 이사 견적 요청
│   ├── clean/page.tsx        # 입주청소
│   ├── aircon/page.tsx       # 에어컨
│   ├── review/page.tsx       # 고객 후기
│   ├── chat/page.tsx         # 채팅내역 ✅
│   ├── history/page.tsx      # 신청내역 ✅
│   └── api/                  # API 라우트
├── components/               # 공유 컴포넌트
├── lib/                      # 타입, Supabase, 유틸
├── supabase/                 # DB 스키마
└── DESIGN.md                 # 디자인 시스템 명세
```

### 6.2 iOS 앱 (Expo/React Native)

```
/Users/bangju/Documents/PROGRAM/da24/app-ios/
├── app/                      # Expo Router
│   ├── (tabs)/
│   │   ├── index.tsx         # 홈 탭
│   │   ├── internet.tsx      # 인터넷
│   │   ├── moving.tsx        # 이사
│   │   └── mypage.tsx        # 마이페이지 (채팅+내역)
│   └── _layout.tsx
├── components/               # 네이티브 컴포넌트
└── lib/                      # 공유 로직 (Supabase)
```

### 6.3 Supabase DB 스키마

```
기존 테이블:
  providers, plans, consultations ✅

신규 테이블:
  moving_companies     — 이사 업체 (이름, 지역, 평점, 차량, 인력)
  moving_requests      — 이사 견적 요청 (유형, 출발지, 도착지, 날짜, 짐목록)
  moving_matches       — 이사 매칭 (요청 ↔ 업체 연결)
  clean_requests       — 청소 상담 요청
  aircon_requests      — 에어컨 상담 요청
  reviews              — 고객 후기 (서비스유형, 별점, 내용, 태그)
  banners              — 프로모 배너
```

### 6.4 시니어 최적화 원칙

| 항목 | 기준 |
|------|------|
| 본문 폰트 | 최소 **16px** (현재 14~15px → 증가) |
| 터치 타겟 | 최소 **44px × 44px** |
| 색상 대비 | WCAG AA 이상 (4.5:1) |
| 단계 수 | 상담 신청까지 **3단계 이내** |
| 전화 연결 | 모든 페이지에 **전화 상담 버튼** 노출 |
| 에러 메시지 | 한국어, 구체적 안내 |
| iOS Dynamic Type | 시스템 글꼴 크기 설정 존중 |

### 6.5 에이전트 분업 (Multica)

| 에이전트 | 역할 | Phase 1 업무 |
|---------|------|-------------|
| **da24 프론트엔드** | 페이지+컴포넌트 | /moving, /clean 개선, /aircon, /review, 메인홈 완성 |
| **da24 백엔드** | DB+API+배포 | 스키마 확장, API 추가, 업체 매칭 로직 |
| **da24 디자인** | UI/UX QA | 원본 대비 디자인 검수, 시니어 접근성 검증 |
| **da24 iOS** (신규) | iOS 앱 | Expo 세팅, 탭 네비게이션, Supabase 연동 |

---

## 7. Open Questions

| Question | Owner | Deadline |
|----------|-------|----------|
| 이사 업체 데이터는 직접 수집? 또는 API 연동? | bangju | Phase 1 전 |
| 휴대폰 인증 실제 SMS 발송 서비스는? (알리고/NHN) | 백엔드 | Phase 1 전 |
| iOS 앱 스타일: WebView wrapper vs 네이티브 UI? | bangju | 착수 전 |
| 이사 업체 리뷰는 실제 데이터? 샘플 데이터? | bangju | Phase 1 전 |
| 커스텀 도메인 확정? (da24 관련 도메인) | bangju | 배포 전 |

---

## 8. Timeline & Phasing

### Phase 1: 웹 MVP 완성 (Week 1~2)

| 주차 | 프론트엔드 | 백엔드 | 디자인 |
|:---:|---------|--------|--------|
| **W1** | /moving 이사 견적 페이지 | 스키마 확장 (이사/업체/청소/에어컨) | 메인홈 디자인 QA |
| **W1** | /clean 원본 대비 개선 | API: /moving, /clean, /aircon | /moving 디자인 검수 |
| **W1** | /aircon 에어컨 페이지 | 업체 데이터 시딩 (50개) | 시니어 접근성 검증 |
| **W2** | /review 고객 후기 페이지 | API: /reviews, /banners | /review 디자인 검수 |
| **W2** | 메인홈 완성 (업체매칭 연동) | Vercel 재배포 | 전체 페이지 최종 QA |
| **W2** | 시니어 최적화 (폰트, 터치) | | 컬러모드 검증 |

### Phase 2: iOS 앱 (Week 3~4)

| 주차 | iOS | 백엔드 |
|:---:|------|--------|
| **W3** | Expo 프로젝트 세팅 | Supabase Auth (SMS 인증) |
| **W3** | 탭 네비게이션 + 메인홈 | 푸시 알림 연동 |
| **W4** | 이사/인터넷/마이페이지 | App Store 심사 준비 |
| **W4** | 시니어 최적화 (Dynamic Type) | TestFlight 배포 |

### Phase 3: 확장 (Week 5+)
- 대출/렌탈 서비스 추가
- 어드민 대시보드
- Android 앱
- 실시간 채팅
- PG 결제 연동

---

## Appendix: 기술 스택 상세

| 영역 | 기술 | 비고 |
|------|------|------|
| 웹 프론트 | Next.js 16, React 19, TypeScript | App Router |
| 스타일링 | Tailwind CSS 4 | CSS 변수 컬러 모드 |
| DB/Auth | Supabase (PostgreSQL) | RLS, Realtime |
| 배포 | Vercel | 자동 배포 |
| iOS 앱 | Expo (React Native) | EAS Build |
| 아이콘 | Lucide React | 통일 |
| 디자인 시스템 | DESIGN.md | awesome-design-md 기반 |
| 프로젝트 관리 | Multica | 에이전트 분업 |
| 분석 | Google Analytics 4 | 이벤트 추적 |

---

*Generated by Claude Code + Multica — 2026.04.11*

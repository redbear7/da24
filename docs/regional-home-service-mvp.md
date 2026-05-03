# 지역 홈서비스 플랫폼 MVP 기획서

**작성일**: 2026-05-03  
**기준 프로젝트**: `/Users/bangju/Documents/PROGRAM/da24`  
**목표**: DA24의 익숙한 모바일 UX와 신뢰감을 살리되, 특정 지역에서 새 브랜드 홈서비스 플랫폼으로 런칭한다.

---

## 1. 제품 방향

이 프로젝트는 DA24를 그대로 복제하는 것이 아니라, **지역 기반 홈서비스 운영 플랫폼**으로 발전시키는 것이 목표다. 고객은 복잡한 비교 없이 빠르게 상담을 신청하고, 업체회원은 모바일에서 요청을 확인하고 응답하며, 운영자는 지역별 수요와 업체 품질을 관리한다.

핵심 문장:

> 우리 지역에서 이사, 청소, 인터넷, 에어컨 서비스를 가장 쉽게 신청하고 가장 빠르게 연결하는 모바일 홈서비스 플랫폼.

### 유지할 DA24의 장점

- 모바일 우선의 단순한 서비스 카드 구조
- 상담 신청까지 짧은 단계
- 큰 CTA와 고정 하단 상담 버튼
- 이사 중심으로 청소/인터넷/에어컨을 묶는 크로스셀 구조
- 전화번호 인증 기반의 신청내역/채팅 접근

### 새롭게 바꿀 점

- DA24 로고/문구/컬러를 그대로 쓰지 않고 지역 브랜드로 전환
- “전국 대형 플랫폼” 느낌보다 “우리 지역 전문 상담센터” 느낌 강화
- 업체회원용 모바일 웹/PWA를 별도 제품으로 설계
- 운영자가 업체 품질, 배정, 응답 속도, 리뷰를 관리할 수 있게 확장

---

## 2. 추천 기술 전략

이전 세션의 추천 조합은 방향이 좋다:

| 영역 | 추천 |
|------|------|
| 웹 | Next.js + Chakra UI + Framer Motion |
| 앱 | Expo + Tamagui |
| 디자인 | Figma Tokens 기반 공통 디자인 시스템 |
| 운영 | PWA 먼저, 앱은 핵심 기능 안정화 후 출시 |

다만 현재 `da24`는 이미 **Next.js + Tailwind CSS 4**로 구현되어 있으므로, MVP에서는 프레임워크를 갈아타지 않는다.

### 현실적인 1차 선택

| 영역 | MVP 선택 | 이유 |
|------|----------|------|
| 고객 웹 | 현재 Next.js 유지 | 이미 서비스 화면과 API가 존재함 |
| 스타일 | Tailwind + CSS 변수 유지 | 리브랜딩이 빠름 |
| 업체회원 | Next.js PWA로 먼저 구현 | 별도 앱보다 빠르게 검증 가능 |
| 앱 | Expo는 Phase 3 | 업체 사용 패턴이 검증된 뒤 네이티브화 |
| 디자인 시스템 | `DESIGN.md` 확장 | 토큰화는 하되 현재 코드와 연결 |

결론:

> 처음부터 앱까지 크게 만들기보다, 고객용 모바일 웹 + 업체회원 PWA + 관리자 운영 흐름을 먼저 완성한다.

---

## 3. 사용자 그룹

### 고객

| 사용자 | 니즈 | UX 원칙 |
|--------|------|---------|
| 이사 예정 가구 | 이사+청소+인터넷을 한번에 해결 | 한 화면에서 시작, 단계형 견적 |
| 신축/입주 고객 | 청소, 인터넷, 에어컨 동시 필요 | 패키지 추천 |
| 시니어 고객 | 전화 상담과 쉬운 신청 | 큰 글씨, 짧은 질문, 전화 CTA |
| 1인 가구 | 빠른 소형이사/인터넷 | 최소 입력, 카톡/SMS 안내 |

### 업체회원

| 사용자 | 니즈 | UX 원칙 |
|--------|------|---------|
| 이사 업체 | 신규 요청 확인, 빠른 견적 응답 | 모바일 리스트 중심 |
| 청소 업체 | 일정/지역/평수 확인 | 캘린더와 상태 변경 |
| 에어컨 기사 | 설치/이전 요청 확인 | 주소와 일정 우선 |
| 인터넷 상담사 | 고객 상태 관리 | 연락/완료/지원금 상태 |

### 운영자

| 사용자 | 니즈 |
|--------|------|
| 플랫폼 운영자 | 신청건 배정, 업체 승인, 리뷰 관리 |
| 상담 매니저 | 미응답 요청 관리, 고객 재연락 |
| 영업 담당 | 지역별 업체 확보, 성과 확인 |

---

## 4. MVP 범위

### Phase 1: 고객용 지역 브랜드 PWA

현재 DA24 고객 화면을 지역 서비스용으로 바꾼다.

필수 화면:

| 경로 | 역할 |
|------|------|
| `/` | 지역 브랜드 홈, 서비스 선택, 번들 CTA |
| `/moving` | 이사 견적 요청 |
| `/clean` | 청소 견적 요청 |
| `/internet` | 인터넷 상담 신청 |
| `/aircon` | 에어컨 설치/이전 상담 |
| `/review` | 지역 후기/업체 평가 |
| `/history` | 내 신청내역 |
| `/chat` | 상담/알림 내역 |

핵심 UX:

1. 서비스 선택
2. 지역/일정/조건 입력
3. 연락처 인증 또는 연락처 입력
4. 상담 접수 완료
5. SMS/카톡/전화 안내

### Phase 2: 업체회원 모바일 웹/PWA

업체가 앱 설치 없이 바로 사용할 수 있는 모바일 웹을 만든다.

권장 경로:

| 경로 | 역할 |
|------|------|
| `/partner` | 업체회원 홈 |
| `/partner/login` | 휴대폰/비밀번호 또는 SMS 로그인 |
| `/partner/requests` | 신규 요청 목록 |
| `/partner/requests/[id]` | 요청 상세 |
| `/partner/schedule` | 일정 관리 |
| `/partner/profile` | 업체 프로필/서비스 지역 |
| `/partner/reviews` | 받은 리뷰 |

업체회원 핵심 액션:

- 신규 요청 확인
- 견적 가능/불가능 응답
- 예상 견적 입력
- 고객 연락 완료 체크
- 일정 확정
- 작업 완료
- 리뷰 요청

### Phase 3: 운영 관리자 고도화

현재 `/admin`을 확장한다.

필수 메뉴:

| 메뉴 | 기능 |
|------|------|
| 신청건 | 전체 요청, 상태, 담당 업체 |
| 업체관리 | 승인, 지역, 서비스, 등급 |
| 배정관리 | 수동/자동 배정 |
| 리뷰관리 | 후기 노출/비노출 |
| 배너/이벤트 | 지역 캠페인 관리 |
| 성과 | 신청수, 전환율, 업체 응답률 |

### Phase 4: Expo 앱

고객 앱보다 업체회원 앱을 먼저 고려한다. 업체는 알림, 요청 확인, 빠른 응답의 필요가 크기 때문이다.

우선순위:

1. 업체회원 Expo 앱
2. 운영자 알림 앱 또는 관리자 모바일
3. 고객용 앱

---

## 5. 정보 구조

### 고객 서비스 신청 상태

```text
draft
  ↓
submitted
  ↓
assigned
  ↓
contacted
  ↓
quoted
  ↓
scheduled
  ↓
completed
  ↓
reviewed
```

### 업체 요청 상태

```text
new
  ↓
viewed
  ↓
accepted / declined
  ↓
quote_sent
  ↓
confirmed
  ↓
done
```

### 운영 배정 상태

```text
unassigned
  ↓
auto_matched
  ↓
manually_assigned
  ↓
partner_accepted
  ↓
customer_confirmed
```

---

## 6. DB 초안

기존 `consultations`, `plans`, `providers`, `banners`, `reviews`를 유지하되, 고객 요청과 업체 배정을 일반화한다.

### regions

```sql
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_region_id UUID REFERENCES regions(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### partners

```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT NOT NULL,
  service_types TEXT[] NOT NULL,
  regions TEXT[] NOT NULL,
  tier TEXT DEFAULT 'basic',
  status TEXT DEFAULT 'pending',
  rating NUMERIC DEFAULT 0,
  review_count INT DEFAULT 0,
  response_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### service_requests

```sql
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  region TEXT,
  address_from TEXT,
  address_to TEXT,
  requested_date TEXT,
  request_payload JSONB DEFAULT '{}',
  status TEXT DEFAULT 'submitted',
  source TEXT DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### partner_assignments

```sql
CREATE TABLE partner_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new',
  quote_min INT,
  quote_max INT,
  memo TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### request_events

```sql
CREATE TABLE request_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL,
  actor_id UUID,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. 고객 UX 설계

### 홈 화면

첫 화면은 “서비스 설명”보다 바로 행동하게 만드는 구조가 좋다.

권장 구성:

1. 지역 신뢰 문구
   - 예: `창원에서 이사부터 청소까지 한번에`
2. 서비스 카드
   - 이사 / 청소 / 인터넷 / 에어컨
3. 올인원 패키지 CTA
   - 이사+청소+인터넷 한번에 상담
4. 후기
   - 실제 지역명 기반 후기
5. 하단 고정 상담 버튼

### 신청 플로우

질문은 한 화면에 몰아넣지 않고, 서비스별로 3~5단계만 사용한다.

예: 이사

```text
1. 이사 유형
2. 출발지/도착지
3. 이사 날짜
4. 짐량/평수
5. 연락처
```

예: 청소

```text
1. 청소 유형
2. 평수/방 개수
3. 주소/일정
4. 연락처
```

---

## 8. 업체회원 UX 설계

업체회원 화면은 예쁘기보다 빨라야 한다. 작은 사장님들이 이동 중 휴대폰으로 확인하는 상황을 기준으로 한다.

### 업체 홈

보여줄 정보:

- 오늘 신규 요청
- 응답 대기
- 확정 일정
- 완료 대기
- 이번 달 예상 수익

### 요청 목록

카드 정보:

```text
[신규] 가정이사
창원시 성산구 → 마산회원구
희망일: 5월 18일
32평 / 엘리베이터 있음
[견적 가능] [불가]
```

### 요청 상세

필수 정보:

- 고객 연락처는 업체 수락 후 공개
- 주소/일정/조건
- 예상 견적 입력
- 내부 메모
- 상태 변경 버튼

---

## 9. 수익 모델

### MVP 수익원

| 수익원 | 설명 | 우선순위 |
|--------|------|:---:|
| 이사/청소/에어컨 중개 수수료 | 완료 건당 수수료 | 높음 |
| 인터넷 가입 CPA | 상담/설치 완료 수익 | 높음 |
| 업체회원 프리미엄 노출 | 추천 업체 상단 노출 | 중간 |
| 번들 패키지 | 이사+청소+인터넷 묶음 | 높음 |
| 지역 광고 | 배너/카테고리 광고 | 낮음 |

### 가장 중요한 매출 구조

이사 1건을 단독으로 끝내지 않고, 입주청소/인터넷/에어컨을 함께 제안해야 한다.

```text
이사 단독: 수수료 3~8만원
이사+청소: 5~13만원
이사+청소+인터넷: 13~28만원
이사+청소+인터넷+에어컨: 16~36만원+
```

---

## 10. 운영 전략

### 런칭 전 준비

1. 지역 업체 20~30곳 확보
   - 이사 8곳
   - 청소 8곳
   - 에어컨 5곳
   - 인터넷 상담 파트너 1~3곳
2. 카테고리별 기본 단가표 확보
3. 리뷰/후기 초기 콘텐츠 확보
4. 전화 상담 운영 시간 확정
5. SMS/카카오 알림 템플릿 준비

### 초기 지역 전략

처음부터 전국을 열지 않는다.

권장:

```text
1차: 내가 사는 시/구
2차: 인접 구/군
3차: 광역시/도 단위
4차: 전국 확장
```

### 품질 관리

업체 점수는 단순 별점보다 운영 지표가 중요하다.

| 지표 | 의미 |
|------|------|
| 응답 속도 | 요청 후 첫 응답 시간 |
| 수락률 | 배정 요청 대비 수락 |
| 완료율 | 수락 후 실제 완료 |
| 클레임률 | 고객 불만 비율 |
| 리뷰 점수 | 고객 만족도 |

---

## 11. 개발 로드맵

### Sprint 1: 브랜드/정보 구조 정리

- 지역 브랜드명/로고/컬러 결정
- `DESIGN.md`를 지역 브랜드 기준으로 갱신
- 홈 화면 문구와 서비스 카드 리브랜딩
- 기존 DA24 문구 제거 또는 일반화

### Sprint 2: 고객 신청 데이터 통합

- `service_requests` 중심으로 API 정리
- 이사/청소/에어컨/인터넷 신청을 공통 상태 모델로 연결
- 신청 완료 화면 통일
- 내 신청내역이 모든 서비스 요청을 보여주게 수정

### Sprint 3: 업체회원 PWA

- `/partner/login`
- `/partner/requests`
- `/partner/requests/[id]`
- 요청 수락/거절/견적 입력
- 업체 프로필 관리

### Sprint 4: 운영자 배정 관리

- `/admin/requests`
- `/admin/partners`
- 요청 수동 배정
- 업체 상태/등급 관리
- 미응답 알림

### Sprint 5: 매출 기능

- 번들 패키지 CTA 강화
- 이사 완료 후 청소/인터넷 업셀
- 업체 프리미엄 노출
- 지역 캠페인 배너

---

## 12. 바로 다음 구현 추천

가장 먼저 만들면 좋은 것은 **업체회원 요청 목록 MVP**다. 이유는 고객용 화면은 이미 상당 부분 있고, 실제 매출을 만들려면 업체가 요청을 받고 응답하는 운영 루프가 필요하기 때문이다.

추천 작업 순서:

1. `docs/regional-home-service-mvp.md` 기준으로 스키마 확정
2. `partners`, `service_requests`, `partner_assignments` 테이블 추가
3. `/partner` 라우트 생성
4. 업체 요청 목록 mock 데이터 UI 제작
5. 관리자에서 요청을 업체에 배정하는 최소 기능 제작

---

## 13. 결정이 필요한 질문

| 질문 | 추천 기본값 |
|------|-------------|
| 브랜드명은? | 지역명 + 홈서비스 키워드 |
| 첫 런칭 지역은? | 내가 실제로 영업 가능한 시/구 1곳 |
| 고객 앱을 먼저 만들까? | 아니오, PWA 먼저 |
| 업체 앱을 먼저 만들까? | PWA 검증 후 Expo |
| 결제를 붙일까? | MVP에서는 상담/매칭 완료 후 수수료 정산 |
| 전화 상담을 노출할까? | 예, 시니어/고관여 서비스에 필수 |


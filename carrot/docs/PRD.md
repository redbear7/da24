# PRD — 당근마켓 클론

> 학습/포트폴리오 목적의 당근마켓 핵심 기능 클론 프로젝트. 모바일 퍼스트 웹 앱.

## 1. 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | carrot-market-clone |
| 위치 | `da24` 레포 내부 `carrot/` 서브프로젝트 |
| 목표 | 당근마켓의 4가지 핵심 기능을 End-to-End로 구현 |
| 플랫폼 | 모바일 웹 (max-width 640px), 라이트모드 |
| 기술 | Next.js 16 App Router / React 19 / TS 5 / Tailwind 4 / Supabase / Solapi |
| 브랜치 | `claude/carrot-market-clone-setup-B21lG` |

## 2. 범위 (Scope)

### 2.1 포함 (MVP)
1. **인증** — 휴대폰 번호 + SMS 인증 (Solapi) 기반 가입/로그인
2. **동네 인증/검색/관심** — 동(洞) 검색, 주 동네 설정, 최대 2개 관심 동네
3. **중고거래 글 CRUD + 이미지** — 상품 등록/목록/상세/수정/삭제, Supabase Storage 이미지 업로드 (최대 10장)
4. **1:1 실시간 채팅** — 상품별 판매자-구매자 방, Supabase Realtime 구독

### 2.2 제외 (Out of Scope)
- 결제/에스크로
- 지도 기반 위치 서비스 (GPS 인증)
- 동네생활/모임/알바/중고차/부동산
- 푸시 알림 (FCM) — MVP 이후 고려
- 이미지 검열/머신러닝 카테고리 추천
- 관리자 대시보드

## 3. 사용자 스토리

### 3.1 인증
- [ ] 방문자는 휴대폰 번호를 입력하면 5분 내 6자리 인증번호를 SMS로 받는다.
- [ ] 인증 성공 시, 프로필이 없으면 온보딩(닉네임/동네)로 이동한다.
- [ ] 이후 재접속 시 세션 쿠키로 자동 로그인된다.

### 3.2 동네
- [ ] 사용자는 동 이름으로 동네를 검색할 수 있다.
- [ ] 사용자는 최대 2개의 동네를 등록할 수 있고, 그중 1개는 주(primary) 동네다.
- [ ] 상품 목록/홈은 사용자의 주 동네를 기본 필터로 사용한다.

### 3.3 상품 CRUD
- [ ] 로그인한 사용자는 제목/카테고리/가격/설명/사진(1~10장)을 입력해 상품을 등록한다.
- [ ] 가격 0은 "나눔"으로 표시된다.
- [ ] 판매자만 자신의 상품을 수정/삭제/상태변경(판매중/예약중/거래완료)할 수 있다.
- [ ] 비로그인 방문자도 상품 목록/상세를 열람할 수 있다. (단, 채팅/관심은 로그인 필요)

### 3.4 채팅
- [ ] 구매자가 상품 상세에서 "채팅하기"를 누르면 상품별 1:1 채팅방이 생성(또는 재사용)된다.
- [ ] 채팅방 메시지는 Supabase Realtime으로 실시간 수신된다.
- [ ] 채팅 목록은 `last_message_at` 내림차순으로 정렬된다.

## 4. 라우팅

| 경로 | 설명 | 인증 |
|------|------|------|
| `/` | 홈 (주 동네 기반 상품 목록) | 선택 |
| `/login` | 휴대폰 번호 입력 | - |
| `/verify?phone=` | 인증번호 입력 | - |
| `/neighborhood` | 동네 검색/설정 | 필수 |
| `/products` | 상품 목록 (검색/카테고리 필터) | 선택 |
| `/products/new` | 상품 등록 | 필수 |
| `/products/[id]` | 상품 상세 | 선택 |
| `/products/[id]/edit` | 상품 수정 (판매자 전용) | 필수 |
| `/chats` | 채팅방 목록 | 필수 |
| `/chats/[id]` | 채팅방 (Realtime) | 필수 |
| `/favorites` | 관심 상품 | 필수 |
| `/profile` | 나의 당근 | 필수 |

### API 라우트
| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/auth/sms` | POST | 인증번호 발송 (Solapi) |
| `/api/auth/verify` | POST | 인증번호 확인 + 세션 발급 |
| `/api/products` | GET/POST | 상품 목록/등록 |
| `/api/products/[id]` | GET/PATCH/DELETE | 상품 단건 CRUD |
| `/api/neighborhoods` | GET/POST | 동네 검색/등록 |
| `/api/favorites` | POST/DELETE | 관심 토글 |
| `/api/chats` | POST | 채팅방 생성/재사용 후 리다이렉트 |

## 5. 데이터 모델

```
profiles              (auth.users 1:1)
  ├─ phone, nickname, avatar_url, manner_temp, primary_neighborhood_id
neighborhoods         (법정동 마스터)
  ├─ sido, sigungu, dong, full_name, lat, lng
user_neighborhoods    (N:M, 최대 2개 / is_primary 1개)
products
  ├─ seller_id, neighborhood_id, title, description, price, category, status
  └─ view_count, favorite_count, chat_count
product_images        (N:1 to products)
favorites             (user_id, product_id)
chat_rooms            (product_id, buyer_id, seller_id, last_message_at)
chat_messages         (room_id, sender_id, content, read_at)
```

상세 DDL과 RLS 정책은 [`supabase/schema.sql`](../supabase/schema.sql) 참조.

### RLS 핵심 규칙
- `profiles`: 공개 SELECT, 본인만 UPDATE/INSERT
- `products`: 공개 SELECT, 판매자만 INSERT/UPDATE/DELETE
- `favorites`: 본인만 ALL
- `chat_rooms` / `chat_messages`: 방 참여자(buyer/seller)만 SELECT/INSERT

## 6. 디자인 가이드

| 토큰 | 값 |
|------|-----|
| Primary | `#FF6F0F` (당근 오렌지) |
| Background | `#FFFFFF` |
| Foreground | `#212124` |
| Muted | `#F2F3F6` |
| Border | `#E8EAED` |
| Font | Pretendard |
| Max width | 640px (모바일 퍼스트) |

- 하단 고정 탭바: 홈 / 내 동네 / 채팅 / 관심 / 나의 당근
- 상품 카드: 좌측 100x100 썸네일 + 우측 제목/동네/시간/가격
- 채팅 말풍선: 본인 Primary 배경 / 상대 Muted 배경
- 라이트모드 전용
- `safe-bottom` 클래스로 iOS 홈 인디케이터 대응

## 7. 비기능 요구사항

- TypeScript strict 모드
- `npm run build` 통과
- 모바일 퍼스트 (640px 초과 뷰포트는 중앙 정렬 카드)
- 서버 컴포넌트 우선, 필요한 곳만 `"use client"`
- Next.js 16 규칙 (breaking changes 준수) — `params`/`searchParams`는 `Promise`로 처리
- 환경변수는 `.env.local` 에 저장하고 `.env.example`로 문서화

## 8. 오픈 이슈 / TODO

- [ ] Supabase Auth `phone` 로그인 vs 가상 이메일 전략 확정 (`api/auth/verify` TODO 참조)
- [ ] 동네 마스터 데이터 시딩 (초기 창원/서울 일부)
- [ ] 이미지 리사이징/WebP 변환 여부
- [ ] 채팅 읽음 처리(`read_at`) 업데이트 로직
- [ ] `view_count`/`favorite_count`/`chat_count` 증분 트리거
- [ ] 검색 — ilike 기반 → `tsvector` 인덱스 / pg_trgm 업그레이드
- [ ] 판매자 매너 온도 업데이트 로직 (거래 완료 후기 연동)
- [ ] 글 상세 이미지 갤러리 (현재는 첫 이미지만 표시)

## 9. 준비 상태 (2026-04)

| 영역 | 상태 |
|------|------|
| 디렉토리 구조 | ✅ |
| Next.js 설정 (tsconfig, eslint, tailwind) | ✅ |
| 공용 타입 / Supabase 클라이언트 / 미들웨어 | ✅ |
| DB 스키마 + RLS | ✅ |
| 인증 (로그인/인증번호 UI + SMS API) | ✅ 스캐폴드 (세션 발급 TODO) |
| 동네 검색/설정 페이지 + API | ✅ 스캐폴드 |
| 상품 CRUD 페이지 + API | ✅ 스캐폴드 |
| 채팅 (방 생성/실시간 메시지) | ✅ 스캐폴드 |
| PRD 문서 | ✅ 본 문서 |
| `npm install` / 빌드 검증 | ⬜ (환경에 node_modules 없음) |

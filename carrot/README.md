# 당근마켓 클론 (Carrot Market Clone)

당근마켓의 핵심 기능을 학습/클론한 프로젝트입니다. 독립 Next.js 16 앱으로 구성되어 있으며, da24 레포 내부에 별도 폴더로 존재합니다.

## 핵심 기능

1. **인증** — 휴대폰 번호 + SMS(솔라피) 기반 가입/로그인
2. **동네 인증/검색/관심** — 동네 설정, 동네 필터, 관심 동네 저장
3. **중고거래 글 CRUD + 이미지** — 상품 등록/수정/삭제/목록/상세 + Supabase Storage 이미지
4. **1:1 실시간 채팅** — Supabase Realtime 기반 판매자-구매자 채팅

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript 5 (strict)
- Tailwind CSS 4
- Supabase (Auth / DB / Realtime / Storage)
- Solapi (SMS 인증번호 발송)

## 시작하기

```bash
cd carrot
cp .env.example .env.local
# .env.local에 Supabase / Solapi 키 입력
npm install
npm run dev
```

`http://localhost:3000` 에서 확인하세요.

## 디렉토리 구조

```
carrot/
├── app/
│   ├── (auth)/           # 로그인/인증 라우트 그룹
│   ├── products/         # 중고거래 글 (목록/상세/등록/수정)
│   ├── chats/            # 1:1 채팅
│   ├── neighborhood/     # 동네 설정
│   ├── favorites/        # 관심 상품
│   ├── profile/          # 프로필
│   └── api/              # API 라우트 (SMS 인증, CRUD)
├── components/           # 공용 컴포넌트
├── lib/
│   └── supabase/         # Supabase 클라이언트 (브라우저/서버)
├── supabase/
│   └── schema.sql        # DB 스키마 (RLS 포함)
└── docs/
    └── PRD.md            # 제품 요구사항 문서
```

## 관련 문서

- [PRD](./docs/PRD.md) — 제품 요구사항 정의서
- [DB 스키마](./supabase/schema.sql) — Supabase 초기 스키마 + RLS

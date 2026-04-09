@AGENTS.md

# da24 인터넷 비교 서비스

## 프로젝트 개요
- **레퍼런스**: https://da24.co.kr/internet
- **기술 스택**: Next.js 16 (App Router) + Tailwind CSS 4 + Supabase + TypeScript
- **경로**: /Users/bangju/Documents/PROGRAM/da24/internet
- **배포**: https://internet-nu.vercel.app
- **GitHub**: https://github.com/redbear7/da24-internet (private)

## Multica 에이전트 구성
| 에이전트 | 역할 | 담당 영역 |
|---------|------|----------|
| da24 프론트엔드 | 컴포넌트, 페이지 개발 | components/, app/page.tsx, lib/ |
| da24 백엔드 | Supabase, API, 배포 | app/api/, lib/supabase.ts, supabase/ |
| da24 디자인 | UI/UX, DESIGN.md 기반 디자인 | components/, globals.css, ColorModeToggle |

## 핵심 파일
- `DESIGN.md` — 디자인 시스템 명세
- `DESIGN-linear-reference.md` — Linear 디자인 참고
- `DESIGN-airbnb-reference.md` — Airbnb 디자인 참고
- `DESIGN-replicate-reference.md` — Replicate 디자인 참고
- `app/globals.css` — CSS 변수 (블루/Airbnb/Replicate 컬러 모드)
- `lib/types.ts` — 타입 정의
- `lib/plans.ts` — Supabase 요금제 조회
- `supabase/schema.sql` — DB 스키마

## 컬러 모드
- **블루** (기본): #2640E6 — 다이사 오리지널
- **Airbnb**: #FF385C — 따뜻한 레드
- **Replicate**: #EA2804 — 비비드 오렌지레드

## 규칙
- 라이트모드 전용 (다크모드 없음)
- 모바일 퍼스트: max-width 640px
- 한국어로 커밋 메시지 작성
- DESIGN.md의 Do's/Don'ts 준수
- 변경 후 `npm run build` 확인

## Multica CLI
```bash
multica issue list                    # 이슈 목록
multica issue create --title "..." --assignee "da24 디자인" --priority high
multica agent list                    # 에이전트 목록
multica daemon status                 # 데몬 상태
```

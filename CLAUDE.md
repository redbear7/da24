@AGENTS.md

# da24 — 다이사 홈서비스 플랫폼

## 프로젝트 개요
- **레퍼런스**: https://da24.co.kr
- **기술 스택**: Next.js 16 (App Router) + Tailwind CSS 4 + Supabase + TypeScript
- **경로**: /Users/bangju/Documents/PROGRAM/da24
- **GitHub**: https://github.com/redbear7/da24 (private)

## 라우팅 구조
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 메인 홈 | 이사 카테고리 + 부가서비스 + 리뷰 |
| `/internet` | 인터넷 비교 | 통신사 비교 + 요금제 + 상담 신청 |
| `/clean` | 입주청소 | 청소 서비스 상담 신청 |
| `/aircon` | 에어컨 | 에어컨 설치/이전 서비스 |
| `/moving` | 이사 견적 | 가정/소형/사무실 이사 견적 요청 |
| `/chat` | 채팅내역 | 인증 후 채팅 목록 |
| `/history` | 신청내역 | 인증 후 신청 내역 |

## Multica 에이전트
| 에이전트 | 역할 | 담당 영역 |
|---------|------|----------|
| da24 프론트엔드 | 컴포넌트, 페이지 | components/, app/, lib/ |
| da24 백엔드 | Supabase, API, 배포 | app/api/, supabase/ |
| da24 디자인 | UI/UX, DESIGN.md | globals.css, 컴포넌트 스타일 |

## 컬러 모드
- **블루** (기본): #2640E6
- **레드**: #EA2804

## 규칙
- 라이트모드 전용
- 모바일 퍼스트: max-width 640px
- 한국어 커밋 메시지
- DESIGN.md Do's/Don'ts 준수
- 변경 후 `npm run build` 확인

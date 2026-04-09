# da24 인터넷 비교 서비스 — Design System

> Reference: da24.co.kr/internet (이사 매칭 플랫폼의 인터넷 가입 비교 서비스)
> Inspired by: Linear (precision), Stripe (card system)
> Stack: Next.js 16 + Tailwind CSS 4 + next-themes

---

## 1. Visual Theme & Atmosphere

da24 인터넷 페이지는 **화이트 캔버스 위의 기능 중심 UI**다. 불필요한 장식 없이 정보 계층이 명확하며, 파란색 하단 고정 바가 전체 흐름을 지배한다. 모바일 퍼스트로 설계되어 max-width 640px 내에서 모든 콘텐츠가 배치된다.

**Key Characteristics:**
- 화이트 배경 + 미니멀 카드 UI (그라디언트 히어로 없음)
- 파란색 하단 고정 바 (예상 요금 + CTA)
- 통신사 로고는 텍스트 로고 (kt, U+, SK)
- 한 화면에 핵심 플로우 완결: 유형 선택 → 통신사 → 요금제 → 상담 신청
- 다크모드/시스템모드 지원 (next-themes)

---

## 2. Color Palette & Roles

### Light Mode (default)

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Background | `--background` | `#FFFFFF` | 페이지 배경 |
| Foreground | `--foreground` | `#1A1A2E` | 기본 텍스트 |
| Muted | `--muted` | `#F4F6F9` | 비활성 탭, 서브 배경 |
| Muted Foreground | `--muted-foreground` | `#8D95A7` | 비활성 텍스트, placeholder |
| Card | `--card` | `#FFFFFF` | 카드 배경 |
| Border | `--border` | `#E5E7EB` | 카드/탭 테두리 |
| Border Subtle | `--border-subtle` | `#F0F1F5` | 가벼운 구분선 |
| Primary | `--primary` | `#3B5BDB` | CTA, 활성 탭, 링크 |
| Primary Foreground | `--primary-foreground` | `#FFFFFF` | 프라이머리 위 텍스트 |
| Secondary | `--secondary` | `#F0F4FF` | 선택 정보 박스 배경 |
| Accent | `--accent` | `#FF4D4D` | 지원금 강조, 인기 뱃지 |
| Text Secondary | `--text-secondary` | `#5A6278` | 부가 설명 텍스트 |
| Text Muted | `--text-muted` | `#8D95A7` | 날짜, 메타 정보 |
| Bottom Bar BG | `--bottom-bar-bg` | `#3B5BDB` | 하단 고정 바 배경 |

### Dark Mode

| Role | Token | Value |
|------|-------|-------|
| Background | `--background` | `#0F1117` |
| Foreground | `--foreground` | `#E8EBF0` |
| Muted | `--muted` | `#1A1D27` |
| Muted Foreground | `--muted-foreground` | `#6B7280` |
| Card | `--card` | `#1A1D27` |
| Border | `--border` | `#2A2D37` |
| Border Subtle | `--border-subtle` | `#22252F` |
| Primary | `--primary` | `#5B7CF7` |
| Secondary | `--secondary` | `#1E2235` |
| Accent | `--accent` | `#FF6B6B` |
| Bottom Bar BG | `--bottom-bar-bg` | `#1E2235` |

### Provider Brand Colors

| Provider | Light | Dark |
|----------|-------|------|
| KT | `#000000` (로고 텍스트) | `#FFFFFF` |
| LG U+ | `#E6007E` | `#FF4DA6` |
| SK | `#EA002C` | `#FF4D6A` |

---

## 3. Typography Rules

### Font Family
- **Primary**: `Pretendard`, fallbacks: `Apple SD Gothic Neo, Malgun Gothic, sans-serif`
- Korean-first font stack: 한글 자간과 렌더링 최적화

### Hierarchy

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Page Title | 22–26px | 700 (bold) | 1.3 | 메인 카피 "통신사, 오래 쓴다고..." |
| Section Title | 16px | 700 | 1.4 | "가입 유형 선택", "통신사 선택" |
| Body | 14–15px | 500 | 1.5 | 설명 텍스트, 요금제 카드 내용 |
| Caption | 12–13px | 500 | 1.4 | 부가 정보, 탭 라벨 |
| Small | 10–11px | 400 | 1.3 | 약관, 면책 조항 |
| Price Large | 20px | 800 | 1.0 | 요금제 가격 표시 |
| Price Display | 20px | 800 | 1.0 | 하단 바 예상 요금 |

---

## 4. Spacing Scale

Tailwind 기본 4px 배수 시스템 사용:
- `px-5` (20px): 좌우 콘텐츠 패딩
- `py-3` ~ `py-4`: 버튼 내부 패딩
- `gap-3`: 카드 간격
- `mb-4` ~ `mb-6`: 섹션 간 마진
- `rounded-xl` (12px): 카드, 버튼 기본
- `rounded-full`: 뱃지, 토글

---

## 5. Component Styles

### Header
```
position: sticky top-0
height: 64px (h-16)
background: card
border-bottom: 1px solid border
max-width: 640px centered
children: logo(left) + buttons(right)
buttons: 테두리 둥근 pill 스타일, primary 색상
```

### Plan Type Tabs (가입유형)
```
layout: grid-cols-4
container: border border-border rounded-xl overflow-hidden
active tab: bg-card text-primary
inactive tab: bg-muted text-muted-foreground
font: 13-14px semibold
no icons — text only (matches original)
```

### Provider Cards (통신사)
```
layout: grid-cols-4 gap-3
card: h-72px rounded-xl border-2
active: border-primary bg-card shadow-sm
inactive: border-border opacity-40
logo: TEXT-BASED (not image)
  kt → font-800 28px black
  U+ → font-800 28px magenta
  SK → font-700 26px italic red
  알뜰인터넷 → font-600 14px gray
```

### Plan Card (요금제)
```
container: bg-card rounded-xl border-2 p-4
active: border-primary shadow-sm
inactive: border-border
layout:
  row1: [plan name + speed] [price right-aligned]
  row2: benefit chips (bg-muted rounded-md)
  row3: separator + install fee / subsidy
popular badge: absolute -top-2.5, bg-accent text-white rounded-full
selected check: absolute top-3.5 right-3.5, bg-primary rounded-full
```

### Bottom Bar (하단 고정)
```
position: fixed bottom-0 w-full z-50
background: primary (light) / secondary (dark)
layout:
  row1: 예상 요금 라벨 — 금액 (20px bold)
  row2: 지원금 라벨 — 금액 + "?"
  row3: "설치 다음날 바로 지급" (10px)
  CTA: bg-white text-primary rounded-xl py-4 font-bold
safe-area-inset-bottom 적용
```

### Consultation Modal
```
position: fixed inset-0 z-100
backdrop: bg-black/50 backdrop-blur-sm
modal: bg-card rounded-t-3xl (mobile) / rounded-2xl (desktop)
animation: slide-up 0.3s
form fields: bg-card border-border rounded-xl
submit: bg-primary text-primary-foreground rounded-xl
```

---

## 6. Layout Principles

- **Max Width**: 640px centered — 모바일 앱 느낌
- **Content Padding**: px-5 (20px) 양쪽
- **Section Flow**: Header → Hero Text → 유형 선택 → 통신사 → 요금제 → Footer
- **Dividers**: `<hr className="border-border">` 섹션 사이
- **Bottom Bar**: 항상 화면 하단에 고정, 스크롤과 무관

### Responsive Behavior
- `max-w-[640px] mx-auto` — 모든 섹션 동일
- 모바일(~640px): 기본 레이아웃
- 태블릿/데스크탑(640px+): 중앙 정렬, 동일 폭 유지
- 상담 모달: 모바일 = 바텀 시트, 데스크탑 = 중앙 모달

---

## 7. Dark Mode Rules

- `next-themes` attribute="class" 방식
- ThemeToggle: 헤더 우측, 3개 아이콘 (Sun/Moon/Monitor)
- 모든 색상은 CSS 변수 → Tailwind @theme inline 매핑
- `dark:invert` → 로고 이미지에만 적용
- Bottom Bar: light = primary blue, dark = secondary dark surface
- Provider 로고 색상: dark에서 밝기 반전 (kt: black→white)

---

## 8. Do's and Don'ts

### Do's
- 화이트 캔버스 위에 카드 UI 배치
- 파란색 CTA에 집중 (primary 하나만 강조)
- 통신사 로고는 텍스트 로고 사용 (원본 동일)
- 모바일 퍼스트: 640px max-width
- 한 화면 내 전체 플로우 완결
- 가격은 항상 우측 정렬, 큰 글씨

### Don'ts
- 그라디언트 히어로 배너 사용 금지 (원본에 없음)
- 과도한 그림자/글로우 효과 금지
- 아이콘 남발 금지 (최소한의 lucide-react만)
- 3개 이상 색상 동시 사용 금지 (primary + accent만)
- provider 카드에 실제 로고 이미지 사용 금지 (텍스트 로고만)

---

## 9. Animation & Interaction

| Element | Trigger | Animation |
|---------|---------|-----------|
| Tab switch | click | 즉시 (no transition) |
| Provider select | click | border-color 150ms ease |
| Plan card select | click | border-color + shadow 150ms |
| CTA button | press | scale(0.98) 100ms |
| Modal open | trigger | translateY(100% → 0) 300ms ease-out |
| Modal backdrop | open | opacity(0 → 1) 200ms |
| Theme toggle | click | 즉시 (class swap) |

---

## 10. Reference Files

| File | Purpose |
|------|---------|
| `DESIGN.md` | 이 파일 — 디자인 시스템 명세 |
| `DESIGN-linear-reference.md` | Linear 디자인 시스템 참고 |
| `app/globals.css` | CSS 변수 정의 (light/dark) |
| `components/ThemeProvider.tsx` | next-themes wrapper |
| `components/ThemeToggle.tsx` | 라이트/다크/시스템 토글 |

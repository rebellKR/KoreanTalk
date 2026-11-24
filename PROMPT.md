# KoreanTalk — 일본인을 위한 한국어 학습 웹앱 제작 프롬프트

> 사용법: AI(Claude Code 등)에게 **이 파일과 DESIGN.md**를 먼저 읽히고, 마지막에
> **"PROMPT.md와 DESIGN.md를 읽고 STAGE 1만 진행해줘"** 처럼 단계를 하나씩 지시한다.
> 각 단계가 끝나면 iPhone에서 화면을 확인하고, 수정 요청 → 다음 단계로 넘어간다.

---

## 0. 너의 역할과 진행 규칙 (AI가 반드시 지킬 것)

- 너는 초보자와 함께 일하는 시니어 프론트엔드 개발자다. 나는 개발자가 아니다.
- **한 번에 지정된 STAGE 하나만** 만든다. 다음 단계 기능을 미리 만들지 않는다.
- 디자인 판단은 항상 DESIGN.md를 따른다. 충돌 시 DESIGN.md 우선.
- 각 STAGE가 끝나면 반드시 아래 3가지를 출력하고 **멈춘다**:
  1. 이번에 만든 것 요약 (3~5줄)
  2. iPhone에서 확인할 체크리스트
  3. Git 커밋 명령어 (`git add` / `git commit -m "..."` / `git push`)
- 코드 수정 시 변경된 부분만 보여준다. 전체 파일 재출력 금지 (새 파일은 예외).
- 중요한 코드 줄에는 한국어 주석을 단다.
- 설명은 한국어, **앱 화면에 보이는 문구는 일본어(기본값)**.
- 모르는 요구사항은 추측해서 크게 만들지 말고, 작게 만든 뒤 질문한다.

---

## 1. 프로젝트 개요

- 앱 이름: **KoreanTalk** (일본어 표기: 韓国語トーク)
- 대상: 한국어를 공부하는 일본인 (20~30대, 초급~중급). 번역기를 오가며 공부하는 불편함을 없애는 것이 목적.
- 주 사용 환경: **iPhone 17 / Safari**, 홈 화면에 추가해서 앱처럼 사용 (PWA)
- 운영: 서버 없음, 무료. PC를 항상 켜둘 수 없으므로 **GitHub Pages 정적 호스팅**.
- 데이터 저장: 기기 내 `localStorage` (로그인 없음). 백업은 JSON 내보내기/불러오기.
- 지역 기준: 일본 (시간대 Asia/Tokyo, 날짜 표기 `2026年11月24日`, 요일 `月火水木金土日`).

## 2. 기술 스택 (변경 시 이유를 먼저 설명할 것)

- Vite + React + TypeScript
- Tailwind CSS (다크모드는 `class` 방식)
- React Router (HashRouter — GitHub Pages 새로고침 404 방지)
- 상태 관리: React Context + localStorage (외부 라이브러리 최소화)
- 발음 듣기: 브라우저 내장 Web Speech API (`ko-KR` 음성, 무료)
- PWA: `vite-plugin-pwa` (STAGE 7에서 적용)
- 아이콘: `lucide-react` (outline 스타일 통일)
- 폰트: Noto Sans JP / Noto Sans KR / Inter (Google Fonts)
- 색상: DESIGN.md의 토큰을 **CSS 변수**(`--color-primary` 등)로 정의 → Tailwind에서 참조
- 학습 데이터: `src/data/*.json` 파일로 분리 (나중에 데이터만 추가하면 늘어나는 구조)

## 3. 디자인 가이드
- **모든 디자인은 `DESIGN.md`(Korean Talk – Design System)를 최우선으로 따른다.** 매 STAGE 시작 전에 다시 읽을 것.
- 색상·폰트 크기·radius는 하드코딩하지 말고 디자인 토큰(CSS 변수)만 사용한다.
- iPhone 17 대응 필수:
  - `viewport-fit=cover` + `env(safe-area-inset-*)`로 다이내믹 아일랜드/홈 바 영역 피하기
  - 높이는 `100vh` 대신 `100dvh`
  - 입력창 글자 16px 이상 (확대 줌 방지)
  - 터치 영역 최소 44×44px
- 한국어 문장 아래에 **일본어 번역**, 필요 시 **カタカナ 발음 표기**(설정에서 ON/OFF).

## 4. 화면 구성 (하단 탭 5개 — DESIGN.md 기준)

| 탭 | 일본어 라벨 | 아이콘(Lucide) | 내용 |
|---|---|---|---|
| Home | ホーム | `House` | 인사말, 오늘의 목표, 오늘의 표현, 카테고리 카드, 최근 학습 |
| Conversation | 会話 | `MessagesSquare` | 상황별 회화 카테고리 → 레슨 상세 |
| Vocabulary | 単語 | `BookOpen` | 검색, 카테고리 필터, 단어 목록, 단어카드 모드 |
| Favorites | お気に入り | `Star` | 즐겨찾기한 표현·단어 |
| My Page | マイページ | `User` | 학습 통계, 연속 학습일, 목표, 설정 바로가기 |

- **ハングル基礎 / 文法 / TOPIK**은 탭이 아니라 **Home의 카테고리 카드**에서 진입한다.
- **設定**은 My Page 안의 하위 화면이다.

## 5. 데이터 구조 (초안)

```ts
// 단어
type Word = {
  id: string;            // "food-001"
  ko: string;            // "맛있다"
  ja: string;            // "おいしい"
  kana?: string;         // "マシッタ"
  category: string;      // "food"
  level: 1 | 2 | 3 | 4 | 5 | 6; // TOPIK 기준 난이도
  example?: { ko: string; ja: string };
};

// 문법 / 표현
type Lesson = {
  id: string;
  type: "grammar" | "expression" | "hangul";
  title: { ko: string; ja: string };
  explanation: string;   // 일본어 설명
  examples: { ko: string; ja: string; kana?: string }[];
  level: number;
};

// TOPIK 연습 문제 (오리지널 문제만)
type Question = {
  id: string;
  level: "I" | "II";     // TOPIK I(1~2급) / II(3~6급)
  section: "reading" | "vocab" | "grammar";
  question: string;      // 한국어 문제
  choices: string[];     // 4지선다
  answer: number;        // 정답 index
  explanationJa: string; // 일본어 해설
};

// 학습 기록 (localStorage)
type Progress = {
  cards: Record<string, { box: number; nextReview: string; correct: number; wrong: number }>;
  favorites: string[];
  wrongNotes: string[];
  streak: { lastDate: string; count: number };
};
```

## 6. 저작권 규칙 (중요)

- TOPIK **기출문제 본문을 앱에 넣지 않는다.** 대신:
  - 기출문제는 **TOPIK 공식 사이트 링크**로 연결
  - 앱 안의 문제는 TOPIK 형식을 참고한 **오리지널 연습 문제**만 작성
- 교재/사이트의 예문·해설을 그대로 복사하지 않는다. 예문은 직접 작성.

---

## 7. 단계별 제작 계획

### STAGE 1 — 뼈대 + 디자인 시스템 기반
- Vite + React + TS + Tailwind 프로젝트 생성, 폴더 구조 설명
- DESIGN.md 색상 토큰을 CSS 변수로 정의 (Light/Dark 각각), 폰트 3종 적용
- 공통 컴포넌트: `Card`, `Button`, `ProgressBar`, `PageHeader`, `TabBar`
- 하단 탭 5개(ホーム/会話/単語/お気に入り/マイページ) + 각 탭 빈 화면
- 테마: ライト / ダーク / 自動 (임시 전환 버튼, 정식 UI는 STAGE 2)
- iPhone safe-area 대응
- **iPhone 확인 방법**: `npm run dev -- --host` → 같은 Wi-Fi에서 iPhone Safari로 PC IP 접속
- GitHub 저장소 연결 (`git init` ~ 첫 `git push`)
- ✅ 확인: 탭 전환, 다크모드 색이 DESIGN.md와 일치하는지, 아일랜드·홈바에 가리지 않는지

### STAGE 2 — マイページ + 設定
- マイページ: 통계 카드 자리(더미 숫자), 連続学習日数, 学習目標, 設定 바로가기
- 設定: テーマ(ライト/ダーク/自動), 文字サイズ(小/中/大), カタカナ発音 ON/OFF,
  読み上げ速度(0.7x/1.0x)+音声テスト, 1日の目標, バックアップ/復元(JSON)/リセット(확인 필수), アプリについて
- 모든 설정 localStorage 저장
- ✅ 확인: 새로고침 후 설정 유지, 다크모드 독립 디자인 확인

### STAGE 3 — 単語 (Vocabulary)
- 검색창(한국어·일본어 모두), 카테고리 필터 칩
- 리스트: 한국어 단어 / 일본어 뜻 / ⭐ 즐겨찾기 상태
- 카테고리 예: あいさつ, 食べ物, カフェ, 買い物, 交通, 感情, 恋愛, 仕事, SNS・若者言葉, 数字 (각 20단어+)
- カード学習 모드: 플립, 🔊 발음, 「覚えた/まだ」, 라이트너 5단계 복습
- ✅ 확인: 검색 속도, 플립 애니메이션, 소리(iPhone 무음 모드 주의)

### STAGE 4 — 会話 (Conversation) + レッスン詳細
- 상황별 카테고리 카드 (カフェ, デート, ショッピング, 旅行, 友達とカトク, 病院, 職場 등) + 난이도 표시 + 표현 미리보기
- レッスン詳細: 큰 한국어 문장, 일본어 번역, カタカナ 발음, 🔊 재생, 어휘 설명, ⭐, 이전/다음
- 레슨 완료 시 작은 축하 효과 + 친근한 성공 메시지 (과하지 않게)
- ✅ 확인: 한국어 문장이 가장 눈에 띄는지, 한 손 조작 편한지

### STAGE 5 — お気に入り + ホーム
- お気に入り: 표현/단어 탭 구분, 해제 가능
- ホーム: 시간대별 인사(おはよう/こんにちは/こんばんは, 일본 시간), 今日の目標 ProgressBar,
  今日のひとこと(매일 변경), 카테고리 카드(会話/単語/ハングル基礎/文法/TOPIK), 最近の学習
- ✅ 확인: 처음 열었을 때 무엇을 하면 될지 바로 보이는지

### STAGE 6 — 학습 콘텐츠 (Home 카테고리에서 진입)
- ハングル基礎: 자음/모음 표, 탭하면 발음, 받침 설명
- 文法: 레벨별 문법 카드 (일본어 설명, 예문 3개+)
- TOPIK: I/II → 語彙・文法・読解, 오리지널 4지선다(레벨당 20문제+), 결과·일본어 해설, 間違いノート, 공식 사이트 過去問 링크
- マイページ 통계에 실제 학습 기록 연결
- ✅ 확인: 문제 풀이 흐름이 끊기지 않는지

### STAGE 7 — PWA + 배포
- `vite-plugin-pwa`: 홈 화면 아이콘, 앱 이름, 오프라인 동작, `apple-touch-icon`
- GitHub Actions → GitHub Pages 자동 배포
- 「共有 → ホーム画面に追加」 안내 화면
- ✅ 확인: 홈 화면 아이콘 실행, 비행기 모드에서 열림, 공유 URL 동작

### STAGE 8 이후 — 추가 기능 후보
- 퀴즈 모드(일→한 / 한→일 / 듣고 고르기), 주간 통계·잔디 캘린더, 학습 알림(가능 범위 먼저 설명),
  한/일 UI 전환, 나만의 단어장, 데이터 대량 추가

## 8. 매 단계 공통 완료 기준
- iPhone 17 Safari에서 레이아웃 깨짐 없음 (세로 화면 기준)
- 라이트/다크 모드 둘 다 확인
- 콘솔 에러 없음, `npm run build` 성공
- 커밋 메시지 형식: `feat: STAGE 3 単語カード 추가` 처럼 단계 번호 포함

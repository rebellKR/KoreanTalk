# KoreanTalk — 일본인을 위한 한국어 학습 웹앱 제작 프롬프트

> 사용법: AI(Claude Code 등)에게 **이 파일과 DESIGN.md**를 먼저 읽히고,
> **"PROMPT.md와 DESIGN.md를 읽고 STAGE 7 진행해줘"** 처럼 단계를 하나씩 지시한다.
> 각 단계가 끝나면 iPhone에서 화면을 확인하고, 수정 요청 → 다음 단계로 넘어간다.
>
> **현재 상태 (2026年11月25日)**: STAGE 1~6 완료 + 재미 요소·대량 데이터 추가 완료. 다음은 **STAGE 7 (PWA + 배포)**.

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
- 데이터 추가는 "많을수록 좋다". 단, 추가 후 `python3 scripts/check_data.py`로 검사한다.

---

## 1. 프로젝트 개요

- 앱 이름: **KoreanTalk** (일본어 표기: 韓国語トーク)
- 대상: 한국어를 공부하는 일본인 (20~30대, 초급~중급). 번역기를 오가며 공부하는 불편함을 없애는 것이 목적.
- 주 사용 환경: **iPhone 17 / Safari**, 홈 화면에 추가해서 앱처럼 사용 (PWA)
- 운영: 서버 없음, 무료. **GitHub Pages 정적 호스팅**.
- 데이터 저장: 기기 내 `localStorage` (로그인 없음). 백업은 JSON 내보내기/불러오기.
- 지역 기준: 일본 (시간대 Asia/Tokyo, 날짜 표기 `2026年11月24日`, 요일 `月火水木金土日`).

## 2. 기술 스택 (실제 사용 중)

- Vite 8 + React 19 + TypeScript 5.9
- Tailwind CSS v4 (`@tailwindcss/vite`, `@theme inline`으로 CSS 변수 참조, 다크모드 `@custom-variant dark`)
- React Router 7 — **HashRouter** (GitHub Pages 새로고침 404 방지)
- 상태 관리: React Context 3개 + localStorage
  - `ThemeProvider` (`kt-theme`) / `SettingsProvider` (`kt-settings`) / `ProgressProvider` (`kt-progress`)
- 발음 듣기: Web Speech API (`ko-KR`). Premium/Enhanced 음성 우선 선택, 설정에서 음성 고르기
  - iOS Safari는 compact 음성만 보이는 제한이 있음
- 아이콘: `lucide-react` / 폰트: Noto Sans JP · Noto Sans KR · Inter
- 페이지는 `React.lazy`로 나눠 불러오기, 큰 단어 JSON은 `import.meta.glob`으로 필요할 때만 로드
- PWA: `vite-plugin-pwa` (STAGE 7에서 적용 예정)
- 데이터 처리 스크립트: Python 3 기본 기능만 사용 (`scripts/`)

## 3. 디자인 가이드
- **모든 디자인은 `DESIGN.md`를 최우선으로 따른다.**
- 현재 스타일: Nu 앱(Mobbin) 참고 — 회색 바탕(`bg-surface`) 위 흰 카드, 알약형 버튼, 떠 있는 캡슐형 탭바
- 색상은 CSS 변수만 사용 (`--on-primary`: 라이트 #fff / 다크 #111827 — 다크모드 버튼 글자 가독성용)
- iPhone 17 대응: `viewport-fit=cover` + safe-area, `100dvh`, 입력창 16px 이상, 터치 영역 44px 이상
- 한국어는 `.font-ko`(`word-break: keep-all`), 아래에 일본어 번역 + カタカナ 발음(설정 ON/OFF)
- 애니메이션: pop / shake / bounce-in / slide-up / confetti / drop-in / page-in / float / pulse-red
  — `prefers-reduced-motion` 존중

## 4. 화면 구성

| 탭 | 일본어 라벨 | 경로 | 내용 |
|---|---|---|---|
| Home | ホーム | `/` | 인사(일본 시간), 今日の目標, 今日のひとこと, 카테고리 카드, 最近の学習 |
| Conversation | 会話 | `/conversation` | 상황 32개 · 레벨 필터 → `/conversation/:sid` 레슨 |
| Vocabulary | 単語 | `/vocabulary` | 검색, 카테고리·레벨(初級/中級/上級) 칩, 100개씩 もっと見る → `/vocabulary/study` 카드 학습 |
| Favorites | お気に入り | `/favorites` | 표현/단어 즐겨찾기 |
| My Page | マイページ | `/mypage` | XP·레벨, 연속 학습일, 잔디 캘린더, 배지, `/mypage/settings` |

- Home 카드에서 진입: `/hangul` ハングル基礎, `/grammar` 文法, `/topik` → `/topik/quiz`, `/games` → `/games/speed`, `/games/pair`
- 전체 화면(탭바 없음): 単語カード, 회화 레슨, TOPIK 퀴즈, 게임

## 5. 데이터 (현재 수량)

| 파일 | 내용 | 수량 |
|---|---|---|
| `src/data/words.json` | 직접 만든 카테고리별 단어 (あいさつ, 食べ物 …) | 200 |
| `src/data/vocab/level1~3.json` | 한국어기초사전 단어 (初級 959 / 中級 2,048 / 上級 2,805) | 5,812 |
| `src/data/conversations.json` | 상황별 회화 32개 | 306표현 |
| `src/data/grammar.json` | 레벨별 문법 카드 | 100 |
| `src/data/topik.json` ~ `topik7.json` | 오리지널 TOPIK 연습 문제 (Ⅰ 592 / Ⅱ 413) | 1,005 |
| `src/data/hangul.json` | 자음·모음·받침 | — |

- 타입 정의: `src/types/index.ts` (Word, Phrase, Situation, GrammarItem, TopikQuestion …)
- 학습 기록(`kt-progress`): cards(라이트너 복습 `[0,1,2,4,7,14]`일), favorites, completed, daily, days,
  recent, wrongNotes, topikBest, xp, dayLog, gameBest, badgesSeen, levelSeen

### 데이터 만드는 방법 (자세한 건 `scripts/README.md`)
- 단어: `prepare_wordlist.py` → `xml_to_cache.py`(사전 전체 XML에서 추출, 약 10초) → `build_vocab.py`
  - 카타카나 발음은 `scripts/kana.py`가 발음 규칙(연음·비음화·격음화·구개음화 등)으로 자동 생성
- TOPIK·문법·회화: `data-src/generators/*.py`로 생성 → `check_data.py`로 검사

## 6. 저작권 규칙 (중요)

- TOPIK **기출문제 본문을 앱에 넣지 않는다.** 공식 사이트 링크 + **오리지널 연습 문제**만.
- 교재/사이트의 예문·해설을 그대로 복사하지 않는다.
- 한국어기초사전 데이터는 **CC BY-SA 2.0 KR** — 출처 표시 필수 (`data-src/ATTRIBUTION.md`, 単語 화면 하단).

---

## 7. 단계별 제작 계획

### ✅ STAGE 1 — 뼈대 + 디자인 시스템
### ✅ STAGE 2 — マイページ + 設定 (테마, 글자 크기, カタカナ, 읽기 속도·음성, 목표, 백업/복원/리셋)
### ✅ STAGE 3 — 単語 + カード学習 (플립, 🔊, 覚えた/まだ, 라이트너 복습)
### ✅ STAGE 4 — 会話 + レッスン詳細 (완료 축하 효과)
### ✅ STAGE 5 — お気に入り + ホーム
### ✅ STAGE 6 — ハングル基礎 / 文法 / TOPIK (間違いノート, 해설, 過去問 링크) + 통계 연결
### ✅ 추가 완료 — 재미 요소 + 대량 데이터
- XP·레벨업, 배지, 꽃가루(confetti) 축하, 잔디 캘린더
- 게임: スピードクイズ, ペアマッチ
- 데이터: TOPIK 1,005문제, 회화 306표현, 문법 100, 사전 단어 5,812개

### ⏭ STAGE 7 — PWA + 배포 (다음 작업)
- `vite-plugin-pwa`: 홈 화면 아이콘, 앱 이름, 오프라인 동작, `apple-touch-icon`
  - 단어 JSON(약 1.7MB)도 오프라인 캐시에 포함되는지 확인
- `vite.config.ts`의 `base`를 GitHub 저장소 이름에 맞추기
- GitHub Actions → GitHub Pages 자동 배포
- 「共有 → ホーム画面に追加」 안내 화면
- ✅ 확인: 홈 화면 아이콘 실행, 비행기 모드에서 열림, 공유 URL 동작

### STAGE 8 이후 — 추가 기능 후보
- 「問題を報告」 버튼 (틀린 문제·번역 신고)
- 자연스러운 음성 파일 (Google / Azure / MeloTTS 중 선택 — 미정)
- 퀴즈 모드(일→한 / 한→일 / 듣고 고르기), 학습 알림, 한/일 UI 전환, 나만의 단어장
- 사전 단어 중 뜻이 여러 개인 단어(예: 거치다)의 대표 뜻 다듬기

## 8. 매 단계 공통 완료 기준
- iPhone 17 Safari에서 레이아웃 깨짐 없음 (세로 화면 기준)
- 라이트/다크 모드 둘 다 확인
- 콘솔 에러 없음, `npm run build` 성공, `python3 scripts/check_data.py` 통과
- 커밋 메시지 형식: `feat: STAGE 7 PWA 적용` 처럼 단계 번호 포함

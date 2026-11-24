// 단어 데이터 형식 (PROMPT.md 5. 데이터 구조)
export type Word = {
  id: string            // "food-001"
  ko: string            // 한국어
  ja: string            // 일본어 뜻
  kana?: string         // 카타카나 발음
  category: string      // 카테고리 id
  level: number         // 난이도 (TOPIK 기준)
  example?: { ko: string; ja: string }
}

// 회화 표현 하나
export type Phrase = {
  id: string                          // "conv-cafe-01"
  ko: string
  kana?: string
  ja: string
  scene: string                       // 어떤 상황에서 쓰는지 (일본어)
  words: { ko: string; ja: string }[] // 어휘 설명
  tip?: string                        // 문법·문화 포인트 (일본어)
}

// 상황별 회화 묶음 (= 레슨 하나)
export type Situation = {
  id: string
  ja: string
  ko: string
  icon: string        // lucide 아이콘 이름
  level: 1 | 2 | 3    // 난이도
  description: string
  phrases: Phrase[]
}

// 한글 자모
export type Jamo = { char: string; roman: string; sound: string; say: string; exKo: string; exJa: string }
export type Batchim = { sound: string; letters: string; roman: string; how: string; exKo: string; exJa: string }

// 문법 카드
export type GrammarItem = {
  id: string
  level: 1 | 2 | 3
  pattern: string        // 예: "-고 싶다"
  ja: string             // 일본어 의미
  explanation: string    // 일본어 설명
  examples: { ko: string; ja: string }[]
}

// TOPIK 연습 문제 (오리지널)
export type TopikQuestion = {
  id: string
  level: 'I' | 'II'
  section: 'vocab' | 'grammar' | 'reading'
  question: string
  passage?: string       // 읽기 지문
  choices: string[]
  answer: number         // 정답 index (0~3)
  explanationJa: string
}

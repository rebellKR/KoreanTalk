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

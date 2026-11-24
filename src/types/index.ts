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

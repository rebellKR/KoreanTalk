import { SITUATIONS } from './conversations'
import { WORDS, CATEGORIES } from './words'

// 모든 회화 표현을 한 줄로 펼친 목록 (어느 상황의 몇 번째인지 함께)
export const ALL_PHRASES = SITUATIONS.flatMap((s) =>
  s.phrases.map((p, index) => ({ ...p, situation: s, index })),
)

export const findPhrase = (id: string) => ALL_PHRASES.find((p) => p.id === id)
export const findWord = (id: string) => WORDS.find((w) => w.id === id)
export const categoryName = (id: string) => (id === 'all' ? 'すべて' : CATEGORIES.find((c) => c.id === id)?.ja ?? id)

import type { Jamo, Batchim, GrammarItem, TopikQuestion } from '../types'
import hangulRaw from './hangul.json'
import grammarRaw from './grammar.json'
import topikRaw from './topik.json'

// 학습 데이터 (각 json 파일에 추가하면 자동으로 늘어남)
export const HANGUL = hangulRaw as { consonants: Jamo[]; vowels: Jamo[]; batchim: Batchim[] }
export const GRAMMAR = grammarRaw as GrammarItem[]
export const TOPIK = topikRaw as TopikQuestion[]

export const SECTION_LABEL = { vocab: '語彙', grammar: '文法', reading: '読解' } as const

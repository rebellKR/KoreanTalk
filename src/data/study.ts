import type { Jamo, Batchim, GrammarItem, TopikQuestion } from '../types'
import hangulRaw from './hangul.json'
import grammarRaw from './grammar.json'
import topikRaw from './topik.json'
import topik2Raw from './topik2.json'
import topik3Raw from './topik3.json'
import topik4Raw from './topik4.json'

// 학습 데이터 (각 json 파일에 추가하면 자동으로 늘어남)
export const HANGUL = hangulRaw as { consonants: Jamo[]; vowels: Jamo[]; batchim: Batchim[] }
export const GRAMMAR = grammarRaw as GrammarItem[]
// 문제는 여러 파일로 나눠 관리 (topik.json + topik2.json …) → 하나로 합침
export const TOPIK = [...topikRaw, ...topik2Raw, ...topik3Raw, ...topik4Raw] as TopikQuestion[]

export const SECTION_LABEL = { vocab: '語彙', grammar: '文法', reading: '読解' } as const

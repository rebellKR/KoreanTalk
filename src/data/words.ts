import type { Word } from '../types'
import raw from './words.json'

// 단어 목록 (데이터는 words.json에 추가하면 자동으로 늘어남)
export const WORDS = raw as Word[]

// 카테고리 목록: id는 words.json의 category와 같아야 함
export const CATEGORIES: { id: string; ja: string; ko: string }[] = [
  { id: 'greeting', ja: 'あいさつ', ko: '인사' },
  { id: 'food', ja: '食べ物', ko: '음식' },
  { id: 'cafe', ja: 'カフェ', ko: '카페' },
  { id: 'shopping', ja: '買い物', ko: '쇼핑' },
  { id: 'transport', ja: '交通', ko: '교통' },
  { id: 'feelings', ja: '感情', ko: '감정' },
  { id: 'love', ja: '恋愛', ko: '연애' },
  { id: 'work', ja: '仕事', ko: '일' },
  { id: 'sns', ja: 'SNS・若者言葉', ko: 'SNS' },
  { id: 'numbers', ja: '数字', ko: '숫자' },
]

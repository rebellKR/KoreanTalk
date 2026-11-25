import { useEffect, useState } from 'react'
import type { Word } from '../types'

// 한국어기초사전에서 만든 레벨별 단어 (src/data/vocab/level1~3.json)
// 파일이 크기 때문에 필요할 때만 불러옴 (앱 시작을 가볍게)
const files = import.meta.glob<{ default: Word[] }>('./vocab/level*.json')
const pathOf = (n: number) => `./vocab/level${n}.json`

export const LEVELS = [1, 2, 3].filter((n) => pathOf(n) in files) // 실제로 파일이 있는 레벨만
export const LEVEL_JA: Record<number, string> = { 1: '初級', 2: '中級', 3: '上級' }

const cache: Record<number, Word[]> = {}

export async function loadLevel(n: number): Promise<Word[]> {
  if (cache[n]) return cache[n]
  const loader = files[pathOf(n)]
  if (!loader) return []
  cache[n] = (await loader()).default
  return cache[n]
}

// 화면에서 쓰는 훅: 레벨 단어를 불러와서 돌려줌 (불러오는 중이면 null)
export function useLevelWords(levels: number[], enabled = true): Word[] | null {
  const key = levels.join(',')
  const [words, setWords] = useState<Word[] | null>(null)
  useEffect(() => {
    if (!enabled) return
    let alive = true
    Promise.all(levels.map(loadLevel)).then((lists) => alive && setWords(lists.flat()))
    return () => { alive = false }
  }, [key, enabled]) // eslint-disable-line
  return enabled ? words : null
}

// 'level1' 같은 카테고리 id → 숫자
export const levelOfCat = (cat: string) => (/^level[1-3]$/.test(cat) ? Number(cat.slice(5)) : 0)

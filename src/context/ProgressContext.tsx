import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { todayJP } from '../utils/date'

// 카드 하나의 암기 상태 (라이트너 박스: 0~5, 숫자가 클수록 잘 외운 카드)
export type CardState = { box: number; next: string; correct: number; wrong: number }

type Progress = {
  cards: Record<string, CardState>
  favorites: string[]
  daily: { date: string; count: number } // 오늘 학습한 카드 수
}

// 박스별 다음 복습까지의 일수 (박스 1 → 1일 뒤, 박스 5 → 14일 뒤)
const INTERVALS = [0, 1, 2, 4, 7, 14]
const STORAGE_KEY = 'kt-progress'
const EMPTY: Progress = { cards: {}, favorites: [], daily: { date: '', count: 0 } }

type Ctx = {
  progress: Progress
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  answer: (id: string, known: boolean) => void // 「覚えた」=true /「まだ」=false
  isDue: (id: string) => boolean                // 오늘 복습할 카드인지 (처음 보는 카드 포함)
  todayCount: number
}
const ProgressContext = createContext<Ctx | null>(null)

function load(): Progress {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return EMPTY
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) // 바뀔 때마다 저장
  }, [progress])

  const today = todayJP()
  const todayCount = progress.daily.date === today ? progress.daily.count : 0 // 날짜가 바뀌면 0부터

  const toggleFavorite = (id: string) =>
    setProgress((p) => ({
      ...p,
      favorites: p.favorites.includes(id) ? p.favorites.filter((f) => f !== id) : [...p.favorites, id],
    }))

  const answer = (id: string, known: boolean) =>
    setProgress((p) => {
      const prev = p.cards[id] ?? { box: 0, next: today, correct: 0, wrong: 0 }
      // 외웠으면 박스 한 칸 위로, 못 외웠으면 처음(0)으로
      const box = known ? Math.min(prev.box + 1, INTERVALS.length - 1) : 0
      const card: CardState = {
        box,
        next: todayJP(INTERVALS[box]),
        correct: prev.correct + (known ? 1 : 0),
        wrong: prev.wrong + (known ? 0 : 1),
      }
      const daily = p.daily.date === today ? { date: today, count: p.daily.count + 1 } : { date: today, count: 1 }
      return { ...p, cards: { ...p.cards, [id]: card }, daily }
    })

  const isDue = (id: string) => {
    const c = progress.cards[id]
    return !c || c.next <= today
  }

  return (
    <ProgressContext.Provider
      value={{ progress, isFavorite: (id) => progress.favorites.includes(id), toggleFavorite, answer, isDue, todayCount }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress는 ProgressProvider 안에서만 사용')
  return ctx
}

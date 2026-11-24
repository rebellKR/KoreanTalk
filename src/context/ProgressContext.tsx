import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { todayJP } from '../utils/date'

// 카드 하나의 암기 상태 (라이트너 박스: 0~5, 숫자가 클수록 잘 외운 카드)
export type CardState = { box: number; next: string; correct: number; wrong: number }
// 최근 학습 기록 (홈의 「最近の学習」에 표시)
export type Recent = { type: 'words' | 'lesson'; id: string; at: string }

type Progress = {
  cards: Record<string, CardState>
  favorites: string[]
  completed: string[]                                     // 완료한 회화 레슨(상황) id
  daily: { date: string; count: number; lessons: number } // 오늘 학습한 카드 수 / 레슨 수
  days: string[]                                          // 학습한 날짜 목록 (연속 학습일 계산용)
  recent: Recent[]
  wrongNotes: string[]                                    // TOPIK 틀린 문제 id (間違いノート)
  topikBest: Record<string, number>                       // "I-vocab" → 최고 점수(%)
}

// 박스별 다음 복습까지의 일수 (박스 1 → 1일 뒤, 박스 5 → 14일 뒤)
const INTERVALS = [0, 1, 2, 4, 7, 14]
const STORAGE_KEY = 'kt-progress'
const EMPTY: Progress = {
  cards: {}, favorites: [], completed: [], daily: { date: '', count: 0, lessons: 0 }, days: [], recent: [], wrongNotes: [], topikBest: {},
}

type Ctx = {
  progress: Progress
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  answer: (id: string, known: boolean) => void // 「覚えた」=true /「まだ」=false
  isDue: (id: string) => boolean                // 오늘 복습할 카드인지 (처음 보는 카드 포함)
  completeLesson: (id: string) => void
  logRecent: (type: Recent['type'], id: string) => void
  recordTopik: (qid: string, correct: boolean) => void  // 문제 하나 채점 결과 기록
  saveTopikScore: (key: string, percent: number) => void
  todayCount: number                            // 오늘 학습한 카드 수
  todayLessons: number                          // 오늘 완료한 레슨 수
  learnedCount: number                          // 한 번 이상 「覚えた」 한 단어 수
  reviewCount: number                           // 오늘 복습할 (이미 공부한) 카드 수
  streak: number                                // 연속 학습일
}
const ProgressContext = createContext<Ctx | null>(null)

function load(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return { ...EMPTY, ...saved, daily: { ...EMPTY.daily, ...saved.daily } }
  } catch {
    return EMPTY
  }
}

// 오늘 날짜를 학습일 목록에 추가하고, 오늘 기록(daily)을 갱신
function markToday(p: Progress, add: { count?: number; lessons?: number }): Progress {
  const today = todayJP()
  const base = p.daily.date === today ? p.daily : { date: today, count: 0, lessons: 0 }
  return {
    ...p,
    days: p.days.includes(today) ? p.days : [...p.days, today].slice(-400),
    daily: { ...base, count: base.count + (add.count ?? 0), lessons: base.lessons + (add.lessons ?? 0) },
  }
}

// 연속 학습일: 오늘(또는 어제)부터 거꾸로 하루씩 이어진 날 수
function calcStreak(days: string[]) {
  const set = new Set(days)
  let offset = set.has(todayJP()) ? 0 : -1 // 오늘 아직 안 했으면 어제부터 계산
  let n = 0
  while (set.has(todayJP(offset))) { n++; offset-- }
  return n
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) // 바뀔 때마다 저장
  }, [progress])

  const today = todayJP()
  const isToday = progress.daily.date === today

  const toggleFavorite = (id: string) =>
    setProgress((p) => ({
      ...p,
      favorites: p.favorites.includes(id) ? p.favorites.filter((f) => f !== id) : [id, ...p.favorites],
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
      return markToday({ ...p, cards: { ...p.cards, [id]: card } }, { count: 1 })
    })

  const logRecent = (type: Recent['type'], id: string) =>
    setProgress((p) => ({
      ...p,
      // 같은 항목은 맨 앞으로 옮기고, 최대 5개까지만
      recent: [{ type, id, at: today }, ...p.recent.filter((r) => !(r.type === type && r.id === id))].slice(0, 5),
    }))

  const completeLesson = (id: string) => {
    setProgress((p) =>
      markToday({ ...p, completed: p.completed.includes(id) ? p.completed : [...p.completed, id] }, { lessons: 1 }),
    )
    logRecent('lesson', id)
  }

  const recordTopik = (qid: string, correct: boolean) =>
    setProgress((p) => {
      // 틀리면 오답 노트에 추가, 맞히면 오답 노트에서 빼기
      const wrongNotes = correct ? p.wrongNotes.filter((w) => w !== qid) : p.wrongNotes.includes(qid) ? p.wrongNotes : [...p.wrongNotes, qid]
      return markToday({ ...p, wrongNotes }, {})
    })

  const saveTopikScore = (key: string, percent: number) =>
    setProgress((p) => ({ ...p, topikBest: { ...p.topikBest, [key]: Math.max(p.topikBest[key] ?? 0, percent) } }))

  const isDue = (id: string) => {
    const c = progress.cards[id]
    return !c || c.next <= today
  }

  const cards = Object.values(progress.cards)

  return (
    <ProgressContext.Provider
      value={{
        progress,
        isFavorite: (id) => progress.favorites.includes(id),
        toggleFavorite, answer, isDue, completeLesson, logRecent, recordTopik, saveTopikScore,
        todayCount: isToday ? progress.daily.count : 0,
        todayLessons: isToday ? progress.daily.lessons : 0,
        learnedCount: cards.filter((c) => c.box >= 1).length,
        reviewCount: cards.filter((c) => c.next <= today).length,
        streak: calcStreak(progress.days),
      }}
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

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Zap, Flame, RotateCcw, Trophy } from 'lucide-react'
import Button from '../components/Button'
import Confetti from '../components/Confetti'
import { WORDS } from '../data/words'
import type { Word } from '../types'
import { useProgress } from '../context/ProgressContext'

const TIME = 60 // 제한 시간(초)
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)

// 문제 하나 만들기: 정답 단어 + 다른 뜻 3개
function makeQuestion(): { word: Word; options: string[] } {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]
  // 같은 한국어(예: 일=1/仕事)나 같은 뜻은 오답 보기에서 제외 → 정답이 2개가 되지 않게
  const others = [...new Set(shuffle(WORDS.filter((w) => w.ja !== word.ja && w.ko !== word.ko)).map((w) => w.ja))].slice(0, 3)
  return { word, options: shuffle([word.ja, ...others]) }
}

export default function SpeedGame() {
  const navigate = useNavigate()
  const { progress, finishGame } = useProgress()
  const [phase, setPhase] = useState<'ready' | 'play' | 'end'>('ready')
  const [count, setCount] = useState(3)            // 시작 전 3,2,1
  const [left, setLeft] = useState(TIME)           // 남은 시간
  const [q, setQ] = useState(makeQuestion)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [flash, setFlash] = useState<null | { i: number; ok: boolean }>(null)
  const [isBest, setIsBest] = useState(false)
  const lock = useRef(false)

  // 3,2,1 카운트다운
  useEffect(() => {
    if (phase !== 'ready') return
    if (count === 0) { setPhase('play'); return }
    const t = setTimeout(() => setCount((c) => c - 1), 700)
    return () => clearTimeout(t)
  }, [phase, count])

  // 게임 타이머 (0.1초마다)
  useEffect(() => {
    if (phase !== 'play') return
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 0.1)), 100)
    return () => clearInterval(t)
  }, [phase])

  // 시간 종료
  useEffect(() => {
    if (phase === 'play' && left <= 0) {
      setPhase('end')
      setIsBest(finishGame('speed', score, score * 5))
    }
  }, [left, phase]) // eslint-disable-line

  const answer = (i: number) => {
    if (lock.current || phase !== 'play') return
    lock.current = true
    const ok = q.options[i] === q.word.ja
    setFlash({ i, ok })
    if (ok) { setScore((s) => s + 1); setCombo((c) => c + 1) } else setCombo(0)
    navigator.vibrate?.(ok ? 20 : [30, 30, 30])
    setTimeout(() => { setQ(makeQuestion()); setFlash(null); lock.current = false }, ok ? 250 : 600)
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-surface"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
      <header className="flex items-center gap-3 px-4">
        <button onClick={() => navigate(-1)} aria-label="閉じる" className="flex h-11 w-11 items-center justify-center rounded-full active:bg-background"><X size={24} /></button>
        {/* 남은 시간 바 */}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary/10">
          <div className={`h-full rounded-full transition-[width] duration-100 ${left < 10 ? 'bg-error' : 'bg-primary'}`} style={{ width: `${(left / TIME) * 100}%` }} />
        </div>
        <span className={`w-10 text-right text-[15px] font-bold tabular-nums ${left < 10 && phase === 'play' ? 'animate-[pulse-red_0.6s_infinite]' : ''}`}>{Math.ceil(left)}</span>
      </header>

      {phase === 'ready' && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Zap size={40} className="text-primary" />
          <p className="mt-3 text-[15px] text-text-secondary">韓国語の意味を選んでね</p>
          <p key={count} className="mt-6 animate-[pop_0.6s_ease-out] text-[80px] font-bold text-primary tabular-nums">{count || 'GO!'}</p>
        </div>
      )}

      {phase === 'play' && (
        <div className="flex flex-1 flex-col px-6">
          {/* 점수 + 콤보 */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[14px] font-semibold text-text-secondary">スコア <b className="text-[22px] text-text-primary tabular-nums">{score}</b></span>
            {combo >= 3 && (
              <span key={combo} className="flex animate-[pop_0.4s_ease-out] items-center gap-1 rounded-full bg-warning/15 px-3 py-1 text-[13px] font-bold text-warning">
                <Flame size={14} /> {combo} COMBO
              </span>
            )}
          </div>
          {/* 문제 단어 */}
          <div key={q.word.id + score} className="flex flex-1 animate-[page-in_0.2s_ease-out] flex-col items-center justify-center">
            <p className="font-ko text-[44px] font-bold tracking-[-0.02em]">{q.word.ko}</p>
          </div>
          {/* 보기 4개 (2x2) */}
          <div className="grid grid-cols-2 gap-3 pb-4">
            {q.options.map((o, i) => {
              const showOk = flash && o === q.word.ja
              const showNg = flash && flash.i === i && !flash.ok
              return (
                <button key={o + i} onClick={() => answer(i)}
                  className={`min-h-[76px] rounded-2xl px-3 text-[15px] font-semibold ring-1 transition active:scale-95 ${
                    showOk ? 'bg-success text-white ring-success' : showNg ? 'animate-[shake_0.4s] bg-error text-white ring-error' : 'bg-background ring-border/60 dark:bg-border/50'}`}>
                  {o}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'end' && (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          {isBest && score > 0 && <Confetti />}
          <p className="text-[14px] font-semibold text-text-secondary">タイムアップ！</p>
          <p className="mt-2 animate-[pop_0.5s_ease-out] text-[72px] leading-none font-bold tabular-nums">{score}<span className="text-[22px]">問</span></p>
          {isBest && score > 0
            ? <p className="mt-4 flex items-center gap-1 rounded-full bg-warning/15 px-4 py-1.5 text-[14px] font-bold text-warning"><Trophy size={16} /> 自己ベスト更新！</p>
            : <p className="mt-4 text-[13px] text-text-secondary">ベスト：{progress.gameBest.speed ?? 0}問</p>}
          <p className="mt-3 text-[14px] font-bold text-primary">+{score * 5} XP</p>
          <div className="mt-10 flex w-full flex-col gap-2">
            <Button full onClick={() => navigate(0)}><RotateCcw size={18} /> もう一度</Button>
            <Button full variant="ghost" onClick={() => navigate(-1)}>ゲーム一覧へ</Button>
          </div>
        </div>
      )}
    </div>
  )
}

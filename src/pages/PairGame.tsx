import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, RotateCcw, Trophy } from 'lucide-react'
import Button from '../components/Button'
import Confetti from '../components/Confetti'
import { WORDS } from '../data/words'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { speakKorean } from '../utils/speak'

const PAIRS = 6
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)
type Tile = { key: string; wordId: string; text: string; lang: 'ko' | 'ja' }

// 단어 6개 → 한국어 카드 6장 + 일본어 카드 6장
function makeTiles(): Tile[] {
  // 한국어·일본어가 서로 겹치지 않는 단어 6개 고르기
  const picked: typeof WORDS = []
  for (const w of shuffle(WORDS.filter((w) => w.ko.length <= 6))) {
    if (picked.some((p) => p.ko === w.ko || p.ja === w.ja)) continue
    picked.push(w)
    if (picked.length === PAIRS) break
  }
  return shuffle(picked.flatMap((w) => [
    { key: w.id + '-ko', wordId: w.id, text: w.ko, lang: 'ko' as const },
    { key: w.id + '-ja', wordId: w.id, text: w.ja.replace(/（.*）/, ''), lang: 'ja' as const },
  ]))
}

export default function PairGame() {
  const navigate = useNavigate()
  const { progress, finishGame } = useProgress()
  const { settings } = useSettings()
  const [tiles] = useState(makeTiles)
  const [open, setOpen] = useState<number[]>([])       // 지금 뒤집힌 카드 (최대 2장)
  const [matched, setMatched] = useState<string[]>([]) // 맞춘 단어 id
  const [wrong, setWrong] = useState(false)
  const [moves, setMoves] = useState(0)
  const [sec, setSec] = useState(0)
  const [isBest, setIsBest] = useState(false)
  const done = matched.length === PAIRS

  // 경과 시간
  useEffect(() => {
    if (done) return
    const t = setInterval(() => setSec((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [done])

  useEffect(() => {
    if (done) setIsBest(finishGame('pair', moves, 40, true)) // 적은 횟수가 좋은 기록
  }, [done]) // eslint-disable-line

  const flip = (i: number) => {
    const t = tiles[i]
    if (open.length === 2 || open.includes(i) || matched.includes(t.wordId)) return
    if (t.lang === 'ko') speakKorean(t.text, settings.ttsRate)
    const next = [...open, i]
    setOpen(next)
    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = next.map((n) => tiles[n])
      if (a.wordId === b.wordId) {
        // 짝이 맞음
        setTimeout(() => { setMatched((m) => [...m, a.wordId]); setOpen([]) }, 350)
        navigator.vibrate?.(20)
      } else {
        // 틀림 → 잠깐 보여주고 다시 덮기
        setWrong(true)
        setTimeout(() => { setOpen([]); setWrong(false) }, 800)
      }
    }
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-surface"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
      <header className="flex items-center gap-3 px-4">
        <button onClick={() => navigate(-1)} aria-label="閉じる" className="flex h-11 w-11 items-center justify-center rounded-full active:bg-background"><X size={24} /></button>
        <p className="flex-1 text-[15px] font-bold">ペアマッチ</p>
        <span className="text-[13px] font-semibold text-text-secondary tabular-nums">{moves}手 · {sec}秒</span>
      </header>

      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <Confetti />
          <p className="text-[14px] font-semibold text-text-secondary">クリア！</p>
          <p className="mt-2 animate-[pop_0.5s_ease-out] text-[64px] leading-none font-bold tabular-nums">{moves}<span className="text-[22px]">手</span></p>
          <p className="mt-2 text-[13px] text-text-secondary">{sec}秒</p>
          {isBest
            ? <p className="mt-4 flex items-center gap-1 rounded-full bg-warning/15 px-4 py-1.5 text-[14px] font-bold text-warning"><Trophy size={16} /> 自己ベスト更新！</p>
            : <p className="mt-4 text-[13px] text-text-secondary">ベスト：{progress.gameBest.pair}手</p>}
          <p className="mt-3 text-[14px] font-bold text-primary">+40 XP</p>
          <div className="mt-10 flex w-full flex-col gap-2">
            <Button full onClick={() => navigate(0)}><RotateCcw size={18} /> もう一度</Button>
            <Button full variant="ghost" onClick={() => navigate(-1)}>ゲーム一覧へ</Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-4 text-center text-[13px] text-text-secondary">同じ意味の韓国語と日本語をそろえよう</p>
          {/* 카드 3x4 */}
          <div className="grid flex-1 grid-cols-3 content-center gap-3 px-6 [perspective:800px]">
            {tiles.map((t, i) => {
              const isOpen = open.includes(i) || matched.includes(t.wordId)
              const isMatched = matched.includes(t.wordId)
              return (
                <button key={t.key} onClick={() => flip(i)}
                  className={`relative aspect-[3/4] transition-transform duration-300 [transform-style:preserve-3d] ${isOpen ? '[transform:rotateY(180deg)]' : ''} ${isMatched ? 'scale-95 opacity-60' : ''}`}>
                  {/* 뒷면 (덮인 상태) */}
                  <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-[22px] font-bold text-white/80 [backface-visibility:hidden]">?</span>
                  {/* 앞면 */}
                  <span className={`absolute inset-0 flex items-center justify-center rounded-2xl p-2 text-center ring-2 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    isMatched ? 'bg-success/15 ring-success' : wrong && open.includes(i) ? 'animate-[shake_0.4s] bg-error/10 ring-error' : 'bg-background ring-primary/40 dark:bg-border/60'}`}>
                    <span className={t.lang === 'ko' ? 'font-ko text-[18px] font-bold' : 'text-[13px] font-semibold'}>{t.text}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

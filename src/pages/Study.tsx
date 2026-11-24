import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { X, Volume2, PartyPopper, RotateCcw } from 'lucide-react'
import Button from '../components/Button'
import { WORDS, CATEGORIES } from '../data/words'
import type { Word } from '../types'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { speakKorean } from '../utils/speak'

// 배열 섞기 (매번 다른 순서로 출제)
const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)

export default function Study() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const cat = params.get('cat') ?? 'all'
  const { answer, isDue, logRecent } = useProgress()
  const { settings } = useSettings()

  // 처음 한 번만 카드 묶음 만들기: 오늘 복습할 카드 우선, 없으면 전체 연습
  const [queue, setQueue] = useState<Word[]>(() => {
    const pool = WORDS.filter((w) => cat === 'all' || w.category === cat)
    const due = pool.filter((w) => isDue(w.id))
    return shuffle(due.length > 0 ? due : pool).slice(0, 20) // 한 번에 최대 20장
  })
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [result, setResult] = useState({ known: 0, unknown: 0 })
  const [drag, setDrag] = useState(0)          // 손가락으로 민 거리 (px)
  const startX = useRef<number | null>(null)
  const moved = useRef(false)                 // 스와이프 중에는 탭(뒤집기)으로 인식하지 않기
  const retried = useRef(new Set<string>())   // 「まだ」 카드는 한 번만 뒤에 다시 출제

  const total = queue.length
  const word = queue[index]
  const done = index >= total
  // 끝까지 학습하면 홈의 「最近の学習」에 기록
  useEffect(() => { if (done && total > 0) logRecent('words', cat) }, [done]) // eslint-disable-line

  const catName = cat === 'all' ? 'すべて' : CATEGORIES.find((c) => c.id === cat)?.ja

  const next = (known: boolean) => {
    if (!word) return
    answer(word.id, known)
    setResult((r) => (known ? { ...r, known: r.known + 1 } : { ...r, unknown: r.unknown + 1 }))
    if (!known && !retried.current.has(word.id)) {
      retried.current.add(word.id)
      setQueue((q) => [...q, word]) // 못 외운 카드는 맨 뒤에 한 번 더
    }
    setFlipped(false)
    setDrag(0)
    setIndex((i) => i + 1)
  }

  // 스와이프: 오른쪽 = 覚えた / 왼쪽 = まだ
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX }
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return
    const dx = e.touches[0].clientX - startX.current
    if (Math.abs(dx) > 10) moved.current = true
    setDrag(dx)
  }
  const onTouchEnd = () => {
    if (Math.abs(drag) > 80) next(drag > 0)
    else setDrag(0)
    startX.current = null
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-surface"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
      {/* 상단: 닫기 + 진행률 */}
      <header className="flex items-center gap-3 px-4">
        <button onClick={() => navigate(-1)} aria-label="閉じる"
          className="flex h-11 w-11 items-center justify-center rounded-full transition active:bg-background">
          <X size={24} />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/10">
          <div className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${total ? (Math.min(index, total) / total) * 100 : 0}%` }} />
        </div>
        <span className="w-14 text-right text-[13px] font-semibold tabular-nums text-text-secondary">
          {Math.min(index + 1, total)} / {total}
        </span>
      </header>

      {done ? (
        // ===== 완료 화면 =====
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-20 w-20 animate-[pop_0.5s_ease-out] items-center justify-center rounded-full bg-primary/10 text-primary">
            <PartyPopper size={38} strokeWidth={1.7} />
          </div>
          <h2 className="mt-6 text-[24px] font-bold">おつかれさま！</h2>
          <p className="mt-2 text-[14px] text-text-secondary">{catName}のカードを学習しました</p>
          <div className="mt-8 grid w-full grid-cols-2 divide-x divide-border/70 rounded-card bg-background py-5 dark:bg-border/40">
            <div><p className="text-[28px] font-bold text-success tabular-nums">{result.known}</p><p className="text-[12px] text-text-secondary">覚えた</p></div>
            <div><p className="text-[28px] font-bold text-warning tabular-nums">{result.unknown}</p><p className="text-[12px] text-text-secondary">まだ</p></div>
          </div>
          <div className="mt-10 flex w-full flex-col gap-2">
            <Button full onClick={() => navigate(0)}><RotateCcw size={18} /> もう一度</Button>
            <Button full variant="ghost" onClick={() => navigate(-1)}>単語一覧へ戻る</Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-4 text-center text-[13px] font-semibold text-text-secondary">{catName}</p>

          {/* ===== 카드 (탭하면 뒤집힘) ===== */}
          <div className="flex flex-1 items-center px-6 py-4 [perspective:1200px]"
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <div
              onClick={() => {
                if (moved.current) { moved.current = false; return }
                setFlipped((f) => !f)
              }}
              className="relative h-full max-h-[440px] w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]"
              style={{
                // 뒤집기 + 손가락 따라 기울기
                transform: `translateX(${drag}px) rotate(${drag / 20}deg) rotateY(${flipped ? 180 : 0}deg)`,
                transitionDuration: startX.current !== null ? '0ms' : undefined,
              }}
            >
              {/* 앞면: 한국어 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[24px] bg-surface p-6 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] ring-1 ring-border/70 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
                <p className="font-ko text-[40px] leading-tight font-bold tracking-[-0.02em]">{word.ko}</p>
                {settings.showKana && word.kana && <p className="mt-2 text-[15px] text-text-secondary">{word.kana}</p>}
                <button onClick={(e) => { e.stopPropagation(); speakKorean(word.ko, settings.ttsRate) }} aria-label="発音を聞く"
                  className="mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition active:scale-90">
                  <Volume2 size={24} />
                </button>
                <p className="absolute bottom-6 text-[12px] text-text-secondary">タップして意味を見る</p>
              </div>

              {/* 뒷면: 일본어 + 예문 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[24px] bg-primary/[0.06] p-6 text-center ring-1 ring-primary/15 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] dark:bg-[#252f52]">
                <p className="text-[30px] leading-tight font-bold">{word.ja}</p>
                <p className="mt-2 font-ko text-[16px] text-text-secondary">{word.ko}</p>
                {word.example && (
                  <div className="mt-8 w-full rounded-card bg-surface/80 p-4 text-left dark:bg-surface/60">
                    <p className="font-ko text-[16px] font-semibold">{word.example.ko}</p>
                    <p className="mt-1 text-[13px] text-text-secondary">{word.example.ja}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== 답 버튼 ===== */}
          <div className="grid grid-cols-2 gap-3 px-6">
            <Button variant="ghost" onClick={() => next(false)}>まだ</Button>
            <Button onClick={() => next(true)}>覚えた</Button>
          </div>
          <p className="mt-3 text-center text-[11px] text-text-secondary">← まだ　スワイプ　覚えた →</p>
        </>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Volume2, Snail, Star, ChevronLeft, ChevronRight, Lightbulb, PartyPopper } from 'lucide-react'
import Button from '../components/Button'
import { SITUATIONS } from '../data/conversations'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { speakKorean } from '../utils/speak'

// 축하 문구 (랜덤)
const CHEERS = ['よくできました！', 'すばらしい！', 'その調子！', 'おつかれさま！']

export default function Lesson() {
  const navigate = useNavigate()
  const { sid } = useParams()
  const situation = SITUATIONS.find((s) => s.id === sid)
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const { isFavorite, toggleFavorite, completeLesson } = useProgress()
  const { settings } = useSettings()

  if (!situation) return <p className="p-10 text-center">見つかりませんでした</p>

  const total = situation.phrases.length
  const phrase = situation.phrases[index]
  const fav = isFavorite(phrase.id)
  const isLast = index === total - 1

  const finish = () => {
    completeLesson(situation.id)
    setFinished(true)
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col bg-surface"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
      {/* 상단: 닫기 + 진행률 */}
      <header className="flex items-center gap-3 px-4">
        <button onClick={() => navigate('/conversation')} aria-label="閉じる"
          className="flex h-11 w-11 items-center justify-center rounded-full transition active:bg-background">
          <X size={24} />
        </button>
        {/* 표현 개수만큼 칸으로 나눈 진행 바 */}
        <div className="flex flex-1 gap-1">
          {situation.phrases.map((p, i) => (
            <span key={p.id} className={`h-1.5 flex-1 rounded-full transition-colors ${finished || i <= index ? 'bg-primary' : 'bg-primary/10'}`} />
          ))}
        </div>
        <span className="w-12 text-right text-[13px] font-semibold tabular-nums text-text-secondary">
          {index + 1}/{total}
        </span>
      </header>

      {finished ? (
        // ===== 레슨 완료 =====
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="flex h-20 w-20 animate-[pop_0.5s_ease-out] items-center justify-center rounded-full bg-primary/10 text-primary">
            <PartyPopper size={38} strokeWidth={1.7} />
          </div>
          <h2 className="mt-6 text-[24px] font-bold">{CHEERS[Math.floor(Math.random() * CHEERS.length)]}</h2>
          <p className="mt-2 text-[14px] text-text-secondary">「{situation.ja}」の{total}フレーズを学習しました</p>
          <div className="mt-10 flex w-full flex-col gap-2">
            <Button full onClick={() => navigate('/conversation')}>会話一覧へ</Button>
            <Button full variant="ghost" onClick={() => { setIndex(0); setFinished(false) }}>もう一度</Button>
          </div>
        </div>
      ) : (
        <>
          {/* ===== 본문 (스크롤) ===== */}
          <div className="flex-1 overflow-y-auto px-6 pt-6">
            <p className="text-[13px] font-semibold text-primary">{situation.ja} · {phrase.scene}</p>

            {/* 큰 한국어 문장 */}
            <p className="mt-4 font-ko text-[32px] leading-[1.35] font-bold tracking-[-0.02em]">{phrase.ko}</p>
            {settings.showKana && phrase.kana && <p className="mt-2 text-[14px] text-text-secondary">{phrase.kana}</p>}
            <p className="mt-4 text-[17px]">{phrase.ja}</p>

            {/* 음성 + 즐겨찾기 */}
            <div className="mt-6 flex gap-2">
              <button onClick={() => speakKorean(phrase.ko, settings.ttsRate)}
                className="flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-semibold text-on-primary transition active:scale-95">
                <Volume2 size={18} /> 聞く
              </button>
              <button onClick={() => speakKorean(phrase.ko, 0.6)}
                className="flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold ring-1 ring-border transition active:scale-95">
                <Snail size={18} /> ゆっくり
              </button>
              <button onClick={() => toggleFavorite(phrase.id)} aria-label="お気に入り"
                className={`ml-auto flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-border transition active:scale-90 ${fav ? 'text-warning' : ''}`}>
                <Star size={19} fill={fav ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* 어휘 설명 */}
            <h3 className="mt-9 mb-2 text-[12px] font-semibold tracking-[0.08em] text-text-secondary">単語</h3>
            <ul className="divide-y divide-border/70 rounded-card bg-background dark:bg-border/40">
              {phrase.words.map((w) => (
                <li key={w.ko} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="font-ko text-[15px] font-semibold">{w.ko}</span>
                  <span className="text-right text-[14px] text-text-secondary">{w.ja}</span>
                </li>
              ))}
            </ul>

            {/* 포인트 (있을 때만) */}
            {phrase.tip && (
              <div className="mt-4 flex gap-3 rounded-card bg-primary/[0.07] p-4 dark:bg-primary/15">
                <Lightbulb size={18} className="mt-0.5 shrink-0 text-primary" />
                <p className="text-[14px] leading-relaxed">{phrase.tip}</p>
              </div>
            )}
            <div className="h-6" />
          </div>

          {/* ===== 이전 / 다음 ===== */}
          <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border/70 px-6 pt-4">
            <Button variant="ghost" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} aria-label="前へ" className="!px-4">
              <ChevronLeft size={20} />
            </Button>
            {isLast ? (
              <Button onClick={finish}>完了</Button>
            ) : (
              <Button onClick={() => setIndex((i) => i + 1)}>次へ <ChevronRight size={18} /></Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

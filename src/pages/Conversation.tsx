import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, CircleCheck } from 'lucide-react'
import LevelDots from '../components/LevelDots'
import Chip from '../components/Chip'
import { SITUATIONS, iconOf } from '../data/conversations'
import { useProgress } from '../context/ProgressContext'

export default function Conversation() {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const doneCount = SITUATIONS.filter((s) => progress.completed.includes(s.id)).length
  const total = SITUATIONS.reduce((n, s) => n + s.phrases.length, 0)
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0) // 0 = すべて
  const list = SITUATIONS.filter((s) => !level || s.level === level)

  return (
    <div className="min-h-dvh bg-surface">
      <header className="px-6 pb-5" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
        <h1 className="text-[26px] font-bold tracking-[-0.02em]">会話</h1>
        <p className="mt-1 text-[14px] text-text-secondary">{SITUATIONS.length}シーン · {total}フレーズ · {doneCount} 完了</p>
        {/* 난이도 필터 */}
        <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(['すべて', '初級', '中級', '上級'] as const).map((label, i) => (
            <Chip key={label} label={label} active={level === i} onClick={() => setLevel(i as 0 | 1 | 2 | 3)} />
          ))}
        </div>
      </header>

      {/* 상황 목록: 한 줄씩 구분선 (Nu 스타일) */}
      <ul className="border-t border-border/70">
        {list.map((s) => {
          const Icon = iconOf(s.icon)
          const done = progress.completed.includes(s.id)
          return (
            <li key={s.id} className="border-b border-border/70">
              <button onClick={() => navigate(`/conversation/${s.id}`)}
                className="flex w-full items-center gap-4 px-6 py-5 text-left transition active:bg-background">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border/60 dark:bg-border/60">
                  <Icon size={22} strokeWidth={1.8} />
                  {done && <CircleCheck size={18} className="absolute -right-1 -bottom-1 rounded-full bg-surface text-success" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[16px] font-bold">{s.ja}</span>
                    <LevelDots level={s.level} />
                  </span>
                  {/* 첫 번째 표현 미리보기 */}
                  <span className="mt-1 block truncate font-ko text-[14px] text-text-primary/80">{s.phrases[0].ko}</span>
                  <span className="mt-0.5 block text-[12px] text-text-secondary">{s.description} · {s.phrases.length}フレーズ</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-text-secondary" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

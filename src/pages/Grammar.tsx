import { useMemo, useState } from 'react'
import { ChevronDown, Search, Volume2 } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import Chip from '../components/Chip'
import LevelDots from '../components/LevelDots'
import { GRAMMAR } from '../data/study'
import { useSettings } from '../context/SettingsContext'
import { speakKorean } from '../utils/speak'

export default function Grammar() {
  const { settings } = useSettings()
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0) // 0 = すべて
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null) // 펼친 문법 id

  const list = useMemo(() => {
    const q = query.trim()
    return GRAMMAR.filter((g) => !level || g.level === level)
      .filter((g) => !q || g.pattern.includes(q) || g.ja.includes(q) || g.explanation.includes(q))
  }, [level, query])

  return (
    <div className="min-h-dvh bg-surface">
      <BackHeader title="文法" subtitle={`${GRAMMAR.length}の文法パターン`} />

      <div className="px-6">
        <div className="flex h-12 items-center gap-2 rounded-full bg-background px-4 ring-1 ring-border/70 dark:bg-border/50">
          <Search size={18} className="text-text-secondary" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="例：したい、고 싶다"
            className="h-full flex-1 bg-transparent text-[16px] outline-none placeholder:text-text-secondary" />
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(['すべて', '初級', '中級', '上級'] as const).map((label, i) => (
          <Chip key={label} label={label} active={level === i} onClick={() => setLevel(i as 0 | 1 | 2 | 3)} />
        ))}
      </div>

      {/* 문법 목록: 누르면 펼쳐짐 (아코디언) */}
      <ul className="mt-4 border-t border-border/70">
        {list.map((g) => {
          const isOpen = open === g.id
          return (
            <li key={g.id} className="border-b border-border/70">
              <button onClick={() => setOpen(isOpen ? null : g.id)} className="flex w-full items-center gap-3 px-6 py-4 text-left">
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-ko text-[17px] font-bold">{g.pattern}</span>
                    <LevelDots level={g.level} />
                  </span>
                  <span className="mt-0.5 block text-[14px] text-text-secondary">{g.ja}</span>
                </span>
                <ChevronDown size={20} className={`shrink-0 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="animate-[slide-up_0.2s_ease-out] px-6 pb-5">
                  <p className="rounded-card bg-primary/[0.07] p-4 text-[14px] leading-relaxed dark:bg-primary/15">{g.explanation}</p>
                  <ul className="mt-3 space-y-2">
                    {g.examples.map((e) => (
                      <li key={e.ko}>
                        <button onClick={() => speakKorean(e.ko, settings.ttsRate)} className="flex w-full items-start gap-3 rounded-xl bg-background p-3 text-left transition active:scale-[0.99] dark:bg-border/40">
                          <Volume2 size={16} className="mt-1 shrink-0 text-primary" />
                          <span>
                            <span className="block font-ko text-[15px] font-semibold">{e.ko}</span>
                            <span className="block text-[13px] text-text-secondary">{e.ja}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {list.length === 0 && <p className="py-16 text-center text-[14px] text-text-secondary">見つかりませんでした</p>}
    </div>
  )
}

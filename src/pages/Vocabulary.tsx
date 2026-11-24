import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X, Layers } from 'lucide-react'
import Chip from '../components/Chip'
import WordRow from '../components/WordRow'
import { WORDS, CATEGORIES } from '../data/words'
import { useProgress } from '../context/ProgressContext'

export default function Vocabulary() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') ?? 'all'          // 선택한 카테고리 (주소에 저장 → 뒤로 가기 해도 유지)
  const [query, setQuery] = useState('')
  const { isDue } = useProgress()

  // 카테고리 + 검색어로 걸러낸 단어
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return WORDS.filter((w) => (cat === 'all' || w.category === cat))
      .filter((w) => !q || w.ko.includes(q) || w.ja.toLowerCase().includes(q) || (w.kana ?? '').includes(q))
  }, [cat, query])

  const dueCount = list.filter((w) => isDue(w.id)).length

  return (
    <div className="min-h-dvh bg-surface">
      <header className="px-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
        <h1 className="text-[26px] font-bold tracking-[-0.02em]">単語</h1>
        <p className="mt-1 text-[14px] text-text-secondary">{WORDS.length}語 · {CATEGORIES.length}カテゴリ</p>

        {/* 검색창 (16px 이상 → iPhone 자동 확대 방지) */}
        <div className="mt-5 flex h-12 items-center gap-2 rounded-full bg-background px-4 ring-1 ring-border/70 dark:bg-border/50">
          <Search size={18} className="text-text-secondary" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="韓国語・日本語で検索"
            className="h-full flex-1 bg-transparent text-[16px] outline-none placeholder:text-text-secondary" />
          {query && (
            <button onClick={() => setQuery('')} aria-label="クリア"><X size={18} className="text-text-secondary" /></button>
          )}
        </div>
      </header>

      {/* 카테고리 필터 (가로 스크롤) */}
      <div className="mt-4 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip label="すべて" active={cat === 'all'} onClick={() => setParams({})} />
        {CATEGORIES.map((c) => (
          <Chip key={c.id} label={c.ja} active={cat === c.id} onClick={() => setParams({ cat: c.id })} />
        ))}
      </div>

      {/* 카드 학습 시작 배너 */}
      <div className="border-b border-border/70 px-6 py-5">
        <button
          disabled={list.length === 0}
          onClick={() => navigate(`/vocabulary/study?cat=${cat}`)}
          className="flex w-full items-center gap-4 rounded-card bg-primary/[0.07] p-4 text-left transition active:scale-[0.99] disabled:opacity-40 dark:bg-primary/15"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            <Layers size={20} />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">カードで学習</span>
            <span className="block text-[13px] text-text-secondary">今日の復習 {dueCount}語 / {list.length}語</span>
          </span>
        </button>
      </div>

      {/* 단어 목록 */}
      {list.length > 0 ? (
        <ul>{list.map((w) => <WordRow key={w.id} word={w} />)}</ul>
      ) : (
        <p className="px-6 py-16 text-center text-[14px] text-text-secondary">見つかりませんでした</p>
      )}
    </div>
  )
}

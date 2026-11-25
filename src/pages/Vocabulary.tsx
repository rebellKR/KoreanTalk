import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X, Layers, Loader2, BookMarked } from 'lucide-react'
import Chip from '../components/Chip'
import WordRow from '../components/WordRow'
import { WORDS, CATEGORIES } from '../data/words'
import { LEVELS, LEVEL_JA, useLevelWords, levelOfCat } from '../data/vocabLevels'
import { useProgress } from '../context/ProgressContext'

const PAGE = 100 // 한 번에 보여줄 개수 (수천 개를 한꺼번에 그리면 iPhone이 느려짐)

export default function Vocabulary() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') ?? 'all'
  const level = levelOfCat(cat) // 1~3이면 사전 단어(級別), 0이면 테마별
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE)
  const { isDue } = useProgress()

  // 레벨을 골랐거나, 검색어가 있을 때만 사전 단어를 불러옴
  const searching = query.trim().length > 0
  const levelWords = useLevelWords(level ? [level] : LEVELS, LEVELS.length > 0 && (level > 0 || searching))
  const loading = (level > 0 || (searching && LEVELS.length > 0)) && levelWords === null

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = level ? levelWords ?? [] : searching ? [...WORDS, ...(levelWords ?? [])] : WORDS
    return pool
      .filter((w) => level || searching || cat === 'all' || w.category === cat)
      .filter((w) => !q || w.ko.includes(q) || w.ja.toLowerCase().includes(q) || (w.kana ?? '').includes(q) || (w.jaRead ?? '').includes(q))
  }, [cat, level, query, searching, levelWords])

  const dueCount = list.filter((w) => isDue(w.id)).length
  const pick = (next: string) => { setParams(next === 'all' ? {} : { cat: next }); setShown(PAGE) }

  return (
    <div className="min-h-dvh bg-surface">
      <header className="px-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
        <h1 className="text-[26px] font-bold tracking-[-0.02em]">単語</h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          テーマ別 {WORDS.length}語{LEVELS.length > 0 && ' ・ 級別の辞書単語'}
        </p>

        {/* 검색창 (16px 이상 → iPhone 자동 확대 방지) */}
        <div className="mt-5 flex h-12 items-center gap-2 rounded-full bg-background px-4 ring-1 ring-border/70 dark:bg-border/50">
          <Search size={18} className="text-text-secondary" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setShown(PAGE) }} placeholder="韓国語・日本語で検索"
            className="h-full flex-1 bg-transparent text-[16px] outline-none placeholder:text-text-secondary" />
          {query && (
            <button onClick={() => setQuery('')} aria-label="クリア"><X size={18} className="text-text-secondary" /></button>
          )}
        </div>
      </header>

      {/* 카테고리 필터: 級別(사전) → テーマ別 */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip label="すべて" active={cat === 'all'} onClick={() => pick('all')} />
        {LEVELS.map((n) => (
          <Chip key={n} label={`📘 ${LEVEL_JA[n]}`} active={level === n} onClick={() => pick(`level${n}`)} />
        ))}
        {LEVELS.length > 0 && <span className="mx-1 h-5 w-px shrink-0 bg-border" />}
        {CATEGORIES.map((c) => (
          <Chip key={c.id} label={c.ja} active={cat === c.id} onClick={() => pick(c.id)} />
        ))}
      </div>

      {/* 카드 학습 시작 배너 */}
      <div className="border-b border-border/70 px-6 py-5">
        <button
          disabled={list.length === 0 || searching}
          onClick={() => navigate(`/vocabulary/study?cat=${cat}`)}
          className="flex w-full items-center gap-4 rounded-card bg-primary/[0.07] p-4 text-left transition active:scale-[0.99] disabled:opacity-40 dark:bg-primary/15"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            {level ? <BookMarked size={20} /> : <Layers size={20} />}
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">カードで学習{level ? `（${LEVEL_JA[level]}）` : ''}</span>
            <span className="block text-[13px] text-text-secondary">今日の復習 {dueCount}語 / {list.length.toLocaleString()}語</span>
          </span>
        </button>
      </div>

      {/* 단어 목록 */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[14px] text-text-secondary">
          <Loader2 size={18} className="animate-spin" /> 読み込み中…
        </div>
      ) : list.length > 0 ? (
        <>
          <ul>{list.slice(0, shown).map((w) => <WordRow key={w.id} word={w} />)}</ul>
          {list.length > shown && (
            <button onClick={() => setShown((n) => n + PAGE)}
              className="w-full py-5 text-[14px] font-semibold text-primary active:opacity-60">
              もっと見る（残り {(list.length - shown).toLocaleString()}語）
            </button>
          )}
        </>
      ) : (
        <p className="px-6 py-16 text-center text-[14px] text-text-secondary">見つかりませんでした</p>
      )}
      {level > 0 && <p className="px-6 pb-6 text-[11px] text-text-secondary">出典：国立国語院「韓国語基礎辞典」（CC BY-SA 2.0 KR）</p>}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Volume2, ChevronRight } from 'lucide-react'
import Segmented from '../components/Segmented'
import WordRow from '../components/WordRow'
import Button from '../components/Button'
import { useProgress } from '../context/ProgressContext'
import { useSettings } from '../context/SettingsContext'
import { findPhrase, findWord } from '../data/lookup'
import { LEVELS, useLevelWords } from '../data/vocabLevels'
import { speakKorean } from '../utils/speak'

export default function Favorites() {
  const navigate = useNavigate()
  const { progress, toggleFavorite } = useProgress()
  const { settings } = useSettings()
  const [tab, setTab] = useState<'phrase' | 'word'>('phrase')

  // 즐겨찾기 id → 실제 데이터 (최근 추가한 순서)
  const phrases = progress.favorites.map(findPhrase).filter((p) => p !== undefined)
  const hasDict = progress.favorites.some((id) => id.startsWith('kr-')) // 사전 단어가 즐겨찾기에 있으면 불러오기
  const dict = useLevelWords(LEVELS, hasDict)
  const words = progress.favorites
    .map((id) => findWord(id) ?? dict?.find((w) => w.id === id))
    .filter((w) => w !== undefined)
  const empty = tab === 'phrase' ? phrases.length === 0 : words.length === 0

  return (
    <div className="min-h-dvh bg-surface">
      <header className="px-6 pb-5" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
        <h1 className="text-[26px] font-bold tracking-[-0.02em]">お気に入り</h1>
        <p className="mt-1 text-[14px] text-text-secondary">保存したフレーズと単語</p>
        <div className="mt-5">
          <Segmented<'phrase' | 'word'> value={tab} onChange={setTab}
            options={[{ value: 'phrase', label: `フレーズ ${phrases.length}` }, { value: 'word', label: `単語 ${words.length}` }]} />
        </div>
      </header>

      {empty ? (
        // ===== 비어 있을 때 =====
        <div className="flex flex-col items-center px-10 pt-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Star size={28} strokeWidth={1.8} />
          </div>
          <p className="mt-5 text-[16px] font-semibold">まだありません</p>
          <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
            ☆ をタップすると、ここに保存されます。<br />あとでまとめて復習できます。
          </p>
          <div className="mt-6">
            <Button variant="secondary" onClick={() => navigate(tab === 'phrase' ? '/conversation' : '/vocabulary')}>
              {tab === 'phrase' ? '会話を見る' : '単語を見る'}
            </Button>
          </div>
        </div>
      ) : tab === 'phrase' ? (
        // ===== 표현 목록: 누르면 그 레슨의 해당 표현으로 이동 =====
        <ul className="border-t border-border/70">
          {phrases.map((p) => (
            <li key={p.id} className="flex items-center gap-1 border-b border-border/70 pr-3">
              <button onClick={() => navigate(`/conversation/${p.situation.id}?i=${p.index}`)}
                className="min-w-0 flex-1 py-4 pl-6 text-left transition active:opacity-60">
                <span className="text-[11px] font-semibold text-primary">{p.situation.ja} · {p.scene}</span>
                <span className="mt-1 block font-ko text-[17px] font-bold">{p.ko}</span>
                {settings.showKana && p.kana && <span className="block text-[12px] text-text-secondary">{p.kana}</span>}
                <span className="mt-0.5 block text-[14px]">{p.ja}</span>
              </button>
              <button onClick={() => speakKorean(p.ko, settings.ttsRate)} aria-label="発音を聞く"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-secondary transition active:bg-background">
                <Volume2 size={20} />
              </button>
              <button onClick={() => toggleFavorite(p.id)} aria-label="お気に入りから外す"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-warning transition active:scale-90">
                <Star size={20} fill="currentColor" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        // ===== 단어 목록 =====
        <>
          <ul className="border-t border-border/70">{words.map((w) => <WordRow key={w.id} word={w} />)}</ul>
          <button onClick={() => navigate('/vocabulary')}
            className="flex w-full items-center justify-center gap-1 py-5 text-[13px] font-semibold text-primary">
            単語一覧へ <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  )
}

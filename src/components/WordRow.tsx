import { Star, Volume2 } from 'lucide-react'
import type { Word } from '../types'
import { useSettings } from '../context/SettingsContext'
import { useProgress } from '../context/ProgressContext'
import { speakKorean } from '../utils/speak'

// 단어 목록의 한 줄: 한국어 / 발음 / 일본어 + 발음 버튼 + 즐겨찾기
export default function WordRow({ word }: { word: Word }) {
  const { settings } = useSettings()
  const { isFavorite, toggleFavorite } = useProgress()
  const fav = isFavorite(word.id)
  return (
    <li className="flex items-center gap-3 border-b border-border/70 px-6 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="font-ko text-[18px] font-bold">{word.ko}</p>
        {settings.showKana && word.kana && <p className="text-[12px] text-text-secondary">{word.kana}</p>}
        <p className="mt-0.5 text-[14px]">{word.ja}</p>
      </div>
      <button onClick={() => speakKorean(word.ko, settings.ttsRate)} aria-label="発音を聞く"
        className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition active:bg-background">
        <Volume2 size={20} />
      </button>
      <button onClick={() => toggleFavorite(word.id)} aria-label="お気に入り"
        className={`flex h-11 w-11 items-center justify-center rounded-full transition active:scale-90 ${fav ? 'text-warning' : 'text-text-secondary'}`}>
        <Star size={20} fill={fav ? 'currentColor' : 'none'} />
      </button>
    </li>
  )
}

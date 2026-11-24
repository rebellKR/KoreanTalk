import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Volume2, Star, MessagesSquare, BookText, Type, PenLine, GraduationCap, RotateCcw, Flame, Settings, ChevronRight,
  CircleUser, Layers, Sparkles, type LucideIcon,
} from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import Section from '../components/Section'
import QuickAction from '../components/QuickAction'
import Toast from '../components/Toast'
import { useSettings } from '../context/SettingsContext'
import { useProgress } from '../context/ProgressContext'
import { speakKorean } from '../utils/speak'
import { todayJP } from '../utils/date'
import { ALL_PHRASES, categoryName } from '../data/lookup'
import { SITUATIONS, iconOf } from '../data/conversations'

// 일본 시간 기준 인사말
function greeting() {
  const h = Number(new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: 'numeric', hour12: false }).format(new Date()).replace(/\D/g, ''))
  if (h >= 5 && h < 11) return 'おはよう'
  if (h >= 11 && h < 18) return 'こんにちは'
  return 'こんばんは'
}

// 오늘의 한마디: 날짜마다 다른 표현 (같은 날에는 항상 같은 표현)
const dayNumber = Math.floor(new Date(todayJP()).getTime() / 86400000)
const phrase = ALL_PHRASES[dayNumber % ALL_PHRASES.length]

// 바로가기
const actions: { label: string; icon: LucideIcon; to?: string }[] = [
  { label: '会話', icon: MessagesSquare, to: '/conversation' },
  { label: '単語', icon: BookText, to: '/vocabulary' },
  { label: '復習', icon: RotateCcw, to: '/vocabulary/study?cat=all' },
  { label: 'ハングル', icon: Type, to: '/hangul' },
  { label: '文法', icon: PenLine, to: '/grammar' },
  { label: 'TOPIK', icon: GraduationCap, to: '/topik' },
]

export default function Home() {
  const { settings } = useSettings()
  const { todayCount, todayLessons, reviewCount, streak, progress, isFavorite, toggleFavorite } = useProgress()
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)
  const fav = isFavorite(phrase.id)
  const isNew = Object.keys(progress.cards).length === 0 // 아직 카드 학습을 한 번도 안 함

  return (
    <div className="min-h-dvh bg-surface">
      {/* ===== 색 헤더: 다이내믹 아일랜드 뒤까지 Primary 색으로 채움 ===== */}
      <header className="bg-primary px-6 pb-7 text-white dark:bg-secondary"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/mypage')} aria-label="マイページ"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition active:scale-95">
            <CircleUser size={24} strokeWidth={1.7} />
          </button>
          <div className="flex items-center gap-2">
            {/* 연속 학습일 */}
            <span className="flex h-9 items-center gap-1 rounded-full bg-white/15 px-3 text-[13px] font-semibold tabular-nums">
              <Flame size={15} /> {streak}日
            </span>
            <button onClick={() => navigate('/mypage/settings')} aria-label="設定"
              className="flex h-11 w-11 items-center justify-center rounded-full transition active:bg-white/15">
              <Settings size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>
        <h1 className="mt-6 text-[26px] font-bold tracking-[-0.02em]">{greeting()}</h1>
        <p className="mt-1 text-[14px] text-white/80">
          {streak > 0 ? `${streak}日連続で学習中！この調子で。` : '今日も少しずつ韓国語を。'}
        </p>
      </header>

      {/* ===== 오늘의 한마디 ===== */}
      <Section title="今日のひとこと" onMore={() => navigate(`/conversation/${phrase.situation.id}?i=${phrase.index}`)}>
        <p className="text-[12px] font-semibold text-primary">{phrase.situation.ja} · {phrase.scene}</p>
        <p className="mt-2 font-ko text-[30px] leading-[1.3] font-bold tracking-[-0.02em]">{phrase.ko}</p>
        {settings.showKana && phrase.kana && <p className="mt-1 text-[13px] text-text-secondary">{phrase.kana}</p>}
        <p className="mt-3 text-[16px]">{phrase.ja}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={() => speakKorean(phrase.ko, settings.ttsRate)}
            className="flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-semibold text-on-primary transition active:scale-95">
            <Volume2 size={18} /> 聞く
          </button>
          <button onClick={() => toggleFavorite(phrase.id)} aria-label="お気に入り"
            className={`flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-border transition active:scale-90 ${fav ? 'text-warning' : ''}`}>
            <Star size={19} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Section>

      {/* ===== 바로가기: 가로로 밀어서 보기 ===== */}
      <section className="border-b border-border/70 py-6">
        <div className="flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {actions.map((a) => (
            <QuickAction key={a.label} icon={a.icon} label={a.label}
              onClick={() => (a.to ? navigate(a.to) : setToast('近日公開予定です'))} />
          ))}
        </div>
      </section>

      {/* ===== 복습 / 시작 안내 배너 ===== */}
      <Section>
        <button onClick={() => navigate('/vocabulary/study?cat=all')}
          className="flex w-full items-center gap-4 rounded-card bg-primary/[0.07] p-4 text-left transition active:scale-[0.99] dark:bg-primary/15">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            {isNew ? <Sparkles size={20} /> : <Layers size={20} />}
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">
              {isNew ? '単語カードをはじめよう' : reviewCount > 0 ? `復習する単語が${reviewCount}語あります` : '今日の復習は完了！'}
            </span>
            <span className="block text-[13px] text-text-secondary">
              {isNew ? 'まずは20語から' : reviewCount > 0 ? `約${Math.max(1, Math.ceil(reviewCount / 8))}分` : '新しい単語に挑戦しよう'}
            </span>
          </span>
          <ChevronRight size={18} className="text-text-secondary" />
        </button>
      </Section>

      {/* ===== 오늘의 목표 ===== */}
      <Section title="今日の目標" onMore={() => navigate('/mypage')}>
        <ProgressBar value={Math.min(todayCount, settings.dailyGoal)} max={settings.dailyGoal} label="単語カード" />
        <div className="mt-5">
          <ProgressBar value={Math.min(todayLessons, 1)} max={1} label="会話レッスン" />
        </div>
        {todayCount >= settings.dailyGoal && todayLessons >= 1 && (
          <p className="mt-4 text-[13px] font-semibold text-success">🎉 今日の目標を達成しました！</p>
        )}
      </Section>

      {/* ===== 최근 학습 (기록이 있을 때만) ===== */}
      {progress.recent.length > 0 && (
        <Section title="最近の学習">
          <ul className="-my-2">
            {progress.recent.map((r) => {
              const s = r.type === 'lesson' ? SITUATIONS.find((x) => x.id === r.id) : undefined
              const Icon = s ? iconOf(s.icon) : BookText
              const title = s ? s.ja : `単語 · ${categoryName(r.id)}`
              const to = s ? `/conversation/${s.id}` : r.id === 'all' ? '/vocabulary' : `/vocabulary?cat=${r.id}`
              return (
                <li key={r.type + r.id}>
                  <button onClick={() => navigate(to)} className="flex w-full items-center gap-3 py-2.5 text-left transition active:opacity-60">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background ring-1 ring-border/60 dark:bg-border/60">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[15px] font-semibold">{title}</span>
                      <span className="block text-[12px] text-text-secondary">{r.type === 'lesson' ? '会話レッスン' : '単語カード'} · {r.at.slice(5).replace('-', '/')}</span>
                    </span>
                    <ChevronRight size={18} className="text-text-secondary" />
                  </button>
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}

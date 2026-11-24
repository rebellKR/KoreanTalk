import { useNavigate } from 'react-router-dom'
import {
  Volume2, Star, MessagesSquare, BookText, Type, PenLine, GraduationCap, RotateCcw, Flame, Settings, ChevronRight, CircleUser,
  type LucideIcon,
} from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import Section from '../components/Section'
import QuickAction from '../components/QuickAction'
import { useSettings } from '../context/SettingsContext'
import { speakKorean } from '../utils/speak'

// 일본 시간 기준 인사말
function greeting() {
  const h = Number(new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: 'numeric', hour12: false }).format(new Date()).replace(/\D/g, ''))
  if (h < 11) return 'おはよう'
  if (h < 18) return 'こんにちは'
  return 'こんばんは'
}

// 바로가기 (가로 스크롤)
const actions: { label: string; icon: LucideIcon; to: string }[] = [
  { label: '会話', icon: MessagesSquare, to: '/conversation' },
  { label: '単語', icon: BookText, to: '/vocabulary' },
  { label: 'ハングル', icon: Type, to: '/' },
  { label: '文法', icon: PenLine, to: '/' },
  { label: 'TOPIK', icon: GraduationCap, to: '/' },
  { label: '復習', icon: RotateCcw, to: '/vocabulary' },
]

const phrase = { ko: '오늘 날씨 좋다!', kana: 'オヌル ナルッシ チョタ', ja: '今日いい天気だね！' }

export default function Home() {
  const { settings } = useSettings()
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-surface">
      {/* ===== 색 헤더: 다이내믹 아일랜드 뒤까지 Primary 색으로 채움 ===== */}
      <header
        className="bg-primary px-6 pb-7 text-white dark:bg-secondary"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/mypage')} aria-label="マイページ"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 transition active:scale-95">
            <CircleUser size={24} strokeWidth={1.7} />
          </button>
          <div className="flex items-center gap-2">
            {/* 연속 학습일 */}
            <span className="flex h-9 items-center gap-1 rounded-full bg-white/15 px-3 text-[13px] font-semibold tabular-nums">
              <Flame size={15} /> 3日
            </span>
            <button onClick={() => navigate('/mypage/settings')} aria-label="設定"
              className="flex h-11 w-11 items-center justify-center rounded-full transition active:bg-white/15">
              <Settings size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>
        <h1 className="mt-6 text-[26px] font-bold tracking-[-0.02em]">{greeting()}</h1>
        <p className="mt-1 text-[14px] text-white/80">今日も少しずつ韓国語を。</p>
      </header>

      {/* ===== 오늘의 한마디 ===== */}
      <Section title="今日のひとこと">
        <p className="font-ko text-[30px] leading-[1.3] font-bold tracking-[-0.02em]">{phrase.ko}</p>
        {settings.showKana && <p className="mt-1 text-[13px] text-text-secondary">{phrase.kana}</p>}
        <p className="mt-3 text-[16px]">{phrase.ja}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={() => speakKorean(phrase.ko, settings.ttsRate)}
            className="flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-semibold text-on-primary transition active:scale-95">
            <Volume2 size={18} /> 聞く
          </button>
          <button aria-label="お気に入り"
            className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-border transition active:scale-95">
            <Star size={19} />
          </button>
        </div>
      </Section>

      {/* ===== 바로가기: 가로로 밀어서 보기 ===== */}
      <section className="border-b border-border/70 py-6">
        <div className="flex gap-3 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {actions.map((a) => (
            <QuickAction key={a.label} icon={a.icon} label={a.label} onClick={() => navigate(a.to)} />
          ))}
        </div>
      </section>

      {/* ===== 오늘의 목표 ===== */}
      <Section title="今日の目標" onMore={() => navigate('/mypage')}>
        <ProgressBar value={4} max={settings.dailyGoal} label="単語" />
        <div className="mt-5">
          <ProgressBar value={1} max={3} label="フレーズ" />
        </div>
      </Section>

      {/* ===== 안내 배너: 옅은 Primary 배경 ===== */}
      <Section>
        <button onClick={() => navigate('/vocabulary')}
          className="flex w-full items-center gap-4 rounded-card bg-primary/[0.07] p-4 text-left transition active:scale-[0.99] dark:bg-primary/15">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <RotateCcw size={20} />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">復習する単語があります</span>
            <span className="block text-[13px] text-text-secondary">5語 · 約2分</span>
          </span>
          <ChevronRight size={18} className="text-text-secondary" />
        </button>
      </Section>
    </div>
  )
}

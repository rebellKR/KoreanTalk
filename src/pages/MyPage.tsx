import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, BookCheck, GraduationCap, Settings as SettingsIcon, ChevronRight, Target, Lock, Gamepad2, Smartphone } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import Section from '../components/Section'
import GrassCalendar from '../components/GrassCalendar'
import { useSettings } from '../context/SettingsContext'
import { useProgress } from '../context/ProgressContext'
import { useAchievements } from '../hooks/useAchievements'
import { BADGES } from '../data/badges'
import { levelTitle } from '../utils/level'

export default function MyPage() {
  const { settings } = useSettings()
  const { todayCount, learnedCount, progress, streak } = useProgress()
  const { level, cur, need, xp, earned } = useAchievements()
  const navigate = useNavigate()
  const [badgeInfo, setBadgeInfo] = useState<string | null>(null) // 눌러서 설명 보기
  const stats = [
    { icon: Flame, label: '連続学習', value: streak, unit: '日' },
    { icon: BookCheck, label: '覚えた単語', value: learnedCount, unit: '語' },
    { icon: GraduationCap, label: '完了レッスン', value: progress.completed.length, unit: '件' },
  ]
  const info = BADGES.find((b) => b.id === badgeInfo)

  return (
    <div className="min-h-dvh bg-surface">
      {/* ===== 레벨 카드 ===== */}
      <header className="px-6 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
        <div className="flex items-start justify-between">
          <h1 className="text-[26px] font-bold tracking-[-0.02em]">マイページ</h1>
          <button onClick={() => navigate('/mypage/settings')} aria-label="設定"
            className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-border transition active:scale-95">
            <SettingsIcon size={20} />
          </button>
        </div>
        <div className="relative mt-5 overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-secondary p-5 text-white">
          <span className="absolute -top-6 -right-4 font-ko text-[110px] leading-none font-bold opacity-10">한</span>
          <p className="text-[12px] font-semibold opacity-80">{levelTitle(level)}</p>
          <p className="mt-1 text-[36px] leading-none font-bold tabular-nums">Lv.{level}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${(cur / need) * 100}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[12px] tabular-nums opacity-90">
            <span>次のレベルまで {need - cur} XP</span><span>合計 {xp} XP</span>
          </div>
        </div>
      </header>

      {/* 통계 3칸 */}
      <section className="mx-6 grid grid-cols-3 divide-x divide-border/70 rounded-card bg-background py-4 dark:bg-border/40">
        {stats.map(({ icon: Icon, label, value, unit }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon size={18} className="text-primary" />
            <p className="text-[22px] font-bold tabular-nums">{value}<span className="ml-0.5 text-[12px] font-medium text-text-secondary">{unit}</span></p>
            <p className="text-[11px] text-text-secondary">{label}</p>
          </div>
        ))}
      </section>

      <div className="mt-2">
        {/* ===== 잔디 캘린더 ===== */}
        <Section title="学習カレンダー">
          <GrassCalendar log={progress.dayLog} />
        </Section>

        {/* ===== 배지 ===== */}
        <Section title={`バッジ ${earned.length}/${BADGES.length}`}>
          <div className="grid grid-cols-4 gap-3">
            {BADGES.map((b) => {
              const got = earned.includes(b.id)
              return (
                <button key={b.id} onClick={() => setBadgeInfo(badgeInfo === b.id ? null : b.id)} className="flex flex-col items-center gap-1.5">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-full transition active:scale-90 ${got ? 'shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)]' : 'bg-border/60'}`}
                    style={got ? { background: b.color } : undefined}>
                    {got ? <b.icon size={24} color="white" /> : <Lock size={18} className="text-text-secondary" />}
                  </span>
                  <span className={`line-clamp-1 text-[10px] font-semibold ${got ? '' : 'text-text-secondary'}`}>{b.title}</span>
                </button>
              )
            })}
          </div>
          {info && (
            <p className="mt-4 animate-[slide-up_0.2s_ease-out] rounded-xl bg-background p-3 text-center text-[13px] dark:bg-border/40">
              <b>{info.title}</b>：{info.desc}{earned.includes(info.id) ? ' ✓ 獲得済み' : ''}
            </p>
          )}
        </Section>

        <Section title="学習目標">
          <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold">
            <Target size={17} className="text-primary" /> 1日 {settings.dailyGoal}語
          </div>
          <ProgressBar value={Math.min(todayCount, settings.dailyGoal)} max={settings.dailyGoal} label="今日の単語" />
        </Section>

        {/* 메뉴 */}
        {[
          { to: '/games', icon: Gamepad2, title: 'ゲーム', desc: 'スピードクイズ・ペアマッチ' },
          { to: '/mypage/install', icon: Smartphone, title: 'ホーム画面に追加', desc: 'アプリのように使う・URLを共有' },
          { to: '/mypage/settings', icon: SettingsIcon, title: '設定', desc: 'テーマ・文字サイズ・音声・データ' },
        ].map(({ to, icon: Icon, title, desc }) => (
          <button key={to} onClick={() => navigate(to)}
            className="flex w-full items-center gap-4 border-b border-border/70 px-6 py-5 text-left transition last:border-b-0 active:bg-background">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background ring-1 ring-border/60 dark:bg-border/60"><Icon size={19} /></span>
            <span className="flex-1">
              <span className="block text-[16px] font-semibold">{title}</span>
              <span className="block text-[13px] text-text-secondary">{desc}</span>
            </span>
            <ChevronRight size={18} className="text-text-secondary" />
          </button>
        ))}
      </div>
    </div>
  )
}

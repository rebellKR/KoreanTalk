import { useNavigate } from 'react-router-dom'
import { Flame, BookCheck, GraduationCap, Settings as SettingsIcon, ChevronRight, Target, CircleUser } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import Section from '../components/Section'
import { useSettings } from '../context/SettingsContext'
import { useProgress } from '../context/ProgressContext'


export default function MyPage() {
  const { settings } = useSettings()
  const { todayCount, learnedCount, progress } = useProgress()
  // 연속 학습일은 STAGE 6에서 연결 (지금은 임시 값)
  const stats = [
    { icon: Flame, label: '連続学習', value: 3, unit: '日' },
    { icon: BookCheck, label: '覚えた単語', value: learnedCount, unit: '語' },
    { icon: GraduationCap, label: '完了レッスン', value: progress.completed.length, unit: '件' },
  ]
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh bg-surface">
      {/* 상단: 큰 프로필 아이콘 + 제목 (Nu 프로필 화면 스타일) */}
      <header className="px-6 pb-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CircleUser size={34} strokeWidth={1.6} />
        </div>
        <h1 className="mt-4 text-[26px] font-bold tracking-[-0.02em]">マイページ</h1>
        <p className="mt-1 text-[14px] text-text-secondary">学習の記録</p>
      </header>

      {/* 통계: 구분선으로 나눈 3칸 */}
      <section className="mx-6 grid grid-cols-3 divide-x divide-border/70 rounded-card bg-background py-4 dark:bg-border/40">
        {stats.map(({ icon: Icon, label, value, unit }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon size={18} className="text-primary" />
            <p className="text-[22px] font-bold tabular-nums">
              {value}<span className="ml-0.5 text-[12px] font-medium text-text-secondary">{unit}</span>
            </p>
            <p className="text-[11px] text-text-secondary">{label}</p>
          </div>
        ))}
      </section>

      <div className="mt-2">
        <Section title="学習目標">
          <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold">
            <Target size={17} className="text-primary" /> 1日 {settings.dailyGoal}語
          </div>
          <ProgressBar value={Math.min(todayCount, settings.dailyGoal)} max={settings.dailyGoal} label="今日の単語" />
        </Section>

        {/* 메뉴 목록: 한 줄씩 구분선 */}
        <button onClick={() => navigate('/mypage/settings')}
          className="flex w-full items-center gap-4 px-6 py-5 text-left transition active:bg-background">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background ring-1 ring-border/60 dark:bg-border/60">
            <SettingsIcon size={19} />
          </span>
          <span className="flex-1">
            <span className="block text-[16px] font-semibold">設定</span>
            <span className="block text-[13px] text-text-secondary">テーマ・文字サイズ・音声・データ</span>
          </span>
          <ChevronRight size={18} className="text-text-secondary" />
        </button>
      </div>
    </div>
  )
}

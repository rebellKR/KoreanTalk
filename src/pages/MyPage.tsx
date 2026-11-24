import { Link } from 'react-router-dom'
import { Flame, BookCheck, GraduationCap, Settings as SettingsIcon, ChevronRight, Target } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'
import SectionTitle from '../components/SectionTitle'
import { useSettings } from '../context/SettingsContext'

// STAGE 2: 통계는 더미 숫자 (STAGE 6에서 실제 기록 연결)
const stats = [
  { icon: Flame, label: '連続学習', value: 3, unit: '日', color: 'text-warning' },
  { icon: BookCheck, label: '覚えた単語', value: 0, unit: '語', color: 'text-primary' },
  { icon: GraduationCap, label: '完了レッスン', value: 0, unit: '件', color: 'text-success' },
]

export default function MyPage() {
  const { settings } = useSettings()
  return (
    <>
      <PageHeader
        title="マイページ"
        subtitle="学習の記録"
        right={
          // 오른쪽 위 설정 버튼
          <Link to="/mypage/settings" aria-label="設定"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface ring-1 ring-border transition active:scale-95">
            <SettingsIcon size={20} strokeWidth={1.9} />
          </Link>
        }
      />

      {/* 통계 3칸 */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, label, value, unit, color }) => (
          <Card key={label} className="p-4">
            <Icon size={18} className={color} />
            <p className="mt-3 text-[24px] font-bold tabular-nums tracking-tight">
              {value}<span className="ml-0.5 text-[13px] font-medium text-text-secondary">{unit}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-text-secondary">{label}</p>
          </Card>
        ))}
      </div>

      <SectionTitle title="学習目標" />
      <Card>
        <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold">
          <Target size={17} className="text-primary" /> 1日 {settings.dailyGoal}語
        </div>
        <ProgressBar value={4} max={settings.dailyGoal} label="今日の単語" />
      </Card>

      <SectionTitle title="その他" />
      <Link to="/mypage/settings">
        <Card className="flex items-center gap-3 p-4 transition active:scale-[0.99]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SettingsIcon size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold">設定</p>
            <p className="text-[12px] text-text-secondary">テーマ・文字サイズ・音声・データ</p>
          </div>
          <ChevronRight size={18} className="text-text-secondary" />
        </Card>
      </Link>
    </>
  )
}

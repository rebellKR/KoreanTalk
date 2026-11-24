import { Sun, Moon, Smartphone } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import { useTheme, type ThemeMode } from '../context/ThemeContext'

const options: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'ライト', icon: Sun },
  { value: 'dark', label: 'ダーク', icon: Moon },
  { value: 'system', label: '自動', icon: Smartphone },
]

// STAGE 1: 테마 전환 임시 UI (정식 설정 화면은 STAGE 2)
export default function MyPage() {
  const { mode, setMode } = useTheme()
  return (
    <>
      <PageHeader title="マイページ" subtitle="学習記録と設定" />
      <Card>
        <h2 className="mb-4 text-[18px] font-bold">テーマ</h2>
        {/* 3개 중 하나를 고르는 세그먼트 버튼 */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-background p-1">
          {options.map(({ value, label, icon: Icon }) => {
            const active = mode === value
            return (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-[14px] font-medium transition ${
                  active ? 'bg-surface text-primary shadow-sm' : 'text-text-secondary'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            )
          })}
        </div>
      </Card>
    </>
  )
}

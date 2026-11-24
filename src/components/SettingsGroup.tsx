import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

// 설정 묶음: 작은 제목 + 둥근 카드 안에 여러 줄
export function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-2 px-1 text-[12px] font-semibold tracking-[0.08em] text-text-secondary">{title}</h2>
      <div className="divide-y divide-border/70 overflow-hidden rounded-card bg-surface shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:ring-1 dark:ring-border">
        {children}
      </div>
    </section>
  )
}

type RowProps = {
  icon?: LucideIcon
  label: string
  description?: string
  right?: ReactNode       // 오른쪽에 스위치 등
  below?: ReactNode       // 아래쪽에 세그먼트 버튼 등
  onClick?: () => void    // 있으면 누를 수 있는 줄(> 표시)
  danger?: boolean        // 빨간 글씨 (리셋 등)
}

// 설정 한 줄
export function SettingsRow({ icon: Icon, label, description, right, below, onClick, danger }: RowProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className="block w-full px-4 py-3.5 text-left transition active:bg-background">
      <div className="flex min-h-8 items-center gap-3">
        {Icon && (
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${danger ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
            <Icon size={17} strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-[15px] font-medium ${danger ? 'text-error' : ''}`}>{label}</p>
          {description && <p className="mt-0.5 text-[12px] text-text-secondary">{description}</p>}
        </div>
        {right}
        {onClick && !right && <ChevronRight size={18} className="text-text-secondary" />}
      </div>
      {below && <div className="mt-3">{below}</div>}
    </Tag>
  )
}

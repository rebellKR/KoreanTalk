import type { ReactNode } from 'react'

type Props = { title: string; caption?: string; subtitle?: string; right?: ReactNode }

// 화면 상단 제목: 작은 캡션(날짜 등) → 큰 제목 → 보조 설명
export default function PageHeader({ title, caption, subtitle, right }: Props) {
  return (
    <header className="mb-7 flex items-end justify-between gap-4">
      <div>
        {caption && (
          <p className="mb-1.5 text-[12px] font-semibold tracking-[0.08em] text-text-secondary">{caption}</p>
        )}
        <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[14px] text-text-secondary">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}

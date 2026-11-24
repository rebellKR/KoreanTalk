import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  tone?: 'default' | 'accent' // accent: Primary 색을 아주 옅게 깐 강조 카드
}

// 공통 카드: radius 16px, 테두리 대신 아주 옅은 그림자로 떠 있는 느낌 (다크는 테두리로 구분)
export default function Card({ children, className = '', tone = 'default' }: Props) {
  const base =
    tone === 'accent'
      ? 'bg-primary/[0.06] dark:bg-primary/[0.12] ring-1 ring-primary/10'
      : 'bg-surface shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:shadow-none dark:ring-1 dark:ring-border'
  return <div className={`rounded-card p-5 ${base} ${className}`}>{children}</div>
}

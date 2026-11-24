import type { ReactNode } from 'react'

// 공통 카드: radius 16px, Surface 배경, 옅은 테두리, 최소 그림자
export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-card border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  )
}

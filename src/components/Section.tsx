import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

type Props = { title?: string; onMore?: () => void; children: ReactNode; className?: string }

// Nu 스타일 섹션: 카드 대신 화면 전체 폭 + 얇은 구분선으로 나눔
export default function Section({ title, onMore, children, className = '' }: Props) {
  return (
    <section className={`border-b border-border/70 px-6 py-6 last:border-b-0 ${className}`}>
      {title && (
        <button onClick={onMore} className="mb-4 flex w-full items-center justify-between text-left">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">{title}</h2>
          {onMore && <ChevronRight size={20} className="text-text-secondary" />}
        </button>
      )}
      {children}
    </section>
  )
}

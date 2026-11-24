import type { ReactNode } from 'react'

// 일반 화면용 틀: 좌우 여백 + 위쪽 safe-area(다이내믹 아일랜드) 여백
export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="px-5" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
      {children}
    </div>
  )
}

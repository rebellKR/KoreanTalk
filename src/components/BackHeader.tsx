import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

// 뒤로가기 버튼 + 제목 (하위 화면 공통)
export default function BackHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const navigate = useNavigate()
  return (
    <header className="px-4 pb-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}>
      <button onClick={() => navigate(-1)} aria-label="戻る"
        className="flex h-11 w-11 items-center justify-center rounded-full transition active:bg-background">
        <ChevronLeft size={26} />
      </button>
      <div className="px-2">
        <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em]">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-text-secondary">{subtitle}</p>}
      </div>
    </header>
  )
}

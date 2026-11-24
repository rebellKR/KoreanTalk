import type { LucideIcon } from 'lucide-react'

// 동그란 바로가기 버튼 + 아래 라벨 (Nu의 Pix/送金 버튼 스타일)
export default function QuickAction({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-[72px] shrink-0 flex-col items-center gap-2 transition active:scale-95">
      <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-background ring-1 ring-border/60 dark:bg-border/60">
        <Icon size={24} strokeWidth={1.8} />
      </span>
      <span className="text-[12px] font-semibold">{label}</span>
    </button>
  )
}

import type { LucideIcon } from 'lucide-react'
import Card from './Card'

// 아직 만들지 않은 화면용 안내 카드
export default function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/25 text-primary">
        <Icon size={24} strokeWidth={1.8} />
      </div>
      <p className="text-[14px] text-text-secondary">{text}</p>
    </Card>
  )
}

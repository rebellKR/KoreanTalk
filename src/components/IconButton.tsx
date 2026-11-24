import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon
  label: string           // 화면에는 안 보이지만 음성 읽기용 이름
  variant?: 'solid' | 'soft'
}

// 아이콘만 있는 둥근 버튼 (44px 터치 영역)
export default function IconButton({ icon: Icon, label, variant = 'soft', className = '', ...rest }: Props) {
  const style = variant === 'solid' ? 'bg-primary text-on-primary' : 'bg-surface text-text-primary ring-1 ring-border'
  return (
    <button
      aria-label={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95 ${style} ${className}`}
      {...rest}
    >
      <Icon size={20} strokeWidth={1.9} />
    </button>
  )
}

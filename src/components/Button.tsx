import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  full?: boolean // 가로 꽉 채우기
}

const styles = {
  primary: 'bg-primary text-on-primary shadow-[0_6px_16px_-6px_var(--primary)]',
  secondary: 'bg-secondary/25 text-primary',
  ghost: 'bg-transparent text-text-secondary border border-border',
}

export default function Button({ variant = 'primary', full, className = '', ...rest }: Props) {
  return (
    <button
      // min-h-[52px] = 44px: iPhone 권장 최소 터치 영역 / active:scale = 눌렀을 때 살짝 작아지는 효과
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition active:scale-[0.97] active:opacity-90 disabled:opacity-40 ${styles[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    />
  )
}

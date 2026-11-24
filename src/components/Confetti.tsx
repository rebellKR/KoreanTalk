import { useMemo } from 'react'

// 종이 꽃가루 효과 (CSS만 사용, 가벼움)
const COLORS = ['var(--primary)', 'var(--secondary)', 'var(--success)', 'var(--warning)', '#F472B6']

export default function Confetti({ count = 40 }: { count?: number }) {
  // 조각마다 위치·속도·색을 랜덤으로 한 번만 정함
  const pieces = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.8 + Math.random() * 1.4,
      size: 6 + Math.random() * 6,
      color: COLORS[i % COLORS.length],
      round: Math.random() > 0.5,
    })),
    [count],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span key={i} className="absolute -top-4 animate-[confetti_linear_forwards]"
          style={{
            left: `${p.left}%`, width: p.size, height: p.size * (p.round ? 1 : 0.5),
            background: p.color, borderRadius: p.round ? '50%' : '2px',
            animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
          }} />
      ))}
    </div>
  )
}

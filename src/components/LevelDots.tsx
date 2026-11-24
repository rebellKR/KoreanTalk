import { LEVEL_LABEL } from '../data/conversations'

// 난이도 표시: ●●○ + 初級/中級/上級
export default function LevelDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary">
      <span className="flex gap-0.5">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-1.5 w-1.5 rounded-full ${n <= level ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </span>
      {LEVEL_LABEL[level]}
    </span>
  )
}

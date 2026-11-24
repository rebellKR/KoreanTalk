type Props = { value: number; max: number; label?: string }

// 얇고 둥근 진행률 바 + 숫자 (DESIGN.md 4. Progress Bar)
export default function ProgressBar({ value, max, label }: Props) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-[13px] text-text-secondary">{label}</span>
        <span className="text-[13px] tabular-nums text-text-secondary">
          <span className="text-[15px] font-semibold text-text-primary">{value}</span> / {max}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

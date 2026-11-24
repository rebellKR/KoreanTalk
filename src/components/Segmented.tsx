type Option<T> = { value: T; label: string }

// 여러 개 중 하나를 고르는 버튼 묶음 (iOS 스타일)
export default function Segmented<T extends string | number>({
  options, value, onChange,
}: { options: Option<T>[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 rounded-xl bg-background p-1 ring-1 ring-border/60">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            className={`min-h-9 flex-1 rounded-lg px-2 text-[13px] font-semibold transition ${
              active ? 'bg-surface text-primary shadow-[0_1px_3px_rgba(15,23,42,0.12)] dark:bg-border' : 'text-text-secondary'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

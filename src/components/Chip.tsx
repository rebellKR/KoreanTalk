// 카테고리 필터용 작은 알약 버튼
export default function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold transition active:scale-95 ${
        active ? 'bg-text-primary text-surface' : 'bg-background text-text-secondary ring-1 ring-border/70 dark:bg-border/50'
      }`}
    >
      {label}
    </button>
  )
}

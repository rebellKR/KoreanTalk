// 각 화면 상단 제목 (Page Title 24–28px)
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-[26px] font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-[14px] text-text-secondary">{subtitle}</p>}
    </header>
  )
}

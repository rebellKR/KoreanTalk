// 섹션 제목 + 오른쪽 "すべて見る" 같은 보조 링크
export default function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mb-3 mt-8 flex items-baseline justify-between">
      <h2 className="text-[18px] font-bold tracking-[-0.01em]">{title}</h2>
      {action && <button className="text-[13px] font-medium text-primary">{action}</button>}
    </div>
  )
}

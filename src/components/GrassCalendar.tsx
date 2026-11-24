import { todayJP } from '../utils/date'

// GitHub 잔디처럼 학습한 날을 색칠 (최근 16주)
const WEEKS = 16

export default function GrassCalendar({ log }: { log: Record<string, number> }) {
  // 오늘이 무슨 요일인지 (월=0 … 일=6) → 마지막 열을 이번 주로 맞춤
  const dow = (new Date(todayJP()).getUTCDay() + 6) % 7
  const totalDays = WEEKS * 7
  const cells = Array.from({ length: totalDays }, (_, i) => {
    const offset = i - (totalDays - 1 - (6 - dow)) // 오늘 기준 며칠 전/후
    const date = todayJP(offset)
    return { date, n: offset > 0 ? -1 : log[date] ?? 0 } // -1 = 미래(빈 칸)
  })
  const color = (n: number) =>
    n < 0 ? 'bg-transparent' : n === 0 ? 'bg-border/60' : n < 5 ? 'bg-primary/30' : n < 15 ? 'bg-primary/60' : 'bg-primary'
  const activeDays = Object.keys(log).length

  return (
    <div>
      {/* 세로 7칸(요일) × 가로 16열(주) */}
      <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
        {cells.map((c) => (
          <span key={c.date} title={`${c.date}: ${Math.max(c.n, 0)}`} className={`aspect-square rounded-[3px] ${color(c.n)}`} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-text-secondary">
        <span>学習した日：合計 {activeDays}日</span>
        <span className="flex items-center gap-1">
          少 {[0, 3, 8, 20].map((n) => <span key={n} className={`h-2.5 w-2.5 rounded-[2px] ${color(n)}`} />)} 多
        </span>
      </div>
    </div>
  )
}

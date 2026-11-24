// 일본 시간 기준 날짜 문자열 (예: "2026-11-24")
export function todayJP(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000)
  return d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' })
}

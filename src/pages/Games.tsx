import { useNavigate } from 'react-router-dom'
import { Zap, Puzzle, ChevronRight, Trophy } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import { useProgress } from '../context/ProgressContext'

export default function Games() {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const games = [
    { to: '/games/speed', icon: Zap, title: 'スピードクイズ', desc: '60秒で何問わかる？韓国語の意味を選ぼう',
      best: progress.gameBest.speed !== undefined ? `${progress.gameBest.speed}問` : null, color: 'from-[#06B6D4] to-[#5267E8]' },
    { to: '/games/pair', icon: Puzzle, title: 'ペアマッチ', desc: '韓国語と日本語のカードをそろえよう',
      best: progress.gameBest.pair !== undefined ? `${progress.gameBest.pair}手` : null, color: 'from-[#EC4899] to-[#8B5CF6]' },
  ]
  return (
    <div className="min-h-dvh">
      <BackHeader title="ゲーム" subtitle="遊びながら単語を覚えよう" />
      <div className="space-y-3 px-6">
        {games.map(({ to, icon: Icon, title, desc, best, color }) => (
          <button key={to} onClick={() => navigate(to)}
            className={`relative w-full overflow-hidden rounded-[24px] bg-gradient-to-br ${color} p-5 text-left text-white transition active:scale-[0.98]`}>
            {/* 배경 장식 아이콘 */}
            <Icon size={120} className="absolute -right-6 -bottom-6 opacity-15" />
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20"><Icon size={24} /></span>
            <p className="mt-8 text-[20px] font-bold">{title}</p>
            <p className="mt-1 text-[13px] opacity-90">{desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[12px] font-semibold">
                <Trophy size={13} /> {best ? `ベスト ${best}` : 'まだ記録なし'}
              </span>
              <ChevronRight size={20} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

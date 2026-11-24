import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import Confetti from './Confetti'
import Button from './Button'
import { useProgress } from '../context/ProgressContext'
import { useAchievements } from '../hooks/useAchievements'
import { BADGES } from '../data/badges'
import { levelTitle } from '../utils/level'

// 앱 어디에서든 레벨업·배지 획득을 감지해서 축하 연출을 보여줌
export default function Celebrations() {
  const { progress, markSeen } = useProgress()
  const { level, earned } = useAchievements()
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const [badgeToast, setBadgeToast] = useState<string | null>(null)
  const { pathname } = useLocation()
  // 카드 학습·퀴즈·게임·레슨 중에는 방해하지 않고, 끝나고 나왔을 때 축하
  const busy = /^\/(vocabulary\/study|topik\/quiz|games\/|conversation\/)/.test(pathname)

  useEffect(() => {
    // 처음 실행: 이미 가진 배지는 조용히 "본 것"으로 처리
    if (progress.badgesSeen === null) { markSeen(earned, level); return }
    if (busy) return
    const newBadges = earned.filter((id) => !progress.badgesSeen!.includes(id))
    if (level > progress.levelSeen) setLevelUp(level)
    if (newBadges.length) setBadgeToast(newBadges[newBadges.length - 1])
    if (newBadges.length || level !== progress.levelSeen) markSeen(earned, level)
  }, [earned.join(), level, busy]) // eslint-disable-line

  // 배지 알림은 3초 뒤 자동으로 사라짐
  useEffect(() => {
    if (!badgeToast) return
    const t = setTimeout(() => setBadgeToast(null), 3000)
    return () => clearTimeout(t)
  }, [badgeToast])

  const badge = BADGES.find((b) => b.id === badgeToast)

  return (
    <>
      {/* ===== 배지 획득 알림 (위에서 내려옴) ===== */}
      {badge && (
        <div className="fixed inset-x-0 z-50 flex justify-center px-5" style={{ top: 'calc(env(safe-area-inset-top) + 10px)' }}>
          <div className="flex animate-[drop-in_0.5s_cubic-bezier(.2,1.4,.4,1)] items-center gap-3 rounded-full bg-text-primary py-2 pr-5 pl-2 text-background shadow-xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: badge.color }}>
              <badge.icon size={20} color="white" />
            </span>
            <span>
              <span className="block text-[11px] opacity-70">バッジ獲得！</span>
              <span className="block text-[14px] font-bold">{badge.title}</span>
            </span>
          </div>
        </div>
      )}

      {/* ===== 레벨업 화면 ===== */}
      {levelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-8 backdrop-blur-sm" onClick={() => setLevelUp(null)}>
          <Confetti count={60} />
          <div className="w-full max-w-xs animate-[pop_0.5s_ease-out] rounded-[28px] bg-surface p-7 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto flex h-24 w-24 animate-[spin-slow_6s_linear_infinite] items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
              <Sparkles size={40} />
            </div>
            <p className="mt-5 text-[13px] font-semibold text-primary">LEVEL UP!</p>
            <p className="mt-1 text-[40px] font-bold leading-none tabular-nums">Lv.{levelUp}</p>
            <p className="mt-2 text-[14px] text-text-secondary">称号：{levelTitle(levelUp)}</p>
            <div className="mt-6"><Button full onClick={() => setLevelUp(null)}>やったー！</Button></div>
          </div>
        </div>
      )}
    </>
  )
}

import { useProgress } from '../context/ProgressContext'
import { BADGES, type BadgeStats } from '../data/badges'
import { levelInfo } from '../utils/level'

// 레벨·배지 상태를 한 번에 계산
export function useAchievements() {
  const { progress, learnedCount, streak } = useProgress()
  const lv = levelInfo(progress.xp)
  const stats: BadgeStats = {
    learned: learnedCount,
    cardsStudied: Object.keys(progress.cards).length,
    lessons: progress.completed.length,
    streak,
    favorites: progress.favorites.length,
    topikPerfect: Object.values(progress.topikBest).some((v) => v >= 100),
    speedBest: progress.gameBest.speed ?? 0,
    pairPlayed: progress.gameBest.pair !== undefined,
    level: lv.level,
  }
  const earned = BADGES.filter((b) => b.test(stats)).map((b) => b.id)
  return { ...lv, xp: progress.xp, earned, stats }
}

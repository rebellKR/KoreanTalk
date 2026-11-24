import {
  Footprints, BookCheck, Library, Crown, MessageCircle, Award, Flame, CalendarCheck, Trophy, Star, Zap, Puzzle, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { SITUATIONS } from './conversations'

// 배지 판정에 쓰는 값
export type BadgeStats = {
  learned: number; cardsStudied: number; lessons: number; streak: number; favorites: number
  topikPerfect: boolean; speedBest: number; pairPlayed: boolean; level: number
}

export type Badge = { id: string; title: string; desc: string; icon: LucideIcon; color: string; test: (s: BadgeStats) => boolean }

// 배지 목록 (조건을 만족하면 자동으로 획득)
export const BADGES: Badge[] = [
  { id: 'first-card', title: 'はじめの一歩', desc: '単語カードを初めて学習', icon: Footprints, color: '#60A5FA', test: (s) => s.cardsStudied >= 1 },
  { id: 'words-10', title: '単語コレクター', desc: '10語を覚えた', icon: BookCheck, color: '#34D399', test: (s) => s.learned >= 10 },
  { id: 'words-50', title: '単語マスター', desc: '50語を覚えた', icon: Library, color: '#10B981', test: (s) => s.learned >= 50 },
  { id: 'words-100', title: '単語の達人', desc: '100語を覚えた', icon: Crown, color: '#F59E0B', test: (s) => s.learned >= 100 },
  { id: 'lesson-1', title: 'はじめての会話', desc: '会話レッスンを1つ完了', icon: MessageCircle, color: '#A78BFA', test: (s) => s.lessons >= 1 },
  { id: 'lesson-all', title: '会話マスター', desc: `会話レッスン${SITUATIONS.length}つをすべて完了`, icon: Award, color: '#8B5CF6', test: (s) => s.lessons >= SITUATIONS.length },
  { id: 'streak-3', title: '3日連続', desc: '3日続けて学習', icon: Flame, color: '#FB923C', test: (s) => s.streak >= 3 },
  { id: 'streak-7', title: '1週間連続', desc: '7日続けて学習', icon: CalendarCheck, color: '#F97316', test: (s) => s.streak >= 7 },
  { id: 'streak-30', title: '30日連続', desc: '30日続けて学習', icon: Trophy, color: '#EF4444', test: (s) => s.streak >= 30 },
  { id: 'topik-100', title: 'TOPIK満点', desc: 'TOPIK練習で100%', icon: Star, color: '#EAB308', test: (s) => s.topikPerfect },
  { id: 'speed-15', title: 'スピードスター', desc: 'スピードクイズで15問正解', icon: Zap, color: '#06B6D4', test: (s) => s.speedBest >= 15 },
  { id: 'pair', title: 'ペアマッチ達人', desc: 'ペアマッチをクリア', icon: Puzzle, color: '#EC4899', test: (s) => s.pairPlayed },
  { id: 'level-5', title: 'Lv.5 到達', desc: 'レベル5になった', icon: Sparkles, color: '#5267E8', test: (s) => s.level >= 5 },
]

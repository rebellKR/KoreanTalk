import { Coffee, Heart, ShoppingBag, Plane, MessageCircle, Stethoscope, Briefcase, MessagesSquare, type LucideIcon } from 'lucide-react'
import type { Situation } from '../types'
import raw from './conversations.json'

// 회화 데이터 (conversations.json에 상황을 추가하면 자동으로 늘어남)
export const SITUATIONS = raw as Situation[]

// json의 icon 이름 → 실제 아이콘
const ICONS: Record<string, LucideIcon> = { Coffee, Heart, ShoppingBag, Plane, MessageCircle, Stethoscope, Briefcase }
export const iconOf = (name: string) => ICONS[name] ?? MessagesSquare

export const LEVEL_LABEL = { 1: '初級', 2: '中級', 3: '上級' } as const

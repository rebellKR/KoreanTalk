import { NavLink } from 'react-router-dom'
import { House, MessagesSquare, BookOpen, Star, User, type LucideIcon } from 'lucide-react'

const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'ホーム', icon: House },
  { to: '/conversation', label: '会話', icon: MessagesSquare },
  { to: '/vocabulary', label: '単語', icon: BookOpen },
  { to: '/favorites', label: 'お気に入り', icon: Star },
  { to: '/mypage', label: 'マイページ', icon: User },
]

// 화면 아래에 떠 있는 캡슐형 탭바 (반투명 유리 효과)
export default function TabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md px-4"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }} // 홈 바 위로 띄움
    >
      <ul className="flex rounded-[28px] bg-surface/80 p-1.5 shadow-[0_8px_32px_-8px_rgba(15,23,42,0.18)] ring-1 ring-border/70 backdrop-blur-xl dark:bg-surface/75 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                // 선택된 탭은 옅은 Primary 배경의 알약 모양
                `flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-[22px] text-[10px] font-semibold transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={21} strokeWidth={isActive ? 2.2 : 1.7} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

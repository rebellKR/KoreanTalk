import { NavLink } from 'react-router-dom'
import { House, MessagesSquare, BookOpen, Star, User, type LucideIcon } from 'lucide-react'

// 탭 정의 (DESIGN.md 4. Navigation)
const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'ホーム', icon: House },
  { to: '/conversation', label: '会話', icon: MessagesSquare },
  { to: '/vocabulary', label: '単語', icon: BookOpen },
  { to: '/favorites', label: 'お気に入り', icon: Star },
  { to: '/mypage', label: 'マイページ', icon: User },
]

export default function TabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-border bg-surface/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} // 홈 바에 가리지 않게
    >
      <ul className="flex">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'} // '/'는 정확히 일치할 때만 활성화
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 pt-2 pb-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
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

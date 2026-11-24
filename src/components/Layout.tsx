import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'

export default function Layout() {
  return (
    // 100dvh: iPhone Safari 주소창 높이 변화에도 정확한 화면 높이
    <div className="mx-auto flex h-dvh max-w-md flex-col">
      {/* 위쪽 safe-area(다이내믹 아일랜드) 만큼 여백 + 하단 탭바 높이만큼 여백 */}
      <main
        className="flex-1 overflow-y-auto px-5"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)',
        }}
      >
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}

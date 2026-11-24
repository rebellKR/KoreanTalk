import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'
import { useSettings } from '../context/SettingsContext'

// 文字サイズ → 본문 영역 배율 (탭바는 그대로)
const ZOOM = { sm: 0.92, md: 1, lg: 1.12 }

export default function Layout() {
  const { settings } = useSettings()
  return (
    // 100dvh: iPhone Safari 주소창 높이 변화에도 정확한 화면 높이
    <div className="mx-auto flex h-dvh max-w-md flex-col">
      {/* 위쪽 여백은 각 화면이 정함 (홈은 색 헤더가 아일랜드 뒤까지 깔림) */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 104px)' }}>
        {/* zoom: 안의 글자·여백을 한 번에 같은 비율로 키우거나 줄임 */}
        <div style={{ zoom: ZOOM[settings.fontSize] }}>
          <Outlet />
        </div>
      </main>
      <TabBar />
    </div>
  )
}

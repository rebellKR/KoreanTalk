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
      {/* 위쪽 safe-area(다이내믹 아일랜드) 만큼 여백 + 하단 탭바 높이만큼 여백 */}
      <main
        className="flex-1 overflow-y-auto px-5"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 20px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 104px)',
        }}
      >
        {/* zoom: 안의 글자·여백을 한 번에 같은 비율로 키우거나 줄임 */}
        <div style={{ zoom: ZOOM[settings.fontSize] }}>
          <Outlet />
        </div>
      </main>
      <TabBar />
    </div>
  )
}

import { useEffect } from 'react'

// 화면 위쪽에 잠깐 나타나는 알림
export default function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, 2200) // 2.2초 후 자동으로 사라짐
    return () => clearTimeout(t)
  }, [message, onClose])
  if (!message) return null
  return (
    <div className="fixed inset-x-0 z-50 flex justify-center px-6" style={{ top: 'calc(env(safe-area-inset-top) + 12px)' }}>
      <div className="rounded-full bg-text-primary px-5 py-2.5 text-[14px] font-medium text-background shadow-lg">{message}</div>
    </div>
  )
}

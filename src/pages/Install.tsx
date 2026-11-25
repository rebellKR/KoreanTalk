import { useState } from 'react'
import { Share, SquarePlus, Smartphone, CheckCircle2, Link2 } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import Toast from '../components/Toast'

// 홈 화면에서 앱처럼 열렸는지 (주소창 없는 모드)
const isStandalone = () =>
  matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

// 공유할 주소: '#/mypage/install' 같은 화면 경로는 빼고 앱 첫 화면 주소만
const appUrl = () => location.href.split('#')[0]

const STEPS = [
  { icon: Share, title: '共有ボタンをタップ', desc: 'Safari の画面下にある □↑ のボタン' },
  { icon: SquarePlus, title: '「ホーム画面に追加」を選ぶ', desc: 'メニューを下にスクロールすると出てきます' },
  { icon: CheckCircle2, title: '右上の「追加」をタップ', desc: 'ホーム画面のアイコンからアプリのように開けます' },
]

export default function Install() {
  const [toast, setToast] = useState<string | null>(null)
  const installed = isStandalone()

  // iPhone 공유 시트 열기 (지원 안 하면 주소 복사)
  const share = async () => {
    const data = { title: '韓国語トーク', text: '韓国語の勉強アプリ', url: appUrl() }
    try {
      if (navigator.share) return await navigator.share(data)
      await navigator.clipboard.writeText(data.url)
      setToast('URLをコピーしました')
    } catch { /* 공유 창을 닫은 경우 — 아무것도 안 함 */ }
  }

  return (
    <div className="pb-10">
      <BackHeader title="ホーム画面に追加" subtitle="アプリのように使えます・オフラインでもOK" />
      <div className="space-y-4 px-4">
        {installed ? (
          <Card tone="accent" className="flex items-center gap-3">
            <CheckCircle2 className="text-primary" size={22} />
            <span className="text-[15px] font-semibold">ホーム画面から開いています 🎉</span>
          </Card>
        ) : (
          <Card>
            <ol className="space-y-5">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold">{i + 1}. {title}</span>
                    <span className="block text-[13px] text-text-secondary">{desc}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-center gap-2 text-[12px] text-text-secondary">
              <Smartphone size={14} /> iPhone は Safari で開いてください
            </p>
          </Card>
        )}

        <Card>
          <p className="text-[15px] font-semibold">友達にシェア</p>
          <p className="mt-1 break-all text-[13px] text-text-secondary">{appUrl()}</p>
          <Button full className="mt-4" onClick={share}><Link2 size={18} /> URLを共有</Button>
        </Card>
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}

import { Volume2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'

// STAGE 1: 공통 컴포넌트 확인용 샘플 화면 (본격 구현은 STAGE 5)
export default function Home() {
  return (
    <>
      <PageHeader title="こんにちは 👋" subtitle="今日も少しずつ韓国語を学びましょう" />

      <div className="space-y-4">
        <Card>
          <h2 className="mb-4 text-[18px] font-bold">今日の目標</h2>
          <ProgressBar value={4} max={10} label="単語" />
        </Card>

        <Card>
          <p className="mb-3 text-[13px] font-medium text-primary">今日のひとこと</p>
          {/* 한국어 학습 문장은 크게 강조 */}
          <p className="font-ko text-[26px] font-bold leading-snug">오늘 날씨 좋다!</p>
          <p className="mt-1 text-[13px] text-text-secondary">オヌル ナルッシ チョタ</p>
          <p className="mt-3 text-[15px]">今日いい天気だね！</p>
          <div className="mt-5 flex gap-2">
            <Button variant="secondary">
              <Volume2 size={18} /> 聞く
            </Button>
            <Button variant="ghost">お気に入り</Button>
          </div>
        </Card>

        <Button full>学習をはじめる</Button>
      </div>
    </>
  )
}

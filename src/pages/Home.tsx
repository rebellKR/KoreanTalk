import { Volume2, Star, ChevronRight, MessagesSquare, Type, BookText, GraduationCap, Flame, type LucideIcon } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import IconButton from '../components/IconButton'
import SectionTitle from '../components/SectionTitle'

// 오늘 날짜를 일본 형식으로 (예: 11月24日 火曜日)
const today = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo', month: 'long', day: 'numeric', weekday: 'long',
}).format(new Date())

// 카테고리 카드 데이터 (STAGE 1은 표시만)
const categories: { title: string; ko: string; icon: LucideIcon }[] = [
  { title: '会話', ko: '회화', icon: MessagesSquare },
  { title: '単語', ko: '단어', icon: BookText },
  { title: 'ハングル', ko: '한글', icon: Type },
  { title: 'TOPIK', ko: '토픽', icon: GraduationCap },
]

// STAGE 1: 디자인 확인용 샘플 화면 (본격 구현은 STAGE 5)
export default function Home() {
  return (
    <>
      <PageHeader
        caption={today}
        title="こんにちは"
        right={
          // 연속 학습일 배지
          <div className="flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-[13px] font-semibold ring-1 ring-border">
            <Flame size={15} className="text-warning" />
            <span className="tabular-nums">3</span>
          </div>
        }
      />

      {/* 오늘의 한마디: 가장 중요한 학습 문장 → 강조 카드 */}
      <Card tone="accent" className="p-6">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-primary">今日のひとこと</p>
        <p className="mt-4 font-ko text-[30px] leading-[1.3] font-bold tracking-[-0.02em]">오늘 날씨 좋다!</p>
        <p className="mt-1.5 text-[13px] text-text-secondary">オヌル ナルッシ チョタ</p>
        <div className="my-5 h-px bg-primary/10" />
        <div className="flex items-center justify-between">
          <p className="text-[15px]">今日いい天気だね！</p>
          <div className="flex gap-2">
            <IconButton icon={Star} label="お気に入り" />
            <IconButton icon={Volume2} label="聞く" variant="solid" />
          </div>
        </div>
      </Card>

      <SectionTitle title="今日の目標" />
      <Card>
        <ProgressBar value={4} max={10} label="単語" />
        <div className="mt-5">
          <ProgressBar value={1} max={3} label="フレーズ" />
        </div>
      </Card>

      <SectionTitle title="カテゴリ" action="すべて見る" />
      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ title, ko, icon: Icon }) => (
          <Card key={title} className="p-4 transition active:scale-[0.98]">
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={20} strokeWidth={1.9} />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[15px] font-bold">{title}</p>
                <p className="font-ko text-[12px] text-text-secondary">{ko}</p>
              </div>
              <ChevronRight size={18} className="text-text-secondary" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button full>学習をはじめる</Button>
      </div>
    </>
  )
}

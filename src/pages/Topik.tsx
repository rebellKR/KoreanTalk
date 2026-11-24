import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookA, PenLine, FileText, Shuffle, NotebookPen, ExternalLink, ChevronRight, type LucideIcon } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import Segmented from '../components/Segmented'
import { TOPIK, SECTION_LABEL } from '../data/study'
import { useProgress } from '../context/ProgressContext'

const SECTIONS: { id: 'vocab' | 'grammar' | 'reading'; icon: LucideIcon; desc: string }[] = [
  { id: 'vocab', icon: BookA, desc: '( )に入る言葉を選ぶ' },
  { id: 'grammar', icon: PenLine, desc: '助詞・語尾を選ぶ' },
  { id: 'reading', icon: FileText, desc: '短い文章を読んで答える' },
]

// 공식 사이트 (과거 기출문제는 저작권 때문에 앱에 넣지 않고 링크로 연결)
const LINKS = [
  { title: 'TOPIK 公式サイト（韓国）', desc: '過去問のダウンロード・試験情報', url: 'https://www.topik.go.kr' },
  { title: '韓国教育財団（日本の実施機関）', desc: '日本での試験日程・申し込み', url: 'https://www.kref.or.jp' },
]

export default function Topik() {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const [level, setLevel] = useState<'I' | 'II'>('I')
  const count = (section?: string) => TOPIK.filter((q) => q.level === level && (!section || q.section === section)).length

  return (
    <div className="min-h-dvh bg-surface">
      <BackHeader title="TOPIK" subtitle={`オリジナル練習問題 ${TOPIK.length}問`} />

      <div className="px-6">
        <Segmented<'I' | 'II'> value={level} onChange={setLevel}
          options={[{ value: 'I', label: 'TOPIK Ⅰ（1〜2級）' }, { value: 'II', label: 'TOPIK Ⅱ（3〜6級）' }]} />
      </div>

      {/* 영역별 */}
      <ul className="mt-5 border-t border-border/70">
        {SECTIONS.map(({ id, icon: Icon, desc }) => {
          const best = progress.topikBest[`${level}-${id}`]
          return (
            <li key={id} className="border-b border-border/70">
              <button onClick={() => navigate(`/topik/quiz?level=${level}&section=${id}`)}
                className="flex w-full items-center gap-4 px-6 py-4 text-left transition active:bg-background">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border/60 dark:bg-border/60">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span className="flex-1">
                  <span className="block text-[16px] font-bold">{SECTION_LABEL[id]}</span>
                  <span className="block text-[12px] text-text-secondary">{desc} · {count(id)}問</span>
                </span>
                {best !== undefined && (
                  <span className={`rounded-full px-2.5 py-1 text-[12px] font-bold tabular-nums ${best >= 80 ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'}`}>
                    最高 {best}%
                  </span>
                )}
                <ChevronRight size={18} className="text-text-secondary" />
              </button>
            </li>
          )
        })}
      </ul>

      {/* 랜덤 / 오답 노트 */}
      <div className="grid grid-cols-2 gap-3 px-6 py-5">
        <button onClick={() => navigate(`/topik/quiz?level=${level}`)}
          className="rounded-card bg-primary p-4 text-left text-on-primary transition active:scale-[0.98]">
          <Shuffle size={20} />
          <p className="mt-6 text-[15px] font-bold">ランダム10問</p>
          <p className="text-[12px] opacity-80">全分野からミックス</p>
        </button>
        <button disabled={progress.wrongNotes.length === 0} onClick={() => navigate('/topik/quiz?mode=wrong')}
          className="rounded-card bg-background p-4 text-left ring-1 ring-border/60 transition active:scale-[0.98] disabled:opacity-50 dark:bg-border/40">
          <NotebookPen size={20} className="text-warning" />
          <p className="mt-6 text-[15px] font-bold">間違いノート</p>
          <p className="text-[12px] text-text-secondary">{progress.wrongNotes.length}問を復習</p>
        </button>
      </div>

      {/* 공식 사이트 링크 */}
      <section className="px-6 pb-6">
        <h2 className="mb-2 text-[12px] font-semibold tracking-[0.08em] text-text-secondary">過去問・公式情報</h2>
        <ul className="divide-y divide-border/70 rounded-card bg-background dark:bg-border/40">
          {LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3.5 transition active:opacity-60">
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{l.title}</span>
                  <span className="block text-[12px] text-text-secondary">{l.desc}</span>
                </span>
                <ExternalLink size={16} className="text-text-secondary" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-text-secondary">
          ※ アプリ内の問題はTOPIKの形式を参考にしたオリジナル問題です。実際の過去問は公式サイトでご確認ください。
        </p>
      </section>
    </div>
  )
}

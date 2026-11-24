import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import BackHeader from '../components/BackHeader'
import Segmented from '../components/Segmented'
import { HANGUL } from '../data/study'
import { useSettings } from '../context/SettingsContext'
import { speakKorean } from '../utils/speak'

type Tab = 'consonants' | 'vowels' | 'batchim'

export default function Hangul() {
  const { settings } = useSettings()
  const [tab, setTab] = useState<Tab>('consonants')
  const [selected, setSelected] = useState(0) // 선택한 글자 번호
  const list = tab === 'batchim' ? [] : HANGUL[tab]
  const cur = list[selected]

  // 글자를 누르면 → 선택 + 소리 재생
  const tap = (i: number, say: string) => {
    setSelected(i)
    speakKorean(say, settings.ttsRate * 0.85)
  }

  return (
    <div className="min-h-dvh bg-surface">
      <BackHeader title="ハングル基礎" subtitle="子音・母音・パッチムをタップして音を聞こう" />

      {/* 글자 구조 설명: 자음 + 모음 (+ 받침) */}
      <section className="mx-6 rounded-card bg-primary/[0.07] p-4 dark:bg-primary/15">
        <p className="text-[13px] font-semibold text-primary">ハングルのしくみ</p>
        <div className="mt-3 flex items-center justify-center gap-2 font-ko text-[22px] font-bold">
          <span className="rounded-xl bg-surface px-3 py-1">ㄱ</span>+<span className="rounded-xl bg-surface px-3 py-1">ㅏ</span>=
          <span className="rounded-xl bg-primary px-3 py-1 text-on-primary">가</span>
          <span className="mx-1 text-text-secondary">→</span>
          <span className="rounded-xl bg-primary px-3 py-1 text-on-primary">감</span>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-text-secondary">
          子音（ㄱ）＋母音（ㅏ）で1文字。下にもう1つ子音（ㅁ）が付くと「パッチム」になります。
        </p>
      </section>

      <div className="px-6 pt-5">
        <Segmented<Tab> value={tab} onChange={(t) => { setTab(t); setSelected(0) }}
          options={[{ value: 'consonants', label: `子音 ${HANGUL.consonants.length}` }, { value: 'vowels', label: `母音 ${HANGUL.vowels.length}` }, { value: 'batchim', label: 'パッチム' }]} />
      </div>

      {tab !== 'batchim' && cur ? (
        <>
          {/* 선택한 글자 상세 */}
          <section key={cur.char} className="mx-6 mt-5 flex animate-[slide-up_0.25s_ease-out] items-center gap-5 rounded-card bg-background p-5 dark:bg-border/40">
            <button onClick={() => speakKorean(cur.say, settings.ttsRate * 0.85)}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-surface font-ko text-[44px] font-bold shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition active:scale-90">
              {cur.char}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-primary">{cur.roman}</p>
              <p className="mt-0.5 text-[15px] font-semibold">{cur.sound}</p>
              <button onClick={() => speakKorean(cur.exKo, settings.ttsRate)} className="mt-2 flex items-center gap-1.5 text-left">
                <Volume2 size={15} className="shrink-0 text-text-secondary" />
                <span className="font-ko text-[15px] font-semibold">{cur.exKo}</span>
                <span className="text-[13px] text-text-secondary">{cur.exJa}</span>
              </button>
            </div>
          </section>

          {/* 글자 그리드 */}
          <div className="grid grid-cols-5 gap-2 px-6 py-5">
            {list.map((j, i) => (
              <button key={j.char} onClick={() => tap(i, j.say)}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl transition active:scale-90 ${
                  i === selected ? 'bg-primary text-on-primary' : 'bg-background ring-1 ring-border/60 dark:bg-border/50'
                }`}>
                <span className="font-ko text-[24px] font-bold leading-none">{j.char}</span>
                <span className={`mt-1 text-[10px] ${i === selected ? 'opacity-80' : 'text-text-secondary'}`}>{j.roman.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        // 받침 7가지 대표음
        <div className="px-6 py-5">
          <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">パッチムの発音は7種類だけ。いろいろな文字が同じ音になります。</p>
          <ul className="divide-y divide-border/70 rounded-card bg-background dark:bg-border/40">
            {HANGUL.batchim.map((b) => (
              <li key={b.sound}>
                <button onClick={() => speakKorean(b.exKo, settings.ttsRate * 0.85)} className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition active:opacity-60">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface font-ko text-[22px] font-bold">{b.sound}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold">[{b.roman}] {b.how}</span>
                    <span className="block text-[12px] text-text-secondary">{b.letters}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-ko text-[16px] font-bold">{b.exKo}</span>
                    <span className="block text-[11px] text-text-secondary">{b.exJa}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ON/OFF 스위치 (iOS 스타일)
export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}
    >
      {/* 동그란 손잡이: 켜지면 오른쪽으로 이동 */}
      <span
        className={`absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  )
}

import Button from './Button'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

// 아래에서 올라오는 확인 창 (실수로 리셋하는 것 방지)
export default function ConfirmDialog({ open, title, message, confirmLabel, danger, onConfirm, onCancel }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-t-[28px] bg-surface px-6 pt-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
        onClick={(e) => e.stopPropagation()} // 창 안을 눌러도 닫히지 않게
      >
        <h3 className="text-[18px] font-bold">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{message}</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button full onClick={onConfirm} className={danger ? '!bg-error !text-white !shadow-none' : ''}>
            {confirmLabel}
          </Button>
          <Button full variant="ghost" onClick={onCancel}>キャンセル</Button>
        </div>
      </div>
    </div>
  )
}

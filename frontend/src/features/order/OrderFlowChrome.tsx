import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useOrderDraft } from './OrderDraftContext'

// Green completed-step badge.
export function StepCheck() {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
      <Check className="h-4 w-4" />
    </span>
  )
}

// Numbered (incomplete) step badge.
export function StepCircle({ n }: { n: number }) {
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-xs font-semibold text-muted">
      {n}
    </span>
  )
}

// Top bar for the New email order screen: title + Cancel order.
export function OrderFlowHeader() {
  const navigate = useNavigate()
  const draft = useOrderDraft()
  return (
    <header className="flex h-16 items-center justify-between border-b border-line px-8">
      <span className="text-[15px] font-medium text-ink">New email order</span>
      <button
        onClick={() => {
          draft.clear()
          navigate('/send-rewards')
        }}
        className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Cancel order
      </button>
    </header>
  )
}

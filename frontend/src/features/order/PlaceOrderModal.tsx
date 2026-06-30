import { Modal } from '../../components/Modal'
import { formatCents } from '../../lib/money'

interface PlaceOrderModalProps {
  open: boolean
  recipientCount: number
  totalCents: number
  paymentLabel: string
  placing: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function PlaceOrderModal({
  open,
  totalCents,
  paymentLabel,
  placing,
  onCancel,
  onConfirm,
}: PlaceOrderModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Place order"
      footer={
        <>
          <button
            onClick={onCancel}
            disabled={placing}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            disabled={placing}
            className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
          >
            {placing ? 'Placing…' : 'Confirm'}
          </button>
        </>
      }
    >
      <p className="text-sm text-ink">
        {formatCents(totalCents)} will be withdrawn from {paymentLabel}.
      </p>
      <p className="mt-4 text-sm text-muted">
        If you need to make any changes to your order after confirming, contact
        support.
      </p>
    </Modal>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Trash2,
  Upload,
  Settings,
  CornerDownLeft,
  ChevronDown,
} from 'lucide-react'
import { useOrderDraft } from '../features/order/OrderDraftContext'
import { dollarsToCents, formatCents } from '../lib/money'
import { AddFromContactsModal } from '../features/contacts/AddFromContactsModal'

const COLS = 'grid-cols-[1fr_1.9fr_150px_150px_96px]'

export function RecipientsPage() {
  const draft = useOrderDraft()
  const navigate = useNavigate()
  const [pickerOpen, setPickerOpen] = useState(false)

  // Manual entry row state.
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')

  const addManual = () => {
    if (!email.trim() || !amount.trim()) return
    draft.addRecipient({
      name: name.trim(),
      email: email.trim(),
      amount_cents: dollarsToCents(amount),
      currency: 'USD',
    })
    setName('')
    setEmail('')
    setAmount('')
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-line px-4 sm:px-8">
        <span className="text-[15px] text-ink">
          <span className="font-medium underline">New email order</span>
          <span className="mx-2 text-muted">&rsaquo;</span>
          <span className="text-muted">Recipients</span>
        </span>
        <button
          onClick={() => navigate('/order/new')}
          className="text-muted hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-ink sm:text-[28px]">Recipients</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setPickerOpen(true)}
              className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Add from Contacts
            </button>
            <button className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50">
              <Upload className="h-4 w-4" /> Upload CSV or spreadsheet
            </button>
            <button className="rounded-md border border-line p-2.5 hover:bg-gray-50">
              <Settings className="h-4 w-4 text-muted" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-line">
          {/* Count row (white) */}
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-sm">
            <span>
              <span className="text-muted">Rows:</span> {draft.recipients.length}
              <span className="mx-2 text-line">|</span>
              <span className="text-muted">Subtotal:</span>{' '}
              {formatCents(draft.subtotalCents)} USD
            </span>
            {draft.recipients.length > 0 && (
              <button
                onClick={() =>
                  draft.recipients.forEach((r) => draft.removeRecipient(r._key))
                }
                className="text-sm text-brand hover:underline"
              >
                Clear table
              </button>
            )}
          </div>

          {/* Table body scrolls horizontally on small screens */}
          <div className="overflow-x-auto">
          <div className="min-w-[800px]">

          {/* Column headers (gray) */}
          <div
            className={`grid ${COLS} gap-3 border-b border-line bg-gray-50 px-4 py-2.5 text-[13px] text-muted`}
          >
            <span>Recipient name</span>
            <span>Recipient email *</span>
            <span>Amount *</span>
            <span>Currency code</span>
            <span />
          </div>

          {/* Manual add row */}
          <div
            className={`grid ${COLS} items-center gap-3 border-b border-line px-4 py-3`}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-line px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addManual()}
              className="rounded-md border border-line px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addManual()}
              placeholder="Amount"
              className="rounded-md border border-line px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
            <div className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm text-ink">
              USD <ChevronDown className="h-4 w-4 text-muted" />
            </div>
            <button
              onClick={addManual}
              className="flex items-center justify-center gap-1.5 rounded-md border border-brand px-3 py-2 text-sm font-medium text-brand hover:bg-brand/5"
            >
              Add <CornerDownLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Added rows */}
          {draft.recipients.map((r) => (
            <div
              key={r._key}
              className={`grid ${COLS} items-center gap-3 border-b border-line px-4 py-3 text-sm last:border-b-0`}
            >
              <span className="text-ink">{r.name || '—'}</span>
              <span className="text-ink">{r.email}</span>
              <span className="text-ink">{formatCents(r.amount_cents)}</span>
              <span className="text-ink">{r.currency}</span>
              <button
                onClick={() => draft.removeRecipient(r._key)}
                className="flex justify-center text-muted hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          </div>
          </div>
        </div>

        {draft.recipients.length > 0 && (
          <button
            onClick={() => navigate('/order/new')}
            className="mt-auto w-fit rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Continue
          </button>
        )}
      </div>

      <AddFromContactsModal open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  )
}

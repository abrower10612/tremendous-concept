import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Modal } from '../../components/Modal'
import { contactsApi } from '../../lib/api'
import { dollarsToCents } from '../../lib/money'
import { useOrderDraft } from '../order/OrderDraftContext'

interface AddFromContactsModalProps {
  open: boolean
  onClose: () => void
}

export function AddFromContactsModal({
  open,
  onClose,
}: AddFromContactsModalProps) {
  const draft = useOrderDraft()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [amount, setAmount] = useState('10')

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactsApi.list,
    enabled: open,
  })

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const close = () => {
    setSelected(new Set())
    onClose()
  }

  const addSelected = () => {
    const cents = dollarsToCents(amount)
    contacts
      .filter((c) => selected.has(c.id))
      .forEach((c) =>
        draft.addRecipient({
          name: c.name,
          email: c.email,
          amount_cents: cents,
          currency: 'USD',
        }),
      )
    close()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add from Contacts"
      width="max-w-lg"
      footer={
        <>
          <button
            onClick={close}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={addSelected}
            disabled={selected.size === 0}
            className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
          >
            Add {selected.size > 0 ? selected.size : ''} recipient
            {selected.size === 1 ? '' : 's'}
          </button>
        </>
      }
    >
      <label className="mb-4 block text-sm text-muted">
        Amount per recipient (USD)
        <div className="mt-1 flex items-center rounded-md border border-line px-3 focus-within:border-brand">
          <span className="text-muted">$</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full py-2 pl-1 text-sm text-ink focus:outline-none"
          />
        </div>
      </label>

      {isLoading ? (
        <p className="py-6 text-center text-sm text-muted">Loading contacts…</p>
      ) : contacts.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted">
          No contacts yet.{' '}
          <Link to="/contacts" onClick={close} className="text-brand underline">
            Add some on the Contacts page
          </Link>
          .
        </div>
      ) : (
        <ul className="max-h-72 divide-y divide-line overflow-y-auto rounded-md border border-line">
          {contacts.map((c) => (
            <li key={c.id}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggle(c.id)}
                  className="h-4 w-4 accent-brand"
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">
                    {c.name}
                  </span>
                  <span className="block text-sm text-muted">{c.email}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}

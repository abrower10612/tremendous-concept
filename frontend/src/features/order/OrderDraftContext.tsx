import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface DraftRecipient {
  _key: string
  name: string
  email: string
  amount_cents: number
  currency: string
}

interface OrderDraftValue {
  campaignName: string
  recipients: DraftRecipient[]
  externalId: string
  paymentLabel: string
  subtotalCents: number
  setExternalId: (v: string) => void
  addRecipient: (r: Omit<DraftRecipient, '_key'>) => void
  addRecipients: (rs: Omit<DraftRecipient, '_key'>[]) => void
  removeRecipient: (key: string) => void
  clear: () => void
}

const OrderDraftContext = createContext<OrderDraftValue | null>(null)

let keySeq = 0
const nextKey = () => `r${++keySeq}`

export function OrderDraftProvider({ children }: { children: ReactNode }) {
  const [recipients, setRecipients] = useState<DraftRecipient[]>([])
  const [externalId, setExternalId] = useState('')

  const value = useMemo<OrderDraftValue>(() => {
    const subtotalCents = recipients.reduce((sum, r) => sum + r.amount_cents, 0)
    return {
      campaignName: 'Generic Thank You',
      paymentLabel: 'EVERGREEN FEDERAL BANK *****7731',
      recipients,
      externalId,
      subtotalCents,
      setExternalId,
      addRecipient: (r) =>
        setRecipients((prev) => [...prev, { ...r, _key: nextKey() }]),
      addRecipients: (rs) =>
        setRecipients((prev) => [
          ...prev,
          ...rs.map((r) => ({ ...r, _key: nextKey() })),
        ]),
      removeRecipient: (key) =>
        setRecipients((prev) => prev.filter((r) => r._key !== key)),
      clear: () => {
        setRecipients([])
        setExternalId('')
      },
    }
  }, [recipients, externalId])

  return (
    <OrderDraftContext.Provider value={value}>
      {children}
    </OrderDraftContext.Provider>
  )
}

export function useOrderDraft(): OrderDraftValue {
  const ctx = useContext(OrderDraftContext)
  if (!ctx)
    throw new Error('useOrderDraft must be used within an OrderDraftProvider')
  return ctx
}

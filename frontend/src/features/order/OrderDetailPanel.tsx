import { useQuery } from '@tanstack/react-query'
import { X, CheckCircle2, ChevronDown, Copy, Info } from 'lucide-react'
import { ordersApi } from '../../lib/api'

interface OrderDetailPanelProps {
  publicId: string | null
  justPlaced: boolean
  onClose: () => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-2 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  )
}

export function OrderDetailPanel({
  publicId,
  justPlaced,
  onClose,
}: OrderDetailPanelProps) {
  const { data: order } = useQuery({
    queryKey: ['order', publicId],
    queryFn: () => ordersApi.get(publicId!),
    enabled: !!publicId,
  })

  if (!publicId) return null

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} aria-hidden />
      <aside className="absolute top-0 right-0 flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
        {!order ? (
          <div className="p-6 text-sm text-muted">Loading…</div>
        ) : (
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 capitalize">
                {order.status}
              </span>
              <button onClick={onClose} className="text-muted hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-3 text-xl font-semibold text-ink">
              Order ID {order.public_id}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {order.order_type} &middot; {order.amount} {order.currency}
            </p>

            {justPlaced && (
              <div
                data-tour="order-placed"
                className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
              >
                <CheckCircle2 className="h-5 w-5" />
                Your order was placed
              </div>
            )}

            <button className="mt-4 flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-gray-50">
              Actions <ChevronDown className="h-4 w-4" />
            </button>

            {/* Tabs */}
            <div className="mt-5 flex gap-6 border-b border-line">
              <span className="-mb-px border-b-2 border-brand pb-2 text-sm font-medium text-ink">
                Details
              </span>
              <span className="-mb-px border-b-2 border-transparent pb-2 text-sm text-muted">
                Rewards
              </span>
            </div>

            {/* Order details */}
            <h3 className="mt-5 font-semibold text-ink">Order details</h3>
            <dl className="mt-1 divide-y divide-line">
              <Row
                label="Order ID"
                value={
                  <span className="inline-flex items-center gap-1">
                    {order.public_id} <Copy className="h-3.5 w-3.5 text-muted" />
                  </span>
                }
              />
              <Row label="Order type" value={order.order_type} />
              <Row label="Number of rewards" value={order.rewards_count} />
              <Row label="Created on" value={order.created_on} />
              <Row
                label="Order placed by"
                value={
                  <span>
                    {order.placed_by_name}
                    <br />
                    <span className="text-muted">{order.placed_by_email}</span>
                  </span>
                }
              />
              <Row
                label="Campaign name"
                value={<span className="underline">{order.campaign_name}</span>}
              />
              <Row
                label="Products included"
                value={
                  <span className="inline-flex items-center gap-1">
                    {order.products_included}{' '}
                    <Info className="h-3.5 w-3.5 text-muted" />
                  </span>
                }
              />
              <Row label="Team" value="Northwind Labs" />
            </dl>

            {/* Payment info */}
            <h3 className="mt-6 font-semibold text-ink">Payment info</h3>
            <dl className="mt-1 divide-y divide-line">
              <Row label="Initiated on" value={order.created_on} />
              <Row label="Funding source" value={order.payment_method_label} />
              <Row label="Subtotal" value={`${order.subtotal} ${order.currency}`} />
              <Row label="Total paid" value={`${order.total} ${order.currency}`} />
            </dl>
          </div>
        )}
      </aside>
    </div>
  )
}

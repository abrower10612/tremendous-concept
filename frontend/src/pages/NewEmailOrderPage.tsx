import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { useOrderDraft } from '../features/order/OrderDraftContext'
import { ordersApi } from '../lib/api'
import { formatCents } from '../lib/money'
import { PlaceOrderModal } from '../features/order/PlaceOrderModal'
import { OrderFlowHeader, StepCheck, StepCircle } from '../features/order/OrderFlowChrome'

export function NewEmailOrderPage() {
  const draft = useOrderDraft()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const hasRecipients = draft.recipients.length > 0

  const placeOrder = useMutation({
    mutationFn: () =>
      ordersApi.create({
        campaign_name: draft.campaignName,
        external_id: draft.externalId || undefined,
        recipients_attributes: draft.recipients.map((r) => ({
          name: r.name,
          email: r.email,
          amount_cents: r.amount_cents,
          currency: r.currency,
        })),
      }),
    onSuccess: (order) => {
      draft.clear()
      navigate(`/history/orders?placed=${order.public_id}`)
    },
  })

  return (
    <div className="min-h-screen bg-white">
      <OrderFlowHeader />

      <div className="mx-auto max-w-5xl px-8 py-10">
        <h1 className="text-2xl font-semibold text-ink">New email order</h1>
        <p className="mt-1 text-sm text-muted">Team: Northwind Labs</p>

        <div
          className={`mt-8 grid grid-cols-1 gap-8 ${
            hasRecipients ? 'lg:grid-cols-[1fr_360px]' : ''
          }`}
        >
          {/* Builder card */}
          <div className="rounded-xl border border-line bg-white p-6">
            {/* Campaign */}
            <div className="flex items-start justify-between pb-5">
              <div className="flex gap-3">
                <StepCheck />
                <div>
                  <h3 className="font-semibold text-ink">Campaign</h3>
                  <p className="mt-2 text-sm text-ink">
                    Virtual Visa &bull; 216 locations
                  </p>
                  <button className="mt-1 text-sm text-ink underline">
                    Edit campaign details
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm">
                {draft.campaignName}
                <ChevronDown className="h-4 w-4 text-muted" />
              </div>
            </div>

            <div className="border-t border-line" />

            {/* Recipients */}
            <div className="flex items-start justify-between py-5">
              <div className="flex gap-3">
                {hasRecipients ? <StepCheck /> : <StepCircle n={2} />}
                <div>
                  <h3 className="font-semibold text-ink">Recipients</h3>
                  {hasRecipients ? (
                    <div className="mt-2 text-sm">
                      <button
                        onClick={() => navigate('/order/new/recipients')}
                        className="text-ink underline"
                      >
                        {draft.recipients.length} recipient
                        {draft.recipients.length === 1 ? '' : 's'}
                      </button>
                      <p className="mt-1 text-ink">
                        {draft.recipients.length === 1
                          ? `Reward is ${formatCents(draft.subtotalCents)}`
                          : `Each reward is ${formatCents(
                              draft.recipients[0].amount_cents,
                            )}`}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-muted">
                      Enter reward amounts and delivery information
                    </p>
                  )}
                </div>
              </div>
              {hasRecipients ? (
                <button
                  onClick={() => navigate('/order/new/recipients')}
                  className="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => navigate('/order/new/recipients')}
                  className="rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Add recipients
                </button>
              )}
            </div>

            <div className="border-t border-line" />

            {/* Payment */}
            <div className="flex items-center justify-between pt-5">
              <div className="flex items-center gap-3">
                <StepCheck />
                <h3 className="font-semibold text-ink">Payment method</h3>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm">
                {draft.paymentLabel}
                <ChevronDown className="h-4 w-4 text-muted" />
              </div>
            </div>
          </div>

          {/* Summary panel (only once recipients exist) */}
          {hasRecipients && (
            <div className="h-fit rounded-xl border border-line bg-white p-5">
              <div className="flex gap-2">
                <div className="h-16 flex-1 rounded-md border border-line bg-gray-50" />
                <div className="flex flex-col gap-2">
                  <button className="rounded-md border border-line px-4 py-1.5 text-sm font-medium hover:bg-gray-50">
                    Preview
                  </button>
                  <button className="rounded-md border border-line px-4 py-1.5 text-sm font-medium hover:bg-gray-50">
                    Send test email
                  </button>
                </div>
              </div>

              <hr className="my-4 border-line" />

              <h4 className="font-semibold text-ink">Summary</h4>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Recipients</dt>
                  <dd className="text-ink">{draft.recipients.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Total reward value</dt>
                  <dd className="text-ink">{formatCents(draft.subtotalCents)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2">
                  <dt className="font-medium text-ink">Total (USD)</dt>
                  <dd className="font-medium text-ink">
                    {formatCents(draft.subtotalCents)}
                  </dd>
                </div>
              </dl>

              <label className="mt-4 block text-sm text-muted">
                External ID (optional)
                <input
                  value={draft.externalId}
                  onChange={(e) => draft.setExternalId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </label>

              <button
                onClick={() => setConfirmOpen(true)}
                className="mt-4 w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
              >
                Place order
              </button>
            </div>
          )}
        </div>
      </div>

      <PlaceOrderModal
        open={confirmOpen}
        recipientCount={draft.recipients.length}
        totalCents={draft.subtotalCents}
        paymentLabel={draft.paymentLabel}
        placing={placeOrder.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => placeOrder.mutate()}
      />
    </div>
  )
}

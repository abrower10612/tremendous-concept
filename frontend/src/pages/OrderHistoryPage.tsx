import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../lib/api'
import { formatCents } from '../lib/money'
import { OrderDetailPanel } from '../features/order/OrderDetailPanel'

const TABS = ['All orders', 'Complete', 'Canceled', 'Failed', 'Pending approval']

export function OrderHistoryPage() {
  const [params, setParams] = useSearchParams()
  const placedId = params.get('placed')
  const [selected, setSelected] = useState<string | null>(placedId)
  const [activeTab, setActiveTab] = useState('All orders')

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.list,
  })

  const totalCents = orders.reduce((s, o) => s + o.amount_cents, 0)

  const closePanel = () => {
    setSelected(null)
    if (placedId) {
      params.delete('placed')
      setParams(params, { replace: true })
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <h1 className="text-2xl font-semibold text-ink">Order history</h1>

      {/* Tabs */}
      <div className="mt-4 flex gap-6 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 pb-3 text-sm ${
              activeTab === tab
                ? 'border-brand font-medium text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-4 flex items-center gap-3">
        <input
          placeholder="Search ID or buyer"
          className="w-64 rounded-md border border-line px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <div className="rounded-md border border-line px-3 py-2 text-sm text-muted">
          Created at <span className="text-ink">Date range: All time</span>
        </div>
      </div>

      <div className="mt-4 text-sm">
        <span className="font-semibold text-ink">
          Orders: {orders.length}
        </span>
        <span className="mx-3 text-line">|</span>
        <span className="font-semibold text-ink">
          Total: {formatCents(totalCents)}
        </span>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-hidden rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-gray-50 text-left text-xs font-medium text-muted">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Rewards</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">External ID</th>
              <th className="px-4 py-3">Created on</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.public_id}
                onClick={() => setSelected(o.public_id)}
                className="cursor-pointer border-b border-line last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-brand">
                  {o.public_id}
                </td>
                <td className="px-4 py-3 text-ink">{o.order_type}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 capitalize">
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink">{o.rewards_count}</td>
                <td className="px-4 py-3 text-ink">{o.amount}</td>
                <td className="px-4 py-3 text-muted">{o.external_id || ''}</td>
                <td className="px-4 py-3 text-ink">{o.created_on}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailPanel
        publicId={selected}
        justPlaced={!!placedId && selected === placedId}
        onClose={closePanel}
      />
    </div>
  )
}

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, ChevronsUpDown, SlidersHorizontal, Download } from 'lucide-react'
import { ordersApi } from '../lib/api'
import { formatCents } from '../lib/money'
import { OrderDetailPanel } from '../features/order/OrderDetailPanel'

const TABS = ['All orders', 'Complete', 'Canceled', 'Failed', 'Pending approval']

// A sortable column header (label + up/down chevrons), matching Tremendous.
function SortableTh({ label }: { label: string }) {
  return (
    <th className="px-4 py-3 font-medium">
      <span className="inline-flex items-center gap-1">
        {label}
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted/70" />
      </span>
    </th>
  )
}

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
      <h1 className="text-[28px] font-semibold text-ink">Order history</h1>

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

      {/* Card: filter bar + count + table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-line">
        {/* Filter bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              placeholder="Search ID or buyer"
              className="w-64 rounded-md border border-line py-2 pr-3 pl-9 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <span className="text-sm text-muted">Created at</span>
          <div className="rounded-md border border-line px-3 py-2 text-sm text-muted">
            Date range: <span className="text-ink">All time</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-gray-50">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <button className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-gray-50">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {/* Count row */}
        <div className="border-t border-line px-4 py-3 text-sm">
          <span className="font-semibold text-ink">Orders: {orders.length}</span>
          <span className="mx-3 text-line">|</span>
          <span className="font-semibold text-ink">
            Total: {formatCents(totalCents)}
          </span>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-line bg-gray-50 text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <SortableTh label="Rewards" />
              <SortableTh label="Amount" />
              <SortableTh label="External ID" />
              <SortableTh label="Created on" />
              <th className="px-4 py-3 font-medium">Created by</th>
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
                <td className="px-4 py-3">
                  <span className="text-ink underline">{o.rewards_count}</span>
                </td>
                <td className="px-4 py-3 text-ink">{o.amount}</td>
                <td className="px-4 py-3 text-muted">{o.external_id || ''}</td>
                <td className="px-4 py-3 text-ink">{o.created_on}</td>
                <td className="px-4 py-3 text-ink">{o.created_by}</td>
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

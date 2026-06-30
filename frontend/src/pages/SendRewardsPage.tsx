import { useNavigate } from 'react-router-dom'
import { HandCoins, CreditCard, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

function OptionRow({
  label,
  onClick,
  enabled,
}: {
  label: string
  onClick?: () => void
  enabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border border-line bg-white px-5 py-4 text-left transition-shadow ${
        enabled ? 'hover:shadow-sm' : 'cursor-default'
      }`}
    >
      <span className="text-[15px] font-medium text-ink">{label}</span>
      <ChevronRight className="h-5 w-5 text-muted" />
    </button>
  )
}

function ProductBlock({
  icon,
  title,
  tag,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  tag: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-[1fr_460px]">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-ink">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-muted">
              {tag}
            </span>
          </div>
          <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

export function SendRewardsPage() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <h1 className="text-2xl font-semibold text-ink">Send rewards</h1>

      <div className="mt-2 divide-y divide-line">
        <ProductBlock
          icon={<HandCoins className="h-6 w-6" />}
          title="Digital rewards"
          tag="International"
          description="Send rewards quickly to recipients worldwide. Customize your catalog, messaging and branding."
        >
          <OptionRow
            label="Send via email"
            enabled
            onClick={() => navigate('/order/new')}
          />
          <OptionRow label="Send via text message" />
        </ProductBlock>

        <ProductBlock
          icon={<CreditCard className="h-6 w-6" />}
          title="Physical Visa cards"
          tag="US and Puerto Rico only"
          description="Offer physical Visa cards to recipients in the US and Puerto Rico. Cards ship in 1-3 weeks and are not customizable."
        >
          <OptionRow label="Ship cards to recipients" />
          <OptionRow label="Ship cards to me (bulk order)" />
        </ProductBlock>
      </div>
    </div>
  )
}

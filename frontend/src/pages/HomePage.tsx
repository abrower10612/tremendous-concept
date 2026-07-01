import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  ListChecks,
  UserCog,
  Link2,
  Code2,
  CheckCircle2,
  Tag,
  ChevronRight,
  Info,
} from 'lucide-react'
import type { ReactNode } from 'react'

function Tile({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-line bg-white px-5 py-4 text-left transition-shadow hover:shadow-sm"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-ink">
          {icon}
        </span>
        <span className="text-[15px] font-semibold text-ink">{label}</span>
      </span>
      <ChevronRight className="h-5 w-5 text-muted" />
    </button>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-[11px] font-bold tracking-widest text-muted uppercase">
      {children}
    </h2>
  )
}

export function HomePage() {
  const navigate = useNavigate()
  const ic = 'h-5 w-5'

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[1fr_360px]">
        {/* Left: history + team settings */}
        <div>
          <section className="mb-8">
            <SectionLabel>History</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Tile
                icon={<CreditCard className={ic} />}
                label="Placed orders"
                onClick={() => navigate('/history/orders')}
              />
              <Tile
                icon={<ListChecks className={ic} />}
                label="Reward history"
                onClick={() => navigate('/history/orders')}
              />
            </div>
          </section>

          <section>
            <SectionLabel>Team settings</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Tile icon={<UserCog className={ic} />} label="Manage users" />
              <Tile icon={<Link2 className={ic} />} label="Integrations" />
              <Tile icon={<Code2 className={ic} />} label="Taxes" />
              <Tile icon={<CheckCircle2 className={ic} />} label="Order approvals" />
              <Tile icon={<Tag className={ic} />} label="Custom fields" />
            </div>
          </section>
        </div>

        {/* Right: billing + help */}
        <div>
          <SectionLabel>Billing</SectionLabel>
          <div className="rounded-xl border border-line bg-white p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted">Available balance</div>
                <div className="mt-1 text-3xl font-semibold text-ink">$0.00</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted">
                  Pending balance <Info className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1 text-3xl font-semibold text-amber-600">
                  $0.00
                </div>
              </div>
            </div>
            <button className="mt-5 w-full rounded-md bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
              Add funds
            </button>
          </div>

          <div className="mt-8">
            <SectionLabel>We're here to help</SectionLabel>
            <p className="text-sm text-ink">Account management</p>
            <a className="text-sm text-brand" href="#">
              clients@tremendous.com
            </a>
            <p className="mt-3 text-sm text-ink">Help articles</p>
            <a className="text-sm text-brand" href="#">
              Visit our help center
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

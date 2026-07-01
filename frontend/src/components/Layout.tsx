import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  CreditCard,
  DollarSign,
  ShieldCheck,
  LayoutGrid,
  FileText,
  Users,
  Contact as ContactIcon,
  ChevronDown,
  ChevronRight,
  Search,
  MessageSquare,
  HelpCircle,
  UserCircle,
  Menu,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'

function Brand({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 pt-5 pb-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          T
        </div>
        <span className="text-[15px] font-bold tracking-wide text-white">
          TREMENDOUS
        </span>
      </div>
      {/* Close button, mobile drawer only */}
      <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden">
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

function TeamSwitcher() {
  return (
    <div className="px-4 pb-3">
      <div className="mb-1 text-[11px] font-semibold tracking-wide text-white/40">
        Team
      </div>
      <button className="flex w-full items-center justify-between rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white">
        Northwind Labs
        <ChevronDown className="h-4 w-4 text-white/60" />
      </button>
    </div>
  )
}

const ITEM =
  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors'

// A leaf nav row. Functional when `to` is set, decorative otherwise.
// `expandable` adds a right chevron to mimic Tremendous's collapsible sections.
function NavItem({
  to,
  icon,
  label,
  end,
  expandable,
}: {
  to?: string
  icon: ReactNode
  label: string
  end?: boolean
  expandable?: boolean
}) {
  const inner = (
    <>
      <span className="text-white/55">{icon}</span>
      <span className="flex-1">{label}</span>
      {expandable && <ChevronRight className="h-4 w-4 text-white/40" />}
    </>
  )

  if (!to) {
    return (
      <div className={`${ITEM} cursor-default text-white/70 hover:bg-sidebar-hover`}>
        {inner}
      </div>
    )
  }
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${ITEM} ${
          isActive
            ? 'bg-sidebar-hover font-medium text-white'
            : 'text-white/70 hover:bg-sidebar-hover'
        }`
      }
    >
      {inner}
    </NavLink>
  )
}

// Indented child row inside an expanded group.
function SubNavItem({ to, label }: { to?: string; label: string }) {
  const base = 'block rounded-md py-2 pr-3 pl-11 text-sm transition-colors'
  if (!to) {
    return (
      <div className={`${base} cursor-default text-white/60 hover:bg-sidebar-hover`}>
        {label}
      </div>
    )
  }
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${base} ${
          isActive
            ? 'bg-sidebar-hover font-medium text-white'
            : 'text-white/60 hover:bg-sidebar-hover'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

// Expandable parent (Orders & rewards) with a down/right chevron and children.
function NavGroup({
  icon,
  label,
  defaultOpen,
  children,
}: {
  icon: ReactNode
  label: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`${ITEM} w-full text-white/70 hover:bg-sidebar-hover`}
      >
        <span className="text-white/55">{icon}</span>
        <span className="flex-1 text-left">{label}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-white/50" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white/40" />
        )}
      </button>
      {open && <div className="mt-0.5 flex flex-col gap-0.5">{children}</div>}
    </div>
  )
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const ic = 'h-[18px] w-[18px]'
  const ordersActive = location.pathname.startsWith('/history')

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col overflow-y-auto bg-sidebar transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <Brand onClose={onClose} />
      <TeamSwitcher />
      <div className="px-4 pb-4">
        <button
          data-tour="send-rewards"
          onClick={() => navigate('/send-rewards')}
          className="w-full rounded-md bg-brand py-2 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Send rewards
        </button>
      </div>

      <div className="mb-1 px-4 text-[11px] font-semibold tracking-wide text-white/40">
        Menu
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-4">
        <NavItem to="/" end icon={<Home className={ic} />} label="Home" />

        <NavGroup
          icon={<CreditCard className={ic} />}
          label="Orders & rewards"
          defaultOpen={ordersActive}
        >
          <SubNavItem label="Reward history" />
          <SubNavItem to="/history/orders" label="Order history" />
          <SubNavItem label="Analytics" />
        </NavGroup>

        <NavItem
          to="/contacts"
          icon={<ContactIcon className={ic} />}
          label="Contacts"
        />
        <NavItem icon={<DollarSign className={ic} />} label="Billing" expandable />
        <NavItem
          icon={<ShieldCheck className={ic} />}
          label="Fraud prevention"
          expandable
        />
        <NavItem icon={<LayoutGrid className={ic} />} label="Campaigns" />
        <NavItem icon={<FileText className={ic} />} label="Taxes" expandable />
        <NavItem
          icon={<Users className={ic} />}
          label="Team settings"
          expandable
        />
      </nav>
    </aside>
  )
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white px-4 sm:px-6">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        data-tour="menu"
        className="text-muted hover:text-ink lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="relative min-w-0 flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          className="w-full rounded-lg border border-line bg-white py-2 pr-3 pl-9 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
          placeholder="Search rewards, recipients, or orders across teams"
        />
      </div>
      <button className="hidden text-muted hover:text-ink sm:block">
        <MessageSquare className="h-5 w-5" />
      </button>
      <button className="hidden text-muted hover:text-ink sm:block">
        <HelpCircle className="h-5 w-5" />
      </button>
      <button className="text-muted hover:text-ink">
        <UserCircle className="h-6 w-6" />
      </button>
    </header>
  )
}

export function Layout() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Backdrop for the mobile drawer */}
      {navOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setNavOpen(false)}
          aria-hidden
        />
      )}
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenu={() => setNavOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

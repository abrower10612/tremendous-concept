import { Routes, Route, Outlet } from 'react-router-dom'
import { Layout } from './components/Layout'
import { OrderDraftProvider } from './features/order/OrderDraftContext'
import { HomePage } from './pages/HomePage'
import { SendRewardsPage } from './pages/SendRewardsPage'
import { NewEmailOrderPage } from './pages/NewEmailOrderPage'
import { RecipientsPage } from './pages/RecipientsPage'
import { OrderHistoryPage } from './pages/OrderHistoryPage'
import { ContactsPage } from './pages/ContactsPage'

// The order-placement flow is full-screen (its own header) and shares a draft.
function OrderFlowLayout() {
  return (
    <OrderDraftProvider>
      <Outlet />
    </OrderDraftProvider>
  )
}

function App() {
  return (
    <Routes>
      {/* App-shell pages (sidebar + topbar) */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/send-rewards" element={<SendRewardsPage />} />
        <Route path="/history/orders" element={<OrderHistoryPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Route>

      {/* Full-screen order flow */}
      <Route element={<OrderFlowLayout />}>
        <Route path="/order/new" element={<NewEmailOrderPage />} />
        <Route path="/order/new/recipients" element={<RecipientsPage />} />
      </Route>
    </Routes>
  )
}

export default App

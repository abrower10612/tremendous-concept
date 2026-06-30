// Shared API types, mirroring the JSON the Rails backend returns.

export interface Contact {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface Recipient {
  id?: number
  name: string | null
  email: string
  amount_cents: number
  amount?: string
  currency: string
}

export interface OrderSummary {
  public_id: string
  order_type: string
  status: string
  campaign_name: string | null
  rewards_count: number
  amount_cents: number
  amount: string
  currency: string
  external_id: string | null
  created_on: string
  created_at: string
}

export interface OrderDetail extends OrderSummary {
  products_included: string | null
  payment_method_label: string | null
  placed_by_name: string | null
  placed_by_email: string | null
  subtotal_cents: number
  subtotal: string
  total: string
  recipients: Recipient[]
}

// Payload sent when placing an order.
export interface NewRecipient {
  name: string | null
  email: string
  amount_cents: number
  currency: string
}

export interface CreateOrderPayload {
  campaign_name?: string
  external_id?: string
  recipients_attributes: NewRecipient[]
}

import axios from 'axios'
import type {
  Contact,
  CreateOrderPayload,
  OrderDetail,
  OrderSummary,
} from '../types'

// Same-origin: Vite dev server proxies /api -> Rails on :3000.
const client = axios.create({ baseURL: '/api' })

// ----- Contacts -----
export const contactsApi = {
  list: () => client.get<Contact[]>('/contacts').then((r) => r.data),

  create: (contact: Omit<Contact, 'id'>) =>
    client.post<Contact>('/contacts', { contact }).then((r) => r.data),

  update: (id: number, contact: Partial<Omit<Contact, 'id'>>) =>
    client.patch<Contact>(`/contacts/${id}`, { contact }).then((r) => r.data),

  remove: (id: number) => client.delete(`/contacts/${id}`).then(() => id),
}

// ----- Orders -----
export const ordersApi = {
  list: () => client.get<OrderSummary[]>('/orders').then((r) => r.data),

  get: (publicId: string) =>
    client.get<OrderDetail>(`/orders/${publicId}`).then((r) => r.data),

  create: (order: CreateOrderPayload) =>
    client.post<OrderDetail>('/orders', { order }).then((r) => r.data),
}

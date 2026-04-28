import type { Product } from '@/models'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('seller_token')
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...options?.headers }
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error del servidor')
  return data as T
}

// Products
export const getProducts = (params?: { category?: string; search?: string; sort?: string; featured?: boolean }) => {
  const q = new URLSearchParams()
  if (params?.category && params.category !== 'Todos') q.set('category', params.category)
  if (params?.search) q.set('search', params.search)
  if (params?.sort) q.set('sort', params.sort)
  if (params?.featured) q.set('featured', 'true')
  return request<Product[]>(`/products?${q}`)
}

export const getProduct = (id: string) => request<Product>(`/products/${id}`)

export const createProduct = (data: Partial<Product>) =>
  request<Product>('/products', { method: 'POST', body: JSON.stringify(data) })

export const updateProduct = (id: string, data: Partial<Product>) =>
  request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteProduct = (id: string) =>
  request<{ ok: boolean }>(`/products/${id}`, { method: 'DELETE' })

// Orders
export interface OrderPayload {
  customerName: string
  customerEmail: string
  customerPhone: string
  delivery: 'home' | 'pickup'
  address?: string
  district?: string
  city?: string
  notes?: string
  culqiToken: string
  items: { productId: string; quantity: number }[]
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  delivery: string
  address?: string
  district?: string
  city?: string
  notes?: string
  total: number
  status: string
  culqiChargeId?: string
  createdAt: string
  items: { id: string; productId: string; quantity: number; price: number; product: { name: string; image: string } }[]
}

export const createOrder = (data: OrderPayload) =>
  request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) })

export const getOrders = () => request<Order[]>('/orders')

export const updateOrderStatus = (id: string, status: string) =>
  request<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

// Auth
export const login = (email: string, password: string) =>
  request<{ token: string; seller: { id: string; email: string; name: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const getMe = () =>
  request<{ id: string; email: string; name: string }>('/auth/me')

// Image upload
export const uploadImage = async (file: File): Promise<string> => {
  const token = localStorage.getItem('seller_token')
  const form = new FormData()
  form.append('image', file)
  const res = await fetch(`${BASE}/uploads/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  const data = await res.json() as { url?: string; error?: string }
  if (!res.ok) throw new Error(data.error || 'Error al subir imagen')
  return data.url!
}

// Culqi tokenization (calls Culqi's API directly with the public key)
export interface CardData {
  cardNumber: string
  cvv: string
  expirationMonth: string
  expirationYear: string
  email: string
}

export async function tokenizeCard(card: CardData): Promise<string> {
  const publicKey = import.meta.env.VITE_CULQI_PUBLIC_KEY
  if (!publicKey || publicKey === 'pk_test_placeholder') {
    // Dev mock — return a fake token
    return `tok_dev_${Date.now()}`
  }
  const res = await fetch('https://secure.culqi.com/v2/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicKey}` },
    body: JSON.stringify({
      card_number: card.cardNumber.replace(/\s/g, ''),
      cvv: card.cvv,
      expiration_month: card.expirationMonth,
      expiration_year: card.expirationYear,
      email: card.email,
    }),
  })
  const data = await res.json() as { id?: string; user_message?: string }
  if (!res.ok) throw new Error(data.user_message || 'Error al procesar tarjeta')
  return data.id!
}

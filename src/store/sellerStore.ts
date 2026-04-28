import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Seller {
  id: string
  email: string
  name: string
}

interface SellerStore {
  seller: Seller | null
  token: string | null
  setAuth: (seller: Seller, token: string) => void
  logout: () => void
}

export const useSellerStore = create<SellerStore>()(
  persist(
    (set) => ({
      seller: null,
      token: null,
      setAuth: (seller, token) => {
        localStorage.setItem('seller_token', token)
        set({ seller, token })
      },
      logout: () => {
        localStorage.removeItem('seller_token')
        set({ seller: null, token: null })
      },
    }),
    { name: 'amor-aventura-seller' }
  )
)

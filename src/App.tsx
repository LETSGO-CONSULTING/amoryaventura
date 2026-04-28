import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layout/MainLayout'
import Home from '@/pages/Home/Home'
import StorePage from '@/pages/Store/StorePage'
import CartPage from '@/pages/Cart/CartPage'
import CheckoutPage from '@/pages/Checkout/CheckoutPage'
import SellerLogin from '@/pages/Seller/SellerLogin'
import SellerDashboard from '@/pages/Seller/SellerDashboard'
import { useSellerStore } from '@/store/sellerStore'

function SellerGuard({ children }: { children: React.ReactNode }) {
  const seller = useSellerStore(s => s.seller)
  if (!seller) return <Navigate to="/vendedor" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with main layout (header/footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<StorePage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Seller routes — no main layout */}
        <Route path="/vendedor" element={<SellerLogin />} />
        <Route path="/vendedor/dashboard" element={<SellerGuard><SellerDashboard /></SellerGuard>} />
      </Routes>
    </BrowserRouter>
  )
}

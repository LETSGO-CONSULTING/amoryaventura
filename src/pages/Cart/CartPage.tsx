import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()
  const total = totalPrice()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-sand/20 flex flex-col items-center justify-center text-gray-400 px-4">
        <ShoppingBag size={64} className="mb-4 opacity-20" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
        <p className="text-sm mb-6 text-center">Agrega productos desde nuestra tienda</p>
        <a href="/tienda" className="flex items-center gap-2 bg-coral text-white px-6 py-3 rounded-xl font-semibold hover:bg-terracota transition-colors">
          <ArrowLeft size={16} />
          Ver tienda
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand/20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tu carrito</h1>
          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map(({ product, quantity }) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12, height: 0 }}
                  className="bg-white rounded-2xl p-4 flex gap-4 border border-sand/30 shadow-sm"
                >
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-terracota font-medium">{product.category}</span>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mt-0.5 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{product.region}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">S/ {(product.price * quantity).toFixed(2)}</span>
                        <button onClick={() => removeItem(product.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-sand/30 shadow-sm sticky top-4">
              <h2 className="font-bold text-gray-900 mb-4">Resumen</h2>
              <div className="space-y-2 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate mr-2">{product.name} ×{quantity}</span>
                    <span className="font-medium shrink-0">S/ {(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand/40 pt-3 mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Subtotal</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>Envío</span>
                  <span className="text-green-600">A coordinar</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>
              <a
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-coral text-white py-3 rounded-xl font-semibold hover:bg-terracota transition-colors"
              >
                Pagar ahora
                <ArrowRight size={16} />
              </a>
              <a href="/tienda" className="w-full flex items-center justify-center gap-2 mt-2 text-sm text-gray-500 hover:text-coral transition-colors py-2">
                <ArrowLeft size={14} />
                Seguir comprando
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

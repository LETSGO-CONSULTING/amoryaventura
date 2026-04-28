import { useState, FormEvent } from 'react'
import { CheckCircle, MapPin, Building2, CreditCard, ArrowLeft, ArrowRight, Loader2, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { createOrder, tokenizeCard, type CardData } from '@/lib/api'
import type { Order } from '@/lib/api'

type Step = 'info' | 'delivery' | 'payment' | 'success'

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

interface DeliveryInfo {
  method: 'home' | 'pickup'
  address: string
  district: string
  city: string
  notes: string
}

const STEPS: { key: Step; label: string }[] = [
  { key: 'info', label: 'Datos' },
  { key: 'delivery', label: 'Envío' },
  { key: 'payment', label: 'Pago' },
]

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex(s => s.key === current)
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            i < idx ? 'text-green-600' : i === idx ? 'bg-coral text-white' : 'text-gray-400'
          }`}>
            {i < idx ? <CheckCircle size={14} /> : <span className="w-4 h-4 flex items-center justify-center text-xs">{i + 1}</span>}
            {step.label}
          </div>
          {i < STEPS.length - 1 && <div className={`h-px w-6 mx-1 ${i < idx ? 'bg-green-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )
}

function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const total = totalPrice()

  const [step, setStep] = useState<Step>('info')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  const [info, setInfo] = useState<CustomerInfo>({ name: '', email: '', phone: '' })
  const [delivery, setDelivery] = useState<DeliveryInfo>({ method: 'pickup', address: '', district: '', city: 'Oxapampa', notes: '' })
  const [card, setCard] = useState<CardData & { displayNumber: string; expiryDisplay: string; cardName: string }>({
    cardNumber: '', displayNumber: '', cvv: '', expirationMonth: '', expirationYear: '', expiryDisplay: '', email: '', cardName: '',
  })

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-sand/20 flex flex-col items-center justify-center text-gray-400 px-4">
        <p className="text-lg font-medium text-gray-700 mb-4">Tu carrito está vacío</p>
        <a href="/tienda" className="bg-coral text-white px-6 py-3 rounded-xl font-semibold hover:bg-terracota transition-colors">
          Ver tienda
        </a>
      </div>
    )
  }

  const handleInfoSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!info.name || !info.email || !info.phone) return
    setStep('delivery')
  }

  const handleDeliverySubmit = (e: FormEvent) => {
    e.preventDefault()
    if (delivery.method === 'home' && !delivery.address) return
    setStep('payment')
  }

  const handleExpiryInput = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 4)
    const display = clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean
    const month = clean.slice(0, 2)
    const year = clean.length >= 4 ? `20${clean.slice(2, 4)}` : ''
    setCard(c => ({ ...c, expiryDisplay: display, expirationMonth: month, expirationYear: year }))
  }

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await tokenizeCard({ ...card, email: info.email })
      const result = await createOrder({
        customerName: info.name,
        customerEmail: info.email,
        customerPhone: info.phone,
        delivery: delivery.method,
        address: delivery.method === 'home' ? delivery.address : undefined,
        district: delivery.method === 'home' ? delivery.district : undefined,
        city: delivery.method === 'home' ? delivery.city : undefined,
        notes: delivery.notes || undefined,
        culqiToken: token,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      })
      setOrder(result)
      setStep('success')
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success' && order) {
    return (
      <div className="min-h-screen bg-sand/20 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-sand/30"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h2>
          <p className="text-gray-500 mb-1">Pedido #{order.id.slice(-8).toUpperCase()}</p>
          <p className="text-gray-500 text-sm mb-4">Te enviamos los detalles a <strong>{order.customerEmail}</strong></p>
          <div className="bg-sand/30 rounded-2xl p-4 mb-6 text-left space-y-2">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.product.name} ×{item.quantity}</span>
                <span className="font-medium">S/ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-sand/60 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>S/ {order.total.toFixed(2)}</span>
            </div>
          </div>
          {order.delivery === 'home' ? (
            <p className="text-sm text-gray-500 mb-6">
              <MapPin size={14} className="inline mr-1" />
              Envío a: {order.address}, {order.district}, {order.city}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-6">
              <Building2 size={14} className="inline mr-1" />
              Recojo en tienda — Oxapampa, Pasco
            </p>
          )}
          <a href="/tienda" className="w-full inline-flex items-center justify-center gap-2 bg-coral text-white py-3 rounded-xl font-semibold hover:bg-terracota transition-colors">
            Seguir comprando
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand/20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <a href="/carrito" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-coral transition-colors mb-6">
          <ArrowLeft size={14} />
          Volver al carrito
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-sand/30 shadow-sm">
              <StepIndicator current={step} />

              <AnimatePresence mode="wait">
                {step === 'info' && (
                  <motion.form key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleInfoSubmit} className="space-y-4">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Tus datos</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input required value={info.name} onChange={e => setInfo(i => ({ ...i, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                        placeholder="Juan Pérez" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                      <input required type="email" value={info.email} onChange={e => setInfo(i => ({ ...i, email: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                        placeholder="correo@ejemplo.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                      <input required value={info.phone} onChange={e => setInfo(i => ({ ...i, phone: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                        placeholder="+51 9XX XXX XXX" />
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-coral text-white py-3 rounded-xl font-semibold hover:bg-terracota transition-colors">
                      Continuar <ArrowRight size={16} />
                    </button>
                  </motion.form>
                )}

                {step === 'delivery' && (
                  <motion.form key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleDeliverySubmit} className="space-y-4">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Método de entrega</h2>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setDelivery(d => ({ ...d, method: 'pickup' }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${delivery.method === 'pickup' ? 'border-coral bg-coral/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <Building2 size={24} className={delivery.method === 'pickup' ? 'text-coral' : 'text-gray-400'} />
                        <span className={`font-semibold text-sm ${delivery.method === 'pickup' ? 'text-coral' : 'text-gray-600'}`}>Recojo en tienda</span>
                        <span className="text-xs text-gray-400">Oxapampa, Pasco</span>
                        <span className="text-xs font-medium text-green-600">Gratis</span>
                      </button>
                      <button type="button" onClick={() => setDelivery(d => ({ ...d, method: 'home' }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${delivery.method === 'home' ? 'border-coral bg-coral/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <MapPin size={24} className={delivery.method === 'home' ? 'text-coral' : 'text-gray-400'} />
                        <span className={`font-semibold text-sm ${delivery.method === 'home' ? 'text-coral' : 'text-gray-600'}`}>Delivery a domicilio</span>
                        <span className="text-xs text-gray-400">A coordinar</span>
                        <span className="text-xs font-medium text-gray-500">Tarifa variable</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {delivery.method === 'home' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                            <input required={delivery.method === 'home'} value={delivery.address} onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                              placeholder="Av. Principal 123" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
                              <input value={delivery.district} onChange={e => setDelivery(d => ({ ...d, district: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                                placeholder="Oxapampa" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                              <input value={delivery.city} onChange={e => setDelivery(d => ({ ...d, city: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                                placeholder="Oxapampa" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                      <textarea value={delivery.notes} onChange={e => setDelivery(d => ({ ...d, notes: e.target.value }))} rows={2}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral resize-none"
                        placeholder="Referencias, instrucciones, etc." />
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep('info')} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={14} /> Atrás
                      </button>
                      <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-coral text-white py-3 rounded-xl font-semibold hover:bg-terracota transition-colors">
                        Continuar <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 'payment' && (
                  <motion.form key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handlePayment} className="space-y-4">
                    <h2 className="font-bold text-lg text-gray-900 mb-1">Pago con tarjeta</h2>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                      <Lock size={11} /> Pago seguro procesado por Culqi
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en tarjeta</label>
                      <input required value={card.cardName} onChange={e => setCard(c => ({ ...c, cardName: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                        placeholder="JUAN PEREZ" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                      <div className="relative">
                        <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input required value={card.displayNumber}
                          onChange={e => {
                            const display = formatCard(e.target.value)
                            const raw = display.replace(/\s/g, '')
                            setCard(c => ({ ...c, displayNumber: display, cardNumber: raw }))
                          }}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                          placeholder="1234 5678 9012 3456" maxLength={19} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
                        <input required value={card.expiryDisplay} onChange={e => handleExpiryInput(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                          placeholder="MM/AA" maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input required value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                          placeholder="123" maxLength={4} />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep('delivery')} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={14} /> Atrás
                      </button>
                      <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 bg-coral text-white py-3 rounded-xl font-semibold hover:bg-terracota transition-colors disabled:opacity-60">
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Procesando...</> : <>Pagar S/ {total.toFixed(2)} <Lock size={14} /></>}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-sand/30 shadow-sm sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Tu pedido</h3>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">×{quantity}</p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">S/ {(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand/40 pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                {delivery.method === 'home' && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Envío</span>
                    <span>A coordinar</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>
              {delivery.method === 'pickup' && step !== 'info' && (
                <div className="mt-3 flex items-start gap-2 bg-green-50 rounded-xl p-3">
                  <Building2 size={14} className="text-green-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-700">Recojo en tienda — Oxapampa, Pasco. Te contactaremos para coordinar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
